import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { processImage, generateFileName } from "@/utils/processImage";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const uploadSchema = z.object({
  type: z.enum(["logo", "banner", "menu"]),
  itemId: z.string().uuid().optional(), // Solo para menu items
});

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const restaurantId = session.user.user_metadata.restaurant_id;
    if (!restaurantId) {
      return NextResponse.json({ error: "Sin restaurante asociado" }, { status: 403 });
    }

    // 2. Parsear FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string;
    const itemId = formData.get("itemId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
    }

    // 3. Validar parámetros con Zod
    const validation = uploadSchema.safeParse({ type, itemId: itemId || undefined });
    if (!validation.success) {
      return NextResponse.json(
        { error: "Tipo de imagen inválido", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // 4. Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "El archivo excede el límite de 5 MB" },
        { status: 400 }
      );
    }

    // 5. Validar tipo MIME
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      return NextResponse.json(
        { error: "Solo se permiten imágenes (JPG, PNG, WebP, GIF)" },
        { status: 400 }
      );
    }

    // 6. Procesar imagen con Sharp
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);
    const processedBuffer = await processImage(inputBuffer, validation.data.type);

    // 7. Generar ruta en Storage
    const fileName = generateFileName(validation.data.type);
    let storagePath: string;

    if (validation.data.type === "menu" && validation.data.itemId) {
      storagePath = `${restaurantId}/menu/${validation.data.itemId}.webp`;
    } else {
      storagePath = `${restaurantId}/branding/${fileName}`;
    }

    // 8. Subir a Supabase Storage (con admin client para evitar RLS del server component)
    const adminSupabase = createAdminClient();
    const { error: uploadError } = await adminSupabase.storage
      .from("restaurants")
      .upload(storagePath, processedBuffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) {
      console.error("[Upload] Storage error:", uploadError.message);
      return NextResponse.json(
        { error: "Error al subir la imagen" },
        { status: 500 }
      );
    }

    // 9. Obtener URL pública
    const { data: urlData } = adminSupabase.storage
      .from("restaurants")
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // 10. Si es logo o banner, actualizar la tabla restaurants directamente
    if (validation.data.type === "logo") {
      const { error: updateError } = await adminSupabase
        .from("restaurants")
        .update({ logo_url: publicUrl })
        .eq("id", restaurantId);

      if (updateError) {
        console.error("[Upload] DB update error:", updateError.message);
      }
    } else if (validation.data.type === "banner") {
      const { error: updateError } = await adminSupabase
        .from("restaurants")
        .update({ banner_url: publicUrl })
        .eq("id", restaurantId);

      if (updateError) {
        console.error("[Upload] DB update error:", updateError.message);
      }
    }

    // 11. Si es menu item, actualizar image_url
    if (validation.data.type === "menu" && validation.data.itemId) {
      const { error: updateError } = await adminSupabase
        .from("menu_items")
        .update({ image_url: publicUrl })
        .eq("id", validation.data.itemId)
        .eq("restaurant_id", restaurantId);

      if (updateError) {
        console.error("[Upload] Menu item update error:", updateError.message);
      }
    }

    // 12. Invalidar caché para refrescar el Portal del Cliente y Dashboard
    revalidatePath("/dashboard/settings");
    revalidatePath("/", "layout");

    return NextResponse.json({
      data: {
        url: publicUrl,
        path: storagePath,
        type: validation.data.type,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("[Upload] Unexpected error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

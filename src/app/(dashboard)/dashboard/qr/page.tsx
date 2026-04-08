import { createClient } from "@/lib/supabase/server";
import { getRestaurantBySlug } from "@/services/restaurant";
import { QRClient } from "@/app/(dashboard)/dashboard/qr/qr-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Mi Código QR | Gastroflow",
  description: "Descarga el código QR para que tus clientes accedan a tu carta digital.",
};

export default async function QRPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const restaurantId = session.user.user_metadata.restaurant_id;

  if (!restaurantId) {
    return (
      <div className="p-8 text-center text-error border-2 border-dashed border-error/20 rounded-xl bg-error/5">
        <h2 className="text-xl font-bold mb-2">Error de Configuración</h2>
        <p className="text-sm">Tu usuario no tiene un restaurante asociado en sus metadatos.</p>
      </div>
    );
  }

  // Obtenemos los datos del restaurante para el slug y logo
  const { data: restaurant, error } = await supabase
    .from("restaurants")
    .select("slug, name, logo_url")
    .eq("id", restaurantId)
    .single();

  if (error || !restaurant) {
    return (
        <div className="p-8 text-center text-on-surface-variant">
            No se encontró información del restaurante.
        </div>
    );
  }

  return (
    <QRClient 
      slug={restaurant.slug} 
      name={restaurant.name} 
      logoUrl={restaurant.logo_url} 
    />
  );
}

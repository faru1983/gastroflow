import { createClient } from "@/lib/supabase/server";
import { getMenuCategories, getMenuItems } from "@/services/restaurant";
import { MenuClient } from "@/app/(dashboard)/dashboard/menu/menu-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Gestión de Menú | Gastroflow",
  description: "Administra los platos y categorías de tu restaurante.",
};

export default async function MenuManagementPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const restaurantId = session.user.user_metadata.restaurant_id;

  if (!restaurantId) {
    // Si no tiene restaurant_id, es un error de configuración del usuario o es superadmin
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold text-error">Configuración incompleta</h1>
        <p className="text-on-surface-variant">Tu usuario no tiene un restaurante asociado.</p>
      </div>
    );
  }

  // Carga de datos inicial
  const [categories, items] = await Promise.all([
    getMenuCategories(restaurantId),
    getMenuItems(restaurantId)
  ]);

  return (
    <MenuClient 
      initialCategories={categories || []} 
      initialItems={items || []} 
      restaurantId={restaurantId}
    />
  );
}

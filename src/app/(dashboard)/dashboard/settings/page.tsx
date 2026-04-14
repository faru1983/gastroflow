import { createClient } from "@/lib/supabase/server";
import { getRestaurantById } from "@/services/restaurant";
import { RestaurantSettingsForm } from "@/components/dashboard/settings/RestaurantSettingsForm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Configuración | Gastroflow",
  description: "Personaliza la información y apariencia de tu restaurante.",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const restaurantId = session.user.user_metadata.restaurant_id;

  if (!restaurantId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-on-surface-variant">No se encontró información del restaurante.</p>
      </div>
    );
  }

  const restaurant = await getRestaurantById(restaurantId);

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-on-surface-variant">Error al cargar datos del restaurante.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-4 md:px-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">Configuración</h1>
        <p className="text-sm text-on-surface-variant italic">
          Personaliza la información y apariencia de tu Portal del Cliente.
        </p>
      </div>

      <RestaurantSettingsForm restaurant={restaurant} />
    </div>
  );
}

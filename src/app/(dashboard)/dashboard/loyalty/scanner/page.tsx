import { createClient } from "@/lib/supabase/server";
import { ScannerClient } from "./scanner-client";

export default async function LoyaltyScannerPage() {
  const supabase = await createClient();
  
  // Obtenemos los datos del restaurante actual del usuario (staff o admin)
  const { data: { user } } = await supabase.auth.getUser();
  const restaurantId = user?.user_metadata?.restaurant_id;

  if (!restaurantId) {
    return (
      <div className="p-8 text-center bg-error/10 text-error rounded-xl">
        Error: No se encontró un restaurante asociado a tu cuenta.
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 max-w-lg mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">Registrar Visita</h1>
        <p className="text-sm text-on-surface-variant">Escanea los códigos de los comensales al momento del pago.</p>
      </div>

      <ScannerClient restaurantId={restaurantId} />
    </div>
  );
}

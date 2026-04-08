import { createClient } from "@/lib/supabase/server";
import { LoyaltyStats } from "./loyalty-stats";
import { RewardConfig } from "./reward-config";
import { CustomerRanking } from "./customer-ranking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, BarChart3, Users, Settings2 } from "lucide-react";

export default async function LoyaltyDashboardPage() {
  const supabase = await createClient();
  
  // Obtenemos el ID del restaurante desde el contexto del usuario autenticado
  const { data: { user } } = await supabase.auth.getUser();
  const restaurantId = user?.user_metadata?.restaurant_id;

  if (!restaurantId) return <div>Error: No restaurant context.</div>;

  // Cargamos los datos del restaurante para la configuración
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", restaurantId)
    .single();

  // Cargamos métricas básicas
  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .eq("restaurant_id", restaurantId);

  const { data: visits } = await supabase
    .from("loyalty_visits")
    .select("*")
    .eq("restaurant_id", restaurantId);

  return (
    <div className="flex-1 p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">Club de Fidelidad</h1>
          <p className="text-on-surface-variant">Gestiona tus premios, analiza tus clientes y aumenta la recurrencia.</p>
        </div>
      </div>

      <LoyaltyStats customers={customers || []} visits={visits || []} />

      <Tabs defaultValue="ranking" className="w-full">
        <TabsList className="bg-surface-container-low border border-outline-variant/10 p-1 mb-6">
          <TabsTrigger value="ranking" className="gap-2">
            <Users size={16} />
            Ranking de Clientes
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-2">
            <Settings2 size={16} />
            Configuración de Premios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ranking" className="space-y-6">
          <CustomerRanking restaurantId={restaurantId} customers={customers || []} />
        </TabsContent>

        <TabsContent value="config">
          <RewardConfig restaurant={restaurant} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

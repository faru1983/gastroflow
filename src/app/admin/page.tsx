import { Card } from "@/components/ui";
import { createAdminClient } from "@/lib/supabase/admin";
import { Building2, Users, Calendar, Banknote } from "lucide-react";

export default async function SuperAdminDashboard() {
  const supabase = createAdminClient();

  // Estadísticas globales del SaaS
  const { count: restaurantCount } = await supabase.from("restaurants").select("*", { count: "exact", head: true });
  const { count: customerCount } = await supabase.from("customers").select("*", { count: "exact", head: true });
  const { count: reservationCount } = await supabase.from("reservations").select("*", { count: "exact", head: true });

  const adminStats = [
    { label: "Restaurantes", value: restaurantCount || 0, icon: Building2, color: "text-primary" },
    { label: "Clientes Totales", value: customerCount || 0, icon: Users, color: "text-tertiary" },
    { label: "Reservas Totales", value: reservationCount || 0, icon: Calendar, color: "text-primary" },
    { label: "MRR Estimado", value: "$0", icon: Banknote, color: "text-tertiary" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">Panel Maestro</h1>
        <p className="text-on-surface-variant">Vista global del ecosistema Gastroflow SaaS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, i) => (
          <Card key={i} className="p-6 border-none bg-surface-container-low">
            <div className={`p-2 w-fit rounded-lg bg-surface-container-high ${stat.color} mb-4`}>
              <stat.icon size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-on-surface-variant">{stat.label}</p>
              <h3 className="text-3xl font-bold text-on-surface tracking-tight">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="p-6 border-none bg-surface-container-low min-h-[300px] flex items-center justify-center text-center">
            <div className="max-w-xs space-y-2">
               <Building2 size={40} className="mx-auto text-outline/20 mb-4" />
               <h4 className="font-bold text-on-surface">Últimos Restaurantes</h4>
               <p className="text-xs text-on-surface-variant">Próximamente implementaremos la lista de altas recientes y gestión de planes.</p>
            </div>
         </Card>
         <Card className="p-6 border-none bg-surface-container-low min-h-[300px] flex items-center justify-center text-center">
            <div className="max-w-xs space-y-2">
               <Banknote size={40} className="mx-auto text-outline/20 mb-4" />
               <h4 className="font-bold text-on-surface">Log de Actividad Global</h4>
               <p className="text-xs text-on-surface-variant">Aquí verás los registros de pagos y suscripciones de Transbank/Stripe.</p>
            </div>
         </Card>
      </section>
    </div>
  );
}

import { Card } from "@/components/ui";
import { Users, TrendingUp, CreditCard, Heart } from "lucide-react";

interface LoyaltyStatsProps {
  customers: any[];
  visits: any[];
}

export function LoyaltyStats({ customers, visits }: LoyaltyStatsProps) {
  // Cálculos rápidos
  const totalCustomers = customers.length;
  const totalSpent = customers.reduce((acc, curr) => acc + (Number(curr.total_spent) || 0), 0);
  const avgSpent = totalCustomers > 0 ? totalSpent / totalCustomers : 0;
  
  // Clientes que han venido en los últimos 30 días
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const activeCustomers = customers.filter(c => c.last_visit_at && new Date(c.last_visit_at) > thirtyDaysAgo).length;

  const stats = [
    {
      label: "Total de Clientes",
      value: totalCustomers,
      icon: Users,
      description: "Suscritos al club",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      label: "Gasto Promedio",
      value: `$${avgSpent.toFixed(0)}`,
      icon: TrendingUp,
      description: "Por cliente registrado",
      color: "text-tertiary",
      bg: "bg-tertiary/10"
    },
    {
        label: "Clientes Activos",
        value: activeCustomers,
        icon: Heart,
        description: "Visitaron en últimos 30 días",
        color: "text-primary",
        bg: "bg-primary/10"
      },
    {
      label: "ROI (Gasto Total)",
      value: `$${totalSpent.toLocaleString()}`,
      icon: CreditCard,
      description: "Generado vía fidelización",
      color: "text-primary",
      bg: "bg-primary/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="p-6 border-none bg-surface-container-low shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-on-surface-variant">{stat.label}</p>
            <h3 className="text-2xl font-bold text-on-surface">{stat.value}</h3>
            <p className="text-[10px] text-outline uppercase tracking-wider">{stat.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

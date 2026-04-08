import { Card } from "@/components/ui";
import { BarChart3, Banknote, TrendingUp } from "lucide-react";

export default function AdminStatsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">Finanzas SaaS</h1>
        <p className="text-on-surface-variant flex items-center gap-2">
          <Banknote size={16} />
          Métricas de ingresos y rendimiento global del servicio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="p-8 border-none bg-surface-container-low flex flex-col items-center justify-center text-center">
            <TrendingUp size={40} className="text-tertiary mb-4 opacity-20" />
            <h3 className="font-bold text-on-surface">MRR & Churn</h3>
            <p className="text-xs text-on-surface-variant mt-2">Métricas delegadas a Stripe/Transbank Analytics.</p>
         </Card>
      </div>
    </div>
  );
}

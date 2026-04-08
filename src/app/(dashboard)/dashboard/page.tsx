import { Card, Badge, Button } from "@/components/ui";
import { 
  Users, 
  CalendarDays, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  MoreVertical 
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">Panel de Control</h1>
          <p className="text-sm text-on-surface-variant italic">Hola de nuevo, aquí tienes el resumen de hoy.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-surface-container border-none">Compartir Carta</Button>
            <Button size="sm" className="shadow-lg shadow-primary/20">Nueva Reserva</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Reservas hoy", value: "12", icon: CalendarDays, color: "text-primary", bg: "bg-primary/10" },
          { label: "Clientes", value: "342", icon: Users, color: "text-tertiary", bg: "bg-tertiary/10" },
          { label: "Ocupación", value: "85%", icon: TrendingUp, color: "text-success", bg: "bg-success/10" },
          { label: "Siguiente", value: "20:30", icon: Clock, color: "text-secondary", bg: "bg-secondary/10" },
        ].map((stat, i) => (
          <Card key={i} className="p-3 border-none bg-surface-container-low flex flex-col justify-between h-28">
            <div className="flex justify-between items-start">
               <div className={`p-1.5 rounded-[6px] ${stat.bg} ${stat.color}`}>
                  <stat.icon size={16} />
               </div>
               <Badge variant="outline" size="sm" className="text-[9px] py-0 border-transparent bg-surface-container-high">+12%</Badge>
            </div>
            <div>
              <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-on-surface">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Reservations */}
        <Card className="lg:col-span-2 p-0 overflow-hidden border-none bg-surface-container-low">
            <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <CalendarDays size={16} className="text-primary" />
                    Reservas próximas
                </h3>
                <Button variant="ghost" size="sm" className="text-xs text-primary">Ver todas</Button>
            </div>
            <div className="divide-y divide-outline-variant/20">
                {[
                    { name: "Familia González", time: "13:30", guests: 4, status: "confirmada" },
                    { name: "Marta Rivas", time: "14:00", guests: 2, status: "pendiente" },
                    { name: "Cena Aniversario", time: "20:30", guests: 2, status: "confirmada" },
                ].map((res, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-surface-container-high/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold text-outline">
                                {res.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-semibold">{res.name}</p>
                                <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                                    <Clock size={10} /> {res.time} · {res.guests} pers.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant={res.status === "confirmada" ? "success" : "tertiary"} size="sm">
                                {res.status}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowUpRight size={14} className="text-outline" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>

        {/* Quick Insights */}
        <div className="space-y-6">
            <Card className="p-4 border-none bg-surface-container-high relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Tip del Maître</p>
                    <p className="text-sm text-on-surface leading-snug">
                        Mañana tienes 3 reservas grandes (+6 pers). Asegúrate de bloquear las mesas centrales.
                    </p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-5">
                    <TrendingUp size={80} />
                </div>
            </Card>

            <Card className="p-4 border-none bg-tertiary-container/10 border-l-4 border-tertiary">
                <p className="text-xs font-bold text-tertiary uppercase tracking-widest mb-1">Recordatorio</p>
                <p className="text-sm text-on-surface leading-snug">
                    Tu periodo de prueba termina en 28 días. Configura tus medios de pago para no perder el acceso.
                </p>
                <Button variant="tertiary" size="sm" className="mt-3 h-8 text-[11px]">Ver Planes</Button>
            </Card>
        </div>
      </div>
    </div>
  );
}

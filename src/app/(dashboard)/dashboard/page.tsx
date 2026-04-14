import { Card, Badge, Button } from "@/components/ui";
import {
  Users,
  CalendarDays,
  UtensilsCrossed,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getDashboardStats, getUpcomingReservations, getTrialInfo } from "@/services/dashboard";
import Link from "next/link";

export const metadata = {
  title: "Panel de Control | Gastroflow",
  description: "Vista general de tu restaurante.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const restaurantId = session.user.user_metadata.restaurant_id;

  if (!restaurantId) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold text-error">Configuración incompleta</h1>
        <p className="text-on-surface-variant">Tu usuario no tiene un restaurante asociado.</p>
      </div>
    );
  }

  // Cargar datos en paralelo
  const [stats, reservations, trialInfo] = await Promise.all([
    getDashboardStats(restaurantId),
    getUpcomingReservations(restaurantId, 5),
    getTrialInfo(restaurantId),
  ]);

  const statCards = [
    {
      label: "Reservas hoy",
      value: stats.reservationsToday.toString(),
      icon: CalendarDays,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Clientes",
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: "text-tertiary",
      bg: "bg-tertiary/10",
    },
    {
      label: "Platos activos",
      value: stats.activeMenuItems.toString(),
      icon: UtensilsCrossed,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Siguiente",
      value: stats.nextReservationTime || "—",
      icon: Clock,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">Panel de Control</h1>
          <p className="text-sm text-on-surface-variant italic">Hola de nuevo, aquí tienes el resumen de hoy.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-surface-container border-none" asChild>
            <Link href="/dashboard/menu">Gestionar Carta</Link>
          </Button>
          <Button size="sm" className="shadow-lg shadow-primary/20" asChild>
            <Link href="/dashboard/reservations">Nueva Reserva</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat, i) => (
          <Card key={i} className="p-3 border-none bg-surface-container-low flex flex-col justify-between h-28">
            <div className="flex justify-between items-start">
              <div className={`p-1.5 rounded-[6px] ${stat.bg} ${stat.color}`}>
                <stat.icon size={16} />
              </div>
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
              Reservas de hoy
            </h3>
            <Button variant="ghost" size="sm" className="text-xs text-primary" asChild>
              <Link href="/dashboard/reservations">Ver todas</Link>
            </Button>
          </div>
          <div className="divide-y divide-outline-variant/20">
            {reservations.length === 0 ? (
              <div className="p-8 text-center">
                <CalendarDays size={32} className="mx-auto text-outline/20 mb-3" />
                <p className="text-sm text-on-surface-variant">No hay reservas para hoy.</p>
                <p className="text-xs text-outline mt-1">Las reservas aparecerán aquí automáticamente.</p>
              </div>
            ) : (
              reservations.map((res) => (
                <div key={res.id} className="p-4 flex items-center justify-between hover:bg-surface-container-high/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold text-outline">
                      {res.customer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{res.customer_name}</p>
                      <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                        <Clock size={10} /> {res.time?.substring(0, 5)} · {res.party_size} pers.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={res.status === "confirmed" ? "success" : "tertiary"} size="sm">
                      {res.status === "confirmed" ? "confirmada" : res.status === "pending" ? "pendiente" : res.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/dashboard/reservations`}>
                        <ArrowUpRight size={14} className="text-outline" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Quick Insights */}
        <div className="space-y-6">
          <Card className="p-4 border-none bg-surface-container-high relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Resumen</p>
              <p className="text-sm text-on-surface leading-snug">
                Tienes <strong className="text-primary">{stats.activeMenuItems}</strong> platos activos en tu carta
                y <strong className="text-tertiary">{stats.totalCustomers}</strong> clientes registrados.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <TrendingUp size={80} />
            </div>
          </Card>

          {trialInfo.status === "trial" && (
            <Card className="p-4 border-none bg-tertiary-container/10 border-l-4 border-tertiary">
              <p className="text-xs font-bold text-tertiary uppercase tracking-widest mb-1">Período de Prueba</p>
              <p className="text-sm text-on-surface leading-snug">
                Te quedan <strong className="text-tertiary">{trialInfo.daysRemaining} días</strong> de prueba gratuita.
                Configura tus medios de pago para no perder el acceso.
              </p>
              <Button variant="tertiary" size="sm" className="mt-3 h-8 text-[11px]">Ver Planes</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { differenceInDays, format } from "date-fns";

export interface DashboardStats {
  reservationsToday: number;
  totalCustomers: number;
  activeMenuItems: number;
  nextReservationTime: string | null;
}

export interface UpcomingReservation {
  id: string;
  customer_name: string;
  time: string;
  party_size: number;
  status: string;
  date: string;
}

/**
 * Obtiene las estadísticas clave del dashboard.
 */
export async function getDashboardStats(restaurantId: string): Promise<DashboardStats> {
  const supabase = createAdminClient();
  const today = format(new Date(), "yyyy-MM-dd");

  // Ejecutar todas las queries en paralelo
  const [reservationsResult, customersResult, menuResult, nextResult] = await Promise.all([
    // Reservas de hoy (no canceladas)
    supabase
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId)
      .eq("date", today)
      .neq("status", "cancelled"),

    // Total de clientes registrados
    supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId),

    // Platos activos en el menú
    supabase
      .from("menu_items")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId)
      .eq("active", true),

    // Próxima reserva de hoy
    supabase
      .from("reservations")
      .select("time")
      .eq("restaurant_id", restaurantId)
      .eq("date", today)
      .in("status", ["pending", "confirmed"])
      .order("time", { ascending: true })
      .limit(1)
      .single(),
  ]);

  return {
    reservationsToday: reservationsResult.count ?? 0,
    totalCustomers: customersResult.count ?? 0,
    activeMenuItems: menuResult.count ?? 0,
    nextReservationTime: nextResult.data?.time
      ? nextResult.data.time.substring(0, 5) // "HH:MM"
      : null,
  };
}

/**
 * Obtiene las próximas reservas del día.
 */
export async function getUpcomingReservations(
  restaurantId: string,
  limit = 5
): Promise<UpcomingReservation[]> {
  const supabase = createAdminClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const { data, error } = await supabase
    .from("reservations")
    .select("id, customer_name, time, party_size, status, date")
    .eq("restaurant_id", restaurantId)
    .eq("date", today)
    .neq("status", "cancelled")
    .order("time", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[getUpcomingReservations] Error:", error.message);
    return [];
  }

  return (data || []) as UpcomingReservation[];
}

/**
 * Calcula los días restantes del período de prueba.
 */
export async function getTrialInfo(restaurantId: string): Promise<{
  daysRemaining: number;
  plan: string;
  status: string;
}> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("restaurants")
    .select("trial_ends_at, plan, subscription_status")
    .eq("id", restaurantId)
    .single();

  if (error || !data) {
    return { daysRemaining: 0, plan: "trial", status: "trial" };
  }

  const daysRemaining = data.trial_ends_at
    ? Math.max(0, differenceInDays(new Date(data.trial_ends_at), new Date()))
    : 0;

  return {
    daysRemaining,
    plan: data.plan,
    status: data.subscription_status,
  };
}

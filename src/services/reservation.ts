"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSupabaseAnon } from "@/lib/supabase/anon";
import { Database } from "@/types/database";
import { revalidatePath } from "next/cache";

export type Reservation = Database["public"]["Tables"]["reservations"]["Row"];

/**
 * Obtiene los bloques horarios disponibles para una fecha específica.
 * Usa AdminClient para permitir lectura pública sin sesión.
 */
export async function getAvailableSlots(restaurantId: string, date: string) {
  const supabase = createAdminClient();
  
  // 1. Obtener día de la semana (0-6)
  const dayOfWeek = new Date(date).getUTCDay();

  // 2. Obtener bloques activos para ese día
  const { data: slots, error: slotsError } = await supabase
    .from("reservation_slots")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("day_of_week", dayOfWeek)
    .eq("active", true)
    .order("time");

  if (slotsError) {
    console.error("Error fetching slots:", slotsError);
    return [];
  }

  // 3. Obtener reservas existentes para esa fecha
  const { data: reservations, error: resError } = await supabase
    .from("reservations")
    .select("time, party_size")
    .eq("restaurant_id", restaurantId)
    .eq("date", date)
    .not("status", "eq", "cancelled");

  if (resError) {
    console.error("Error fetching reservations:", resError);
    return slots;
  }

  // 4. Calcular capacidad restante
  const slotsWithAvailability = (slots || []).map(slot => {
    const totalBooked = (reservations || [])
      .filter(r => r.time === slot.time)
      .reduce((acc, curr) => acc + curr.party_size, 0);
    
    return {
      ...slot,
      available_capacity: slot.max_capacity - totalBooked,
      is_available: (slot.max_capacity - totalBooked) > 0
    };
  });

  return slotsWithAvailability;
}

/**
 * Crea una nueva reserva.
 * Usa AdminClient para permitir que cualquier cliente (sin sesión) reserve.
 */
export async function createReservation(formData: {
  restaurant_id: string;
  slot_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  date: string;
  time: string;
  party_size: number;
  notes?: string;
  status?: string;
}) {
  const supabase = getSupabaseAnon();
  
  const { data, error } = await supabase
    .from("reservations")
    .insert([{
      ...formData,
      status: formData.status || 'pending'
    }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/reservations");
  return data;
}

/**
 * Métodos de Administración (Dashboard).
 * Estos USAN createClient para respetar el RLS del usuario autenticado.
 */

export async function getReservationsByDate(restaurantId: string, date: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("date", date)
    .order("time");

  if (error) {
    console.error("Error fetching reservations for dashboard:", error);
    return [];
  }

  return data as Reservation[];
}

export async function updateReservationStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show') {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("reservations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating reservation status:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/reservations");
  return data;
}

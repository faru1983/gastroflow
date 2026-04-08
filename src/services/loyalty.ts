"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export type RewardType = "welcome" | "stamps" | "birthday" | "manual" | "win_back";

interface RegisterVisitParams {
  restaurantId: string;
  customerIds: string[]; // Soportamos registro múltiple para una mesa
  amountTotal: number;
  tableNumber: string;
  partySize: number;
}

/**
 * Registra una visita grupal en una mesa, calcula gasto promedio 
 * y verifica si algún cliente gana un premio por sellos.
 */
export async function registerVisit({
  restaurantId,
  customerIds,
  amountTotal,
  tableNumber,
  partySize,
}: RegisterVisitParams) {
  const supabase = await createClient();
  const sessionId = uuidv4();
  const amountPerPerson = amountTotal / Math.max(customerIds.length, 1);

  // 1. Obtener configuración de fidelización del restaurante
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("loyalty_stamps_target, loyalty_stamps_reward_text, loyalty_stamps_reward_enabled")
    .eq("id", restaurantId)
    .single();

  if (!restaurant) throw new Error("Restaurante no encontrado");

  // 2. Registrar visitas individuales dentro de la misma sesión
  const visitsToInsert = customerIds.map((cid) => ({
    restaurant_id: restaurantId,
    customer_id: cid,
    session_id: sessionId,
    table_number: tableNumber,
    amount_total: amountTotal,
    amount_per_person: amountPerPerson,
    party_size: partySize,
    amount: amountPerPerson, // para compatibilidad con campos antiguos si existen
  }));

  const { error: visitError } = await supabase.from("loyalty_visits").insert(visitsToInsert);
  if (visitError) throw visitError;

  // 3. Actualizar estadísticas de cada cliente y verificar premios de sellos
  for (const cid of customerIds) {
    // Actualizar totales en el perfil del cliente
    const { data: customer } = await supabase
      .from("customers")
      .select("total_visits, total_spent")
      .eq("id", cid)
      .single();

    if (customer) {
      const newVisits = (customer.total_visits || 0) + 1;
      const newSpent = (Number(customer.total_spent) || 0) + amountPerPerson;

      await supabase.from("customers").update({
        total_visits: newVisits,
        total_spent: newSpent,
        last_visit_at: new Date().toISOString()
      }).eq("id", cid);

      // ¿Ganó premio por sellos?
      if (
        restaurant.loyalty_stamps_reward_enabled && 
        newVisits % (restaurant.loyalty_stamps_target || 10) === 0
      ) {
        await supabase.from("customer_rewards").insert({
          restaurant_id: restaurantId,
          customer_id: cid,
          reward_type: "stamps",
          reward_text: restaurant.loyalty_stamps_reward_text || "Premio por fidelidad"
        });
      }
    }
  }

  revalidatePath("/dashboard");
  return { success: true, sessionId };
}

/**
 * Obtiene el ranking de mejores clientes del mes
 */
export async function getTopCustomers(restaurantId: string) {
  const supabase = await createClient();
  
  // Obtenemos los clientes con más visitas y gasto
  const { data, error } = await supabase
    .from("customers")
    .select("id, name, email, total_visits, total_spent, last_visit_at")
    .eq("restaurant_id", restaurantId)
    .order("total_visits", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
}

/**
 * Otorga un premio manual a un cliente
 */
export async function grantManualReward(
    restaurantId: string, 
    customerId: string, 
    text: string,
    type: RewardType = "manual"
) {
  const supabase = await createClient();
  
  const { error } = await supabase.from("customer_rewards").insert({
    restaurant_id: restaurantId,
    customer_id: customerId,
    reward_type: type,
    reward_text: text
  });

  if (error) throw error;
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Canjea un premio (marcarlo como usado)
 */
export async function redeemReward(rewardId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.from("customer_rewards").update({
    is_redeemed: true,
    redeemed_at: new Date().toISOString()
  }).eq("id", rewardId);

  if (error) throw error;
  revalidatePath("/(dashboard)/dashboard", "layout");
  return { success: true };
}

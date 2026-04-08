"use server";

import { getSupabaseAnon } from "@/lib/supabase/anon";
import { createAdminClient } from "@/lib/supabase/admin";
import { Database } from "@/types/database";
import { unstable_cache } from "next/cache";

export type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];

/**
 * Obtiene un restaurante por su slug.
 */
export async function getRestaurantBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const supabase = getSupabaseAnon();
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error(`[getRestaurantBySlug] Error for ${slug}:`, error.message || error);
        return null;
      }

      return data as Restaurant;
    },
    ["restaurant-by-slug", slug],
    {
      tags: ["restaurants"],
      revalidate: 3600
    }
  )();
}

/**
 * Obtiene los items del menú de un restaurante (solo activos).
 */
export async function getMenuItems(restaurantId: string) {
  return unstable_cache(
    async () => {
      const supabase = getSupabaseAnon();
      let { data, error } = await supabase
        .from("menu_items")
        .select("*, menu_categories(*)")
        .eq("restaurant_id", restaurantId)
        .eq("active", true)
        .order("order");

      if (error) {
        console.warn(`[getMenuItems] Anon failed for ${restaurantId}: ${error.message || JSON.stringify(error)}. Trying admin...`);
        const adminSupabase = createAdminClient();
        const { data: adminData, error: adminError } = await adminSupabase
            .from("menu_items")
            .select("*, menu_categories(*)")
            .eq("restaurant_id", restaurantId)
            .eq("active", true)
            .order("order");
            
        if (adminError) {
            console.error(`[getMenuItems] Admin fallback failed:`, adminError.message);
            return [];
        }
        return adminData;
      }

      return data;
    },
    ["menu-items", restaurantId],
    {
      tags: ["menu"],
      revalidate: 3600
    }
  )();
}

/**
 * Obtiene las categorías del menú (solo activas).
 */
export async function getMenuCategories(restaurantId: string) {
  return unstable_cache(
    async () => {
      const supabase = getSupabaseAnon();
      let { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .eq("active", true)
        .order("order");

      if (error) {
        console.warn(`[getMenuCategories] Anon failed for ${restaurantId}: ${error.message || JSON.stringify(error)}. Trying admin...`);
        const adminSupabase = createAdminClient();
        const { data: adminData, error: adminError } = await adminSupabase
            .from("menu_categories")
            .select("*")
            .eq("restaurant_id", restaurantId)
            .eq("active", true)
            .order("order");
            
        if (adminError) {
            console.error(`[getMenuCategories] Admin fallback failed:`, adminError.message);
            return [];
        }
        return adminData;
      }

      return data;
    },
    ["menu-categories", restaurantId],
    {
      tags: ["menu"],
      revalidate: 3600
    }
  )();
}

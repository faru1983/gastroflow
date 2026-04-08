"use server";

import { getSupabaseAnon } from "@/lib/supabase/anon";
import { Database } from "@/types/database";
import { unstable_cache } from "next/cache";

export type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];

/**
 * Obtiene un restaurante por su slug.
 * Cacheado dinámicamente por slug.
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
        console.error(`Error fetching restaurant by slug ${slug}:`, error);
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
      const { data, error } = await supabase
        .from("menu_items")
        .select("*, menu_categories(*)")
        .eq("restaurant_id", restaurantId)
        .eq("active", true)
        .order("order");

      if (error) {
        console.error(`Error fetching menu items for restaurant ${restaurantId}:`, error);
        return [];
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
 * Obtiene las categorías del menú (solo activas) ordenadas.
 */
export async function getMenuCategories(restaurantId: string) {
  return unstable_cache(
    async () => {
      const supabase = getSupabaseAnon();
      const { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .eq("active", true)
        .order("order");

      if (error) {
        console.error(`Error fetching categories for restaurant ${restaurantId}:`, error);
        return [];
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

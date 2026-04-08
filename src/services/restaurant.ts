"use server";

import { supabaseAnon } from "@/lib/supabase/anon";
import { Database } from "@/types/database";
import { unstable_cache } from "next/cache";

export type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];

/**
 * Obtiene un restaurante por su slug.
 * Cacheado en caché estática de Next.js.
 */
export const getRestaurantBySlug = unstable_cache(
  async (slug: string) => {
    const { data, error } = await supabaseAnon
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
  ["restaurant-by-slug"],
  {
    tags: ["restaurants"],
    revalidate: 3600 // Revalida cada 1 hora como máximo si no se empuja antes
  }
);

/**
 * Obtiene los items del menú de un restaurante (solo activos).
 * Optimizado con caché para minimizar lecturas en Supabase.
 */
export const getMenuItems = unstable_cache(
  async (restaurantId: string) => {
    const { data, error } = await supabaseAnon
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
  ["menu-items"],
  {
    tags: ["menu"],
    revalidate: 3600
  }
);

/**
 * Obtiene las categorías del menú (solo activas) ordenadas.
 */
export const getMenuCategories = unstable_cache(
  async (restaurantId: string) => {
    const { data, error } = await supabaseAnon
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
  ["menu-categories"],
  {
    tags: ["menu"],
    revalidate: 3600
  }
);


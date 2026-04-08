"use server";

import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";
import { revalidatePath } from "next/cache";

export type MenuCategory = Database["public"]["Tables"]["menu_categories"]["Row"];
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];

/**
 * Categorías de Menú
 */

export async function createCategory(name: string, restaurantId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("menu_categories")
    .insert([
      { 
        name, 
        restaurant_id: restaurantId,
        order: 0,
        active: true 
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/menu");
  revalidatePath("/", "layout");
  return data;
}

export async function updateCategory(id: string, name: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("menu_categories")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating category:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/menu");
  revalidatePath("/", "layout");
  return data;
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  
  // Note: RLS will handle multi-tenant protection
  const { error } = await supabase
    .from("menu_categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting category:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/menu");
  revalidatePath("/", "layout");
}

/**
 * Platos / Items de Menú
 */

export async function createMenuItem(item: Partial<MenuItem> & { restaurant_id: string, category_id: string }) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("menu_items")
    .insert([
      {
        name: item.name!,
        description: item.description,
        price: item.price!,
        sale_price: item.sale_price,
        image_url: item.image_url,
        restaurant_id: item.restaurant_id,
        category_id: item.category_id,
        active: true,
        order: 0
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating menu item:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/menu");
  revalidatePath("/", "layout");
  return data;
}

export async function updateMenuItem(id: string, item: Partial<MenuItem>) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("menu_items")
    .update({
      ...item,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating menu item:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/menu");
  revalidatePath("/", "layout");
  return data;
}

export async function deleteMenuItem(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting menu item:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/menu");
  revalidatePath("/", "layout");
}

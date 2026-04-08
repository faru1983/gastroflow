import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

/**
 * Cliente anónimo de Supabase para consultas públicas y cacheadas.
 * Al no depender de cookies(), se puede usar safely dentro de Next.js unstable_cache
 * o revalidateConfigs. Las consultas aquí están restringidas por RLS.
 */
export const getSupabaseAnon = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

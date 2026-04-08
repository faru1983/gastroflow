import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

/**
 * Cliente de Supabase con privilegios de ADMINISTRADOR (Service Role).
 * Úsalo SOLO en Server Components o API Routes dentro del panel /admin.
 * Este cliente salta las reglas de RLS.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

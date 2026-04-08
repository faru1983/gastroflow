import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    await supabase.auth.signOut();
  }

  const url = new URL(request.url);
  const next = url.searchParams.get('next') || '/';

  return NextResponse.redirect(new URL(next, request.url), {
    status: 302,
  });
}

import { NextResponse } from "next/server";

import { createSupabaseAnonServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const configured = {
    url: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    serviceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    databaseUrl: Boolean(process.env.DATABASE_URL),
    storageBucket: process.env.SUPABASE_STORAGE_BUCKET ?? null,
  };

  if (!configured.url || !configured.anonKey) {
    return NextResponse.json(
      {
        ok: false,
        configured,
        error: "Supabase URL or anon key is missing",
      },
      { status: 500 },
    );
  }

  const supabase = createSupabaseAnonServerClient();
  const { error } = await supabase.auth.getSession();

  return NextResponse.json({
    ok: !error,
    configured,
    authReachable: !error,
    error: error?.message ?? null,
  });
}

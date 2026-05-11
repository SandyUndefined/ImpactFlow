import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextParam = requestUrl.searchParams.get("next") ?? "/";
  const next = nextParam.startsWith("/") ? nextParam : "/";

  if (!code) {
    return NextResponse.redirect(new URL("/", requestUrl.origin));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const redirectUrl = new URL("/", requestUrl.origin);
    redirectUrl.searchParams.set("auth_error", error.message);

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}

function requiredEnv(
  key: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY",
) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is not configured`);
  }

  return value;
}

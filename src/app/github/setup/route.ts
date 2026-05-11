import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const redirectUrl = new URL("/", requestUrl.origin);
  const installationId = requestUrl.searchParams.get("installation_id");
  const setupAction = requestUrl.searchParams.get("setup_action");

  redirectUrl.searchParams.set("github", "connected");

  if (installationId) {
    redirectUrl.searchParams.set("installation_id", installationId);
  }

  if (setupAction) {
    redirectUrl.searchParams.set("setup_action", setupAction);
  }

  return NextResponse.redirect(redirectUrl);
}

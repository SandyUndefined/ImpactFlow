import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "impactflow",
    environment: process.env.VERCEL_ENV ?? "local",
  });
}

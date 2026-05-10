import { NextResponse } from "next/server";

import { getEnvStatus } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    groups: getEnvStatus(),
  });
}

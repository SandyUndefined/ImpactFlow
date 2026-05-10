import { NextResponse } from "next/server";

import { createReport, repositories } from "@/data/reports";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    repoId?: string;
  } | null;

  if (!body?.repoId) {
    return NextResponse.json({ error: "repoId is required" }, { status: 400 });
  }

  const repo = repositories.find((item) => item.id === body.repoId);

  if (!repo) {
    return NextResponse.json({ error: "Repository not found" }, { status: 404 });
  }

  return NextResponse.json({ report: createReport(repo.id) });
}

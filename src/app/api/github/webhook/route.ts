import { NextResponse } from "next/server";

import {
  githubWebhookEvents,
  isSupportedGitHubWebhookEvent,
  verifyGitHubWebhookSignature,
} from "@/lib/github-webhook";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type JsonRecord = Record<string, unknown>;

export async function GET() {
  return NextResponse.json({
    status: "ready",
    configured: Boolean(process.env.GITHUB_WEBHOOK_SECRET),
    acceptedEvents: githubWebhookEvents,
  });
}

export async function POST(request: Request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "GITHUB_WEBHOOK_SECRET is not configured" },
      { status: 500 },
    );
  }

  const event = request.headers.get("x-github-event");
  const deliveryId = request.headers.get("x-github-delivery");
  const signature = request.headers.get("x-hub-signature-256");
  const payloadText = await request.text();

  if (!event || !deliveryId) {
    return NextResponse.json(
      { error: "Missing GitHub webhook headers" },
      { status: 400 },
    );
  }

  const validSignature = verifyGitHubWebhookSignature({
    payload: payloadText,
    secret,
    signatureHeader: signature,
  });

  if (!validSignature) {
    return NextResponse.json(
      { error: "Invalid GitHub webhook signature" },
      { status: 401 },
    );
  }

  const payload = parsePayload(payloadText);

  if (!payload) {
    return NextResponse.json(
      { error: "Invalid GitHub webhook payload" },
      { status: 400 },
    );
  }

  const summary = summarizePayload(payload);

  console.info("GitHub webhook received", {
    event,
    deliveryId,
    supported: isSupportedGitHubWebhookEvent(event),
    ...summary,
  });

  if (event === "ping") {
    return NextResponse.json({
      ok: true,
      event,
      deliveryId,
      message: "pong",
      hookId: getNumber(payload, "hook_id"),
      repository: summary.repository,
    });
  }

  return NextResponse.json({
    ok: true,
    event,
    deliveryId,
    accepted: isSupportedGitHubWebhookEvent(event),
    action: summary.action,
    installationId: summary.installationId,
    repository: summary.repository,
  });
}

function parsePayload(payloadText: string): JsonRecord | null {
  try {
    return asRecord(JSON.parse(payloadText));
  } catch {
    return null;
  }
}

function summarizePayload(payload: JsonRecord) {
  const repository = asRecord(payload.repository);
  const installation = asRecord(payload.installation);
  const sender = asRecord(payload.sender);

  return {
    action: getString(payload, "action"),
    repository: repository ? getString(repository, "full_name") : null,
    installationId: installation ? getNumber(installation, "id") : null,
    sender: sender ? getString(sender, "login") : null,
  };
}

function asRecord(value: unknown): JsonRecord | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  return value as JsonRecord;
}

function getString(record: JsonRecord, key: string) {
  const value = record[key];

  return typeof value === "string" ? value : null;
}

function getNumber(record: JsonRecord, key: string) {
  const value = record[key];

  return typeof value === "number" ? value : null;
}

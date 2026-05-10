import { createHmac, timingSafeEqual } from "node:crypto";

type VerifySignatureInput = {
  payload: string;
  secret: string;
  signatureHeader: string | null;
};

export const githubWebhookEvents = [
  "ping",
  "installation",
  "installation_repositories",
  "push",
  "issues",
  "pull_request",
] as const;

export type GithubWebhookEvent = (typeof githubWebhookEvents)[number];

export function verifyGitHubWebhookSignature({
  payload,
  secret,
  signatureHeader,
}: VerifySignatureInput) {
  if (!signatureHeader?.startsWith("sha256=")) {
    return false;
  }

  const expectedSignature = `sha256=${createHmac("sha256", secret)
    .update(payload, "utf8")
    .digest("hex")}`;

  const expected = Buffer.from(expectedSignature, "utf8");
  const received = Buffer.from(signatureHeader, "utf8");

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(expected, received);
}

export function isSupportedGitHubWebhookEvent(
  event: string,
): event is GithubWebhookEvent {
  return githubWebhookEvents.includes(event as GithubWebhookEvent);
}

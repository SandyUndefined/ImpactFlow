type EnvGroup = {
  description: string;
  keys: string[];
};

export const envGroups = {
  app: {
    description: "Base URLs used by callbacks, links, and local development.",
    keys: ["APP_URL", "NEXT_PUBLIC_APP_URL"],
  },
  supabase: {
    description: "Auth, database, service access, and report storage.",
    keys: [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "SUPABASE_STORAGE_BUCKET",
      "DATABASE_URL",
    ],
  },
  github: {
    description: "OAuth login, repository access, webhooks, and issue creation.",
    keys: [
      "GITHUB_CLIENT_ID",
      "GITHUB_CLIENT_SECRET",
      "GITHUB_APP_ID",
      "GITHUB_PRIVATE_KEY",
      "GITHUB_WEBHOOK_SECRET",
    ],
  },
  ai: {
    description: "Claude primary analysis, OpenAI structured output, Gemini fallback.",
    keys: ["ANTHROPIC_API_KEY", "OPENAI_API_KEY", "GEMINI_API_KEY"],
  },
  queue: {
    description: "Background analysis jobs. Inngest is the default beta path.",
    keys: ["INNGEST_EVENT_KEY", "INNGEST_SIGNING_KEY"],
  },
  stripe: {
    description: "Paid plan checkout and subscription webhooks.",
    keys: [
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
    ],
  },
} satisfies Record<string, EnvGroup>;

export type EnvGroupName = keyof typeof envGroups;

export function getEnvStatus() {
  return Object.entries(envGroups).map(([name, group]) => {
    const missing = group.keys.filter((key) => !process.env[key]);

    return {
      name,
      description: group.description,
      configured: missing.length === 0,
      missing,
      required: group.keys,
    };
  });
}

export function assertEnvGroup(groupName: EnvGroupName) {
  const group = envGroups[groupName];
  const missing = group.keys.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing ${groupName} environment variables: ${missing.join(", ")}`,
    );
  }
}

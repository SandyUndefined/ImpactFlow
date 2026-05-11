declare namespace NodeJS {
  interface ProcessEnv {
    APP_URL?: string;
    NEXT_PUBLIC_APP_URL?: string;
    NEXT_PUBLIC_SUPABASE_URL?: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
    NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    SUPABASE_STORAGE_BUCKET?: string;
    DATABASE_URL?: string;
    NEXT_PUBLIC_GITHUB_APP_INSTALL_URL?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
    GITHUB_APP_ID?: string;
    GITHUB_PRIVATE_KEY?: string;
    GITHUB_WEBHOOK_SECRET?: string;
    ANTHROPIC_API_KEY?: string;
    OPENAI_API_KEY?: string;
    GEMINI_API_KEY?: string;
    INNGEST_EVENT_KEY?: string;
    INNGEST_SIGNING_KEY?: string;
    REDIS_URL?: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
  }
}

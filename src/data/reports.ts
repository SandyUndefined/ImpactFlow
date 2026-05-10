export type Repository = {
  id: string;
  name: string;
  owner: string;
  visibility: "public" | "private";
  language: string;
  updatedAt: string;
  defaultBranch: string;
};

export type ReportTask = {
  title: string;
  priority: "High" | "Medium" | "Low";
  effort: "S" | "M" | "L";
  owner: string;
  status: "Ready" | "Needs review" | "Blocked";
};

export type AnalysisReport = {
  id: string;
  repo: Repository;
  generatedAt: string;
  summary: string;
  stack: string[];
  keyFiles: Array<{
    path: string;
    reason: string;
  }>;
  architecture: Array<{
    id: string;
    label: string;
    detail: string;
  }>;
  docsGaps: string[];
  missingTests: string[];
  risks: Array<{
    title: string;
    severity: "High" | "Medium" | "Low";
    detail: string;
  }>;
  tasks: ReportTask[];
};

export const repositories: Repository[] = [
  {
    id: "impactflow-web",
    owner: "impactflow",
    name: "impactflow-web",
    visibility: "public",
    language: "TypeScript",
    updatedAt: "2h ago",
    defaultBranch: "main",
  },
  {
    id: "billing-engine",
    owner: "impactflow",
    name: "billing-engine",
    visibility: "private",
    language: "Node.js",
    updatedAt: "1d ago",
    defaultBranch: "main",
  },
  {
    id: "mobile-api",
    owner: "impactflow",
    name: "mobile-api",
    visibility: "public",
    language: "Go",
    updatedAt: "4d ago",
    defaultBranch: "release",
  },
];

export function createReport(repoId: string): AnalysisReport {
  const repo = repositories.find((item) => item.id === repoId) ?? repositories[0];

  return {
    id: `report-${repo.id}`,
    repo,
    generatedAt: new Date().toISOString(),
    summary:
      "The repository is a product-facing SaaS application with a clear frontend entry point, API-backed workflows, and early-stage operational concerns around analysis jobs, exports, and account entitlements. The codebase is ready for a beta workflow, but production readiness depends on queue isolation, test coverage, and better onboarding documentation.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "GitHub OAuth", "Inngest", "Stripe"],
    keyFiles: [
      {
        path: "src/app/page.tsx",
        reason: "Primary application shell and workflow entry point.",
      },
      {
        path: "src/app/api/analyze/route.ts",
        reason: "Repo analysis boundary where provider routing and queue handoff should live.",
      },
      {
        path: "src/data/reports.ts",
        reason: "Current typed report contract for dashboard, export, and task planning.",
      },
      {
        path: "src/components/ImpactFlowApp.tsx",
        reason: "Client workflow state for login, GitHub connection, repository selection, and reports.",
      },
    ],
    architecture: [
      {
        id: "github",
        label: "GitHub Repo",
        detail: "OAuth-scoped repository access and metadata.",
      },
      {
        id: "indexer",
        label: "Repo Cloner + File Indexer",
        detail: "Clone, filter ignored files, and build a searchable file manifest.",
      },
      {
        id: "mapper",
        label: "Chunking + Dependency Mapper",
        detail: "Chunk code and map imports, routes, tests, and docs.",
      },
      {
        id: "router",
        label: "AI Router",
        detail: "Claude for deep repo analysis, OpenAI for structured output, Gemini as fallback.",
      },
      {
        id: "report",
        label: "Report Generator",
        detail: "Normalize insights into dashboard sections, task cards, and exports.",
      },
      {
        id: "outputs",
        label: "Dashboard + PDF + GitHub Issues",
        detail: "Persist reports, export PDFs, and promote tasks to issues.",
      },
    ],
    docsGaps: [
      "README lacks production setup details for Supabase, GitHub OAuth, AI keys, queues, and Stripe webhooks.",
      "Architecture decisions are not recorded, especially around provider routing and long-running analysis jobs.",
      "No runbook exists for failed clone jobs, rate limits, private repository access errors, or PDF export failures.",
      "Beta limits and private repository handling are not documented for support or sales handoff.",
    ],
    missingTests: [
      "Authentication and GitHub connection states need integration tests.",
      "Analysis API needs contract tests for invalid repo IDs, provider failures, and retryable queue states.",
      "Report rendering needs component tests for empty docs gaps, missing tests, and high-risk findings.",
      "PDF export needs a browser test to verify the report-only print view.",
    ],
    risks: [
      {
        title: "Provider output drift",
        severity: "High",
        detail:
          "Claude, OpenAI, and Gemini responses need schema validation before reports are persisted or converted into tasks.",
      },
      {
        title: "Repository access scope",
        severity: "High",
        detail:
          "Private repo support depends on tightly scoped GitHub OAuth permissions and secure clone token handling.",
      },
      {
        title: "Long-running analysis jobs",
        severity: "Medium",
        detail:
          "Large repos can exceed Vercel function limits unless clone and indexing work moves through a queue worker.",
      },
      {
        title: "Export fidelity",
        severity: "Medium",
        detail:
          "Dashboard HTML and PDF output should share the same report contract to avoid inconsistent beta deliverables.",
      },
    ],
    tasks: [
      {
        title: "Wire Supabase Auth with GitHub OAuth",
        priority: "High",
        effort: "M",
        owner: "Full-stack",
        status: "Ready",
      },
      {
        title: "Move analysis execution behind Inngest or Trigger.dev",
        priority: "High",
        effort: "L",
        owner: "Backend",
        status: "Needs review",
      },
      {
        title: "Add report schema validation for AI provider output",
        priority: "High",
        effort: "M",
        owner: "AI Platform",
        status: "Ready",
      },
      {
        title: "Create browser coverage for report PDF export",
        priority: "Medium",
        effort: "S",
        owner: "QA",
        status: "Ready",
      },
      {
        title: "Document beta limits and private repo handling",
        priority: "Medium",
        effort: "S",
        owner: "Product",
        status: "Ready",
      },
    ],
  };
}

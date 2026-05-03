export const mockReport = {
  projectName: "ImpactFlow AI Demo Repo",
  repoUrl: "https://github.com/demo/sample-repo",
  summary:
    "This project is a full-stack application. ImpactFlow AI analyzes the repository and creates architecture, documentation, test suggestions, risks, and execution tasks.",
  techStack: ["Next.js", "TypeScript", "Tailwind CSS", "IBM Bob", "watsonx.ai", "watsonx Orchestrate"],
  keyFiles: [
    "src/app/page.tsx",
    "src/components/RepoInput.tsx",
    "src/data/mockReport.ts"
  ],
  risks: [
    "Missing automated test coverage",
    "No clear onboarding documentation",
    "Architecture is not documented",
    "No structured task breakdown from code analysis"
  ],
  docsSuggestions: [
    "Improve README with setup instructions",
    "Add API documentation",
    "Create developer onboarding guide",
    "Add architecture explanation"
  ],
  testSuggestions: [
    "Add unit tests for components",
    "Add integration tests for API routes",
    "Add edge case tests for repo analysis flow"
  ],
  tasks: [
    {
      title: "Generate README improvement",
      priority: "High",
      effort: "Low",
      owner: "Frontend Developer"
    },
    {
      title: "Create test cases for dashboard components",
      priority: "Medium",
      effort: "Medium",
      owner: "QA / Developer"
    },
    {
      title: "Add Bob session report export section",
      priority: "High",
      effort: "Low",
      owner: "Developer"
    }
  ],
  architecture: `
flowchart TD
    A[User enters GitHub Repo] --> B[ImpactFlow Dashboard]
    B --> C[IBM Bob IDE Analysis]
    C --> D[Impact Report]
    D --> E[Architecture Diagram]
    D --> F[Docs and Test Suggestions]
    D --> G[Risk Insights]
    G --> H[watsonx Orchestrate Tasks]
    D --> I[watsonx.ai Stakeholder Summary]
  `
};
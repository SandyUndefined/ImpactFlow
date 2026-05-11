"use client";

import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  CircleDot,
  Download,
  FileText,
  GitBranch,
  Github,
  KeyRound,
  LogOut,
  Loader2,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  type AnalysisReport,
  type Repository,
  repositories,
} from "@/data/reports";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const reportTabs = [
  { id: "summary", label: "Summary" },
  { id: "architecture", label: "Architecture" },
  { id: "quality", label: "Docs and tests" },
  { id: "risks", label: "Risks" },
  { id: "tasks", label: "Tasks" },
] as const;

type ReportTab = (typeof reportTabs)[number]["id"];
type WorkflowStep = "login" | "github" | "repo" | "analyzing" | "report";

const workflowSteps: Array<{
  id: WorkflowStep;
  label: string;
  icon: typeof KeyRound;
}> = [
  { id: "login", label: "Login", icon: KeyRound },
  { id: "github", label: "GitHub", icon: Github },
  { id: "repo", label: "Repo", icon: GitBranch },
  { id: "analyzing", label: "Analyze", icon: Bot },
  { id: "report", label: "Report", icon: FileText },
];

const progressByStep: Record<WorkflowStep, number> = {
  login: 8,
  github: 28,
  repo: 50,
  analyzing: 76,
  report: 100,
};

export function ImpactFlowApp() {
  const [step, setStep] = useState<WorkflowStep>("login");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedRepoId, setSelectedRepoId] = useState(repositories[0].id);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [activeTab, setActiveTab] = useState<ReportTab>("summary");
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const selectedRepo = useMemo(
    () => repositories.find((repo) => repo.id === selectedRepoId) ?? repositories[0],
    [selectedRepoId],
  );

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError(
        "Google login is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, then redeploy.",
      );
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user.email ?? null;
      setUserEmail(email);

      if (email) {
        setStep((currentStep) => (currentStep === "login" ? "github" : currentStep));
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user.email ?? null;
      setUserEmail(email);

      if (email) {
        setStep((currentStep) => (currentStep === "login" ? "github" : currentStep));
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function loginWithGoogle() {
    setError(null);

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError(
        "Google login is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, then redeploy.",
      );
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (loginError) {
      setError(loginError.message);
    }
  }

  async function logout() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setUserEmail(null);
      setStep("login");
      setReport(null);
      return;
    }

    await supabase.auth.signOut();
    setUserEmail(null);
    setStep("login");
    setReport(null);
  }

  async function runAnalysis() {
    setStep("analyzing");
    setError(null);
    setAnalysisProgress(16);

    const timer = window.setInterval(() => {
      setAnalysisProgress((value) => Math.min(value + 14, 92));
    }, 380);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoId: selectedRepo.id }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const payload = (await response.json()) as { report: AnalysisReport };

      window.clearInterval(timer);
      setAnalysisProgress(100);
      setReport(payload.report);
      setActiveTab("summary");

      window.setTimeout(() => {
        setStep("report");
      }, 350);
    } catch {
      window.clearInterval(timer);
      setError("The analysis could not be completed. Check the API route and try again.");
      setStep("repo");
    }
  }

  function exportPdf() {
    window.print();
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-slate-950">
      <header className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-slate-950 text-white">
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-5">ImpactFlow</p>
              <p className="text-xs text-slate-500">Public Beta MVP</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Badge variant="secondary">Free tier: 1 public repo</Badge>
            <Badge variant="info">Pro: private repos and exports</Badge>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[320px_1fr]">
        <aside className="no-print space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Workflow</CardTitle>
              <CardDescription>Login, connect GitHub, analyze, report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={step === "analyzing" ? 76 : progressByStep[step]} />
              <div className="space-y-2">
                {workflowSteps.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === step;
                  const isDone =
                    progressByStep[item.id] < progressByStep[step] ||
                    (step === "report" && item.id === "report");

                  return (
                    <div
                      className={cn(
                        "flex items-center gap-3 rounded-md border px-3 py-2 text-sm",
                        isActive
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200 bg-white text-slate-600",
                      )}
                      key={item.id}
                    >
                      <Icon className="size-4" />
                      <span className="flex-1 font-medium">{item.label}</span>
                      {isDone ? <Check className="size-4" /> : <CircleDot className="size-4" />}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Router</CardTitle>
              <CardDescription>Provider responsibilities for production.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <RouterRow
                label="Claude Agent SDK"
                detail="Deep repo analysis and multi-file reasoning"
                tone="emerald"
              />
              <RouterRow
                label="OpenAI Codex"
                detail="Structured reports, tasks, JSON, summaries"
                tone="sky"
              />
              <RouterRow
                label="Gemini"
                detail="Fallback scans and Google ecosystem workflows"
                tone="amber"
              />
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-5">
          <div className="no-print grid gap-5 xl:grid-cols-[1fr_300px]">
            <ControlPanel
              error={error}
              onAnalyze={runAnalysis}
              onConnectGithub={() => setStep("repo")}
              onLogin={loginWithGoogle}
              onLogout={logout}
              onSelectRepo={setSelectedRepoId}
              repositories={repositories}
              selectedRepo={selectedRepo}
              step={step}
              userEmail={userEmail}
            />

            <Card>
              <CardHeader>
                <CardTitle>Beta Scope</CardTitle>
                <CardDescription>Workflow included in this build.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <ScopeRow done label="Login" />
                <ScopeRow done label="Connect GitHub" />
                <ScopeRow done label="Select repository" />
                <ScopeRow done label="Analyze repository" />
                <ScopeRow done label="View report" />
                <ScopeRow done label="Export PDF" />
              </CardContent>
            </Card>
          </div>

          {step === "analyzing" ? (
            <AnalyzingPanel progress={analysisProgress} repo={selectedRepo} />
          ) : null}

          {report ? (
            <ReportPanel
              activeTab={activeTab}
              onExport={exportPdf}
              onTabChange={setActiveTab}
              report={report}
            />
          ) : (
            <EmptyReportPanel />
          )}
        </section>
      </div>
    </main>
  );
}

function ControlPanel({
  error,
  onAnalyze,
  onConnectGithub,
  onLogin,
  onLogout,
  onSelectRepo,
  repositories,
  selectedRepo,
  step,
  userEmail,
}: {
  error: string | null;
  onAnalyze: () => void;
  onConnectGithub: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onSelectRepo: (repoId: string) => void;
  repositories: Repository[];
  selectedRepo: Repository;
  step: WorkflowStep;
  userEmail: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repository Analysis</CardTitle>
        <CardDescription>{selectedRepo.owner}/{selectedRepo.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-3">
          {repositories.map((repo) => (
            <button
              className={cn(
                "min-h-32 rounded-lg border bg-white p-4 text-left transition hover:border-slate-400",
                selectedRepo.id === repo.id ? "border-slate-950 ring-2 ring-slate-950/10" : "border-slate-200",
              )}
              disabled={step === "analyzing"}
              key={repo.id}
              onClick={() => onSelectRepo(repo.id)}
              type="button"
            >
              <div className="flex items-center justify-between gap-3">
                <Github className="size-4 text-slate-500" />
                <Badge variant={repo.visibility === "private" ? "warning" : "secondary"}>
                  {repo.visibility === "private" ? "Private" : "Public"}
                </Badge>
              </div>
              <p className="mt-4 text-sm font-semibold">{repo.name}</p>
              <p className="mt-1 text-xs text-slate-500">{repo.language} - {repo.defaultBranch}</p>
              <p className="mt-3 text-xs text-slate-400">Updated {repo.updatedAt}</p>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
          <Button disabled={step !== "login" || Boolean(userEmail)} onClick={onLogin}>
            <KeyRound />
            Continue with Google
          </Button>
          {userEmail ? (
            <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              <Check className="size-4" />
              {userEmail}
            </div>
          ) : null}
          <Button disabled={step !== "github"} onClick={onConnectGithub} variant="secondary">
            <Github />
            Connect GitHub
          </Button>
          <Button disabled={step !== "repo" && step !== "report"} onClick={onAnalyze}>
            <Play />
            Analyze
          </Button>
          {userEmail ? (
            <Button onClick={onLogout} variant="ghost">
              <LogOut />
              Sign out
            </Button>
          ) : null}
        </div>

        {error ? (
          <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertTriangle className="size-4" />
            {error}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function AnalyzingPanel({ progress, repo }: { progress: number; repo: Repository }) {
  return (
    <Card className="no-print border-slate-950">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Analyzing {repo.name}</CardTitle>
            <CardDescription>Clone, index, map dependencies, route to AI providers.</CardDescription>
          </div>
          <Loader2 className="size-5 animate-spin text-slate-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} />
        <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-4">
          <StatusPill label="Repo cloned" done={progress > 20} />
          <StatusPill label="Files indexed" done={progress > 40} />
          <StatusPill label="Dependencies mapped" done={progress > 60} />
          <StatusPill label="Report generated" done={progress > 90} />
        </div>
      </CardContent>
    </Card>
  );
}

function ReportPanel({
  activeTab,
  onExport,
  onTabChange,
  report,
}: {
  activeTab: ReportTab;
  onExport: () => void;
  onTabChange: (tab: ReportTab) => void;
  report: AnalysisReport;
}) {
  return (
    <Card className="print-page overflow-hidden">
      <CardHeader className="border-b border-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle className="text-xl">{report.repo.owner}/{report.repo.name}</CardTitle>
            <CardDescription>
              Generated {new Intl.DateTimeFormat("en", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(report.generatedAt))}
            </CardDescription>
          </div>
          <div className="no-print flex flex-wrap items-center gap-2">
            <Button onClick={onExport} variant="secondary">
              <Download />
              Export PDF
            </Button>
            <Button variant="subtle">
              <Github />
              GitHub Issues
            </Button>
          </div>
        </div>
        <div className="no-print flex gap-2 overflow-x-auto pt-4">
          {reportTabs.map((tab) => (
            <button
              className={cn(
                "h-9 shrink-0 rounded-md px-3 text-sm font-medium transition",
                activeTab === tab.id
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-5">
        <div className="hidden print-report">
          <FullReport report={report} />
        </div>
        <div className="no-print">
          {activeTab === "summary" ? <SummaryTab report={report} /> : null}
          {activeTab === "architecture" ? <ArchitectureTab report={report} /> : null}
          {activeTab === "quality" ? <QualityTab report={report} /> : null}
          {activeTab === "risks" ? <RisksTab report={report} /> : null}
          {activeTab === "tasks" ? <TasksTab report={report} /> : null}
        </div>
      </CardContent>
    </Card>
  );
}

function FullReport({ report }: { report: AnalysisReport }) {
  return (
    <div className="space-y-8">
      <SummaryTab report={report} />
      <ArchitectureTab report={report} />
      <QualityTab report={report} />
      <RisksTab report={report} />
      <TasksTab report={report} />
    </div>
  );
}

function SummaryTab({ report }: { report: AnalysisReport }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Project Summary</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{report.summary}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Detected Stack</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {report.stack.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold">Key Files</h3>
        <div className="mt-3 space-y-3">
          {report.keyFiles.map((file) => (
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3" key={file.path}>
              <p className="font-mono text-xs font-semibold text-slate-900">{file.path}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{file.reason}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ArchitectureTab({ report }: { report: AnalysisReport }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">Architecture Diagram</h2>
      <div className="mt-4 grid gap-3 lg:grid-cols-6">
        {report.architecture.map((node, index) => (
          <div className="relative" key={node.id}>
            <div className="min-h-36 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold">{node.label}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{node.detail}</p>
            </div>
            {index < report.architecture.length - 1 ? (
              <ArrowRight className="absolute -right-4 top-16 hidden size-5 text-slate-400 lg:block" />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function QualityTab({ report }: { report: AnalysisReport }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <FindingList icon={FileText} items={report.docsGaps} title="Docs Gaps" tone="sky" />
      <FindingList icon={ShieldCheck} items={report.missingTests} title="Missing Tests" tone="emerald" />
    </div>
  );
}

function RisksTab({ report }: { report: AnalysisReport }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">Risk Areas</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {report.risks.map((risk) => (
          <div className="rounded-lg border border-slate-200 bg-white p-4" key={risk.title}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">{risk.title}</h3>
              <Badge variant={risk.severity === "High" ? "danger" : "warning"}>
                {risk.severity}
              </Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{risk.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TasksTab({ report }: { report: AnalysisReport }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">Task Plan</h2>
      <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
        <div className="grid min-w-[640px] grid-cols-[1fr_92px_72px_120px] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-500">
          <span>Task</span>
          <span>Priority</span>
          <span>Effort</span>
          <span>Status</span>
        </div>
        {report.tasks.map((task) => (
          <div
            className="grid min-w-[640px] grid-cols-[1fr_92px_72px_120px] items-center border-t border-slate-200 px-4 py-3 text-sm"
            key={task.title}
          >
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="mt-1 text-xs text-slate-500">{task.owner}</p>
            </div>
            <Badge variant={task.priority === "High" ? "danger" : "warning"}>
              {task.priority}
            </Badge>
            <span className="text-slate-600">{task.effort}</span>
            <span className="text-xs text-slate-500">{task.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FindingList({
  icon: Icon,
  items,
  title,
  tone,
}: {
  icon: typeof FileText;
  items: string[];
  title: string;
  tone: "sky" | "emerald";
}) {
  return (
    <section>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex size-8 items-center justify-center rounded-md",
            tone === "sky" ? "bg-sky-50 text-sky-700" : "bg-emerald-50 text-emerald-700",
          )}
        >
          <Icon className="size-4" />
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600" key={item}>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function EmptyReportPanel() {
  return (
    <Card className="no-print border-dashed">
      <CardContent className="flex min-h-72 flex-col items-center justify-center gap-3 p-8 text-center">
        <FileText className="size-8 text-slate-400" />
        <div>
          <h2 className="font-semibold">No report generated</h2>
          <p className="mt-1 text-sm text-slate-500">Complete the workflow to create the beta analysis report.</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ScopeRow({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-full border",
          done ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-400",
        )}
      >
        <Check className="size-3" />
      </span>
      <span>{label}</span>
    </div>
  );
}

function RouterRow({
  detail,
  label,
  tone,
}: {
  detail: string;
  label: string;
  tone: "emerald" | "sky" | "amber";
}) {
  return (
    <div className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
      <span
        className={cn(
          "mt-1 size-2 rounded-full",
          tone === "emerald" && "bg-emerald-500",
          tone === "sky" && "bg-sky-500",
          tone === "amber" && "bg-amber-500",
        )}
      />
      <div>
        <p className="font-medium text-slate-900">{label}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
      </div>
    </div>
  );
}

function StatusPill({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
      <span
        className={cn(
          "size-2 rounded-full",
          done ? "bg-emerald-500" : "bg-slate-300",
        )}
      />
      <span>{label}</span>
    </div>
  );
}

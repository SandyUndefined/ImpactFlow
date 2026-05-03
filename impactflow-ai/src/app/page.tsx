import { mockReport } from "@/data/mockReport";
import RepoInput from "@/components/RepoInput";
import OverviewPanel from "@/components/OverviewPanel";
import ArchitecturePanel from "@/components/ArchitecturePanel";
import DocsTestsPanel from "@/components/DocsTestsPanel";
import RisksPanel from "@/components/RisksPanel";
import TasksPanel from "@/components/TasksPanel";
import ExportPanel from "@/components/ExportPanel";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <section className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">ImpactFlow AI</h1>
          <p className="text-slate-300 mt-2">
            Turn code into clarity, tasks, and impact faster.
          </p>
        </div>

        <RepoInput />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-6 bg-slate-900">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="docs">Docs & Tests</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewPanel report={mockReport} />
          </TabsContent>

          <TabsContent value="architecture">
            <ArchitecturePanel report={mockReport} />
          </TabsContent>

          <TabsContent value="docs">
            <DocsTestsPanel report={mockReport} />
          </TabsContent>

          <TabsContent value="risks">
            <RisksPanel report={mockReport} />
          </TabsContent>

          <TabsContent value="tasks">
            <TasksPanel report={mockReport} />
          </TabsContent>

          <TabsContent value="export">
            <ExportPanel />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
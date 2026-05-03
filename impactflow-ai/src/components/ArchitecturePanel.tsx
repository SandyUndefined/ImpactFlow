export default function ArchitecturePanel({ report }: any) {
  return (
    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
      <h2 className="text-xl font-semibold mb-3">Architecture Flow</h2>
      <pre className="bg-slate-950 p-4 rounded-lg text-sm text-slate-300 overflow-auto">
        {report.architecture}
      </pre>
    </div>
  );
}
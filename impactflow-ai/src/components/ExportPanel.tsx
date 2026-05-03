export default function ExportPanel() {
  return (
    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
      <h2 className="text-xl font-semibold mb-3">Submission Export</h2>
      <p className="text-slate-300">
        Final submission will include Bob task session reports, screenshots,
        generated impact report, and README.
      </p>

      <div className="mt-4 bg-slate-950 p-4 rounded-lg text-sm text-slate-300">
        /bob_sessions <br />
        /reports <br />
        /screenshots <br />
        README.md
      </div>
    </div>
  );
}
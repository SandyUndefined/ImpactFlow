export default function RisksPanel({ report }: any) {
  return (
    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
      <h2 className="text-xl font-semibold mb-3">Risk Insights</h2>
      <ul className="list-disc ml-6 text-slate-300">
        {report.risks.map((risk: string) => (
          <li key={risk}>{risk}</li>
        ))}
      </ul>
    </div>
  );
}
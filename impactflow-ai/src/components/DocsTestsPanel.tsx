export default function DocsTestsPanel({ report }: any) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
        <h2 className="text-xl font-semibold mb-3">Documentation Suggestions</h2>
        <ul className="list-disc ml-6 text-slate-300">
          {report.docsSuggestions.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
        <h2 className="text-xl font-semibold mb-3">Test Suggestions</h2>
        <ul className="list-disc ml-6 text-slate-300">
          {report.testSuggestions.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default function TasksPanel({ report }: any) {
  return (
    <div className="space-y-4">
      {report.tasks.map((task: any) => (
        <div
          key={task.title}
          className="bg-slate-900 p-5 rounded-xl border border-slate-800"
        >
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-slate-300">Priority: {task.priority}</p>
          <p className="text-slate-300">Effort: {task.effort}</p>
          <p className="text-slate-300">Owner: {task.owner}</p>
        </div>
      ))}
    </div>
  );
}
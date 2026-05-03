import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OverviewPanel({ report }: any) {
  return (
    <Card className="bg-slate-900 border-slate-800 text-white">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold">{report.projectName}</h2>
        <p className="text-slate-300">{report.summary}</p>

        <div className="flex flex-wrap gap-2">
          {report.techStack.map((tech: string) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>

        <div>
          <h3 className="font-semibold mt-4">Key Files</h3>
          <ul className="list-disc ml-6 text-slate-300">
            {report.keyFiles.map((file: string) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
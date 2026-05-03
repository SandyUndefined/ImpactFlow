import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RepoInput() {
  return (
    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex gap-3">
      <Input
        placeholder="Enter GitHub repo URL"
        className="bg-slate-950 border-slate-700"
      />
      <Button>Analyze with IBM Bob</Button>
    </div>
  );
}
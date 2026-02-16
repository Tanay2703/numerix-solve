import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, Clock } from "lucide-react";
import { getProblemHistory, deleteProblemFromHistory } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function History() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchHistory = async () => {
    try {
      const data = await getProblemHistory();
      setProblems(data || []);
    } catch {
      toast({ title: "Error loading history", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteProblemFromHistory(id);
      setProblems((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Problem removed" });
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6" /> Problem History
      </h1>

      {loading && <p className="text-muted-foreground">Loading...</p>}

      {!loading && problems.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No problems solved yet. Go to the <Link to="/" className="text-primary underline">home page</Link> to get started.
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {problems.map((p) => (
          <Card key={p.id} className="card-glow hover:border-primary/30 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono truncate">{p.problem_text}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{p.problem_type}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString()} {new Date(p.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/solution/${p.id}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye className="w-3.5 h-3.5" /> View
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => handleDelete(p.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

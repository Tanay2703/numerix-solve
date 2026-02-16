import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SolutionView from "@/components/SolutionView";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { SolutionData } from "@/lib/api";

export default function SolutionDetail() {
  const { id } = useParams();
  const [data, setData] = useState<{ problem_text: string; solution_data: SolutionData } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: row } = await supabase
        .from("problem_history")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (row) setData({ problem_text: row.problem_text, solution_data: row.solution_data as unknown as SolutionData });
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-8 text-muted-foreground">Loading...</div>;
  if (!data) return <div className="container mx-auto px-4 py-8 text-muted-foreground">Problem not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/history">
        <Button variant="ghost" size="sm" className="mb-4 gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to History
        </Button>
      </Link>
      <h1 className="text-xl font-bold mb-4 font-mono">{data.problem_text}</h1>
      <SolutionView data={data.solution_data} />
    </div>
  );
}

import { useState } from "react";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import ProblemInput from "@/components/ProblemInput";
import SolutionView from "@/components/SolutionView";
import MathToolsSidebar from "@/components/MathToolsSidebar";
import { solveMathProblem, saveProblemToHistory } from "@/lib/api";
import type { SolutionData } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon, FileText, TrendingUp, Grid3X3 } from "lucide-react";

const features = [
  { icon: ImageIcon, label: "Image Recognition" },
  { icon: FileText, label: "PDF Support" },
  { icon: TrendingUp, label: "Graph Visualization" },
  { icon: Grid3X3, label: "Built-in Tools" },
];

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<SolutionData | null>(null);
  const { toast } = useToast();

  const handleSolve = async (problem: string, imageBase64?: string) => {
    setIsLoading(true);
    setSolution(null);
    try {
      const data = await solveMathProblem(problem, imageBase64);
      setSolution(data);
      await saveProblemToHistory(
        data.problemExtracted || problem || "Image problem",
        imageBase64 ? "image" : "text",
        data
      );
      toast({ title: "Problem solved!", description: "Scroll down to see the solution." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to solve.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <DottedGlowBackground
          gap={16}
          radius={1.5}
          color="rgba(100,130,200,0.4)"
          glowColor="rgba(80,140,255,0.7)"
          opacity={0.5}
          speedScale={0.6}
        />

        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur-sm text-sm text-muted-foreground mb-6">
            <span>✦</span>
            <span>Step-by-step solutions with theorem references</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3 text-foreground">
            Understand Math.
          </h1>
          <p className="text-xl md:text-2xl italic text-muted-foreground mb-4">
            Don't Just Solve It.
          </p>
          <p className="text-muted-foreground text-sm md:text-base mb-8 max-w-2xl mx-auto">
            Enter a problem, upload an image, or submit a PDF. Get detailed solutions with
            theorem references, interactive graphs, video explanations, and practice problems.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-0">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Input + Math Tools side by side */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          <ProblemInput onSolve={handleSolve} isLoading={isLoading} />
          <div className="hidden lg:block">
            <MathToolsSidebar />
          </div>
        </div>
      </section>

      {/* Solution */}
      {solution && (
        <section className="container mx-auto px-4 pb-16">
          <SolutionView data={solution} />
        </section>
      )}
    </div>
  );
}

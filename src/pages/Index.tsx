import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import ProblemInput from "@/components/ProblemInput";
import SolutionView from "@/components/SolutionView";
import ResourceLinks from "@/components/ResourceLinks";
import { solveMathProblem, saveProblemToHistory } from "@/lib/api";
import type { SolutionData } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            AI Math Tutor
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-xl mx-auto">
            Type a problem, upload an image, or submit a PDF — get instant step-by-step solutions, graphs, and practice problems.
          </p>
          <ProblemInput onSolve={handleSolve} isLoading={isLoading} />
        </div>
      </section>

      {/* Solution */}
      {solution && (
        <section className="container mx-auto px-4 pb-16">
          <SolutionView data={solution} />
        </section>
      )}

      {/* Resources */}
      {!solution && (
        <section className="container mx-auto px-4 pb-16">
          <ResourceLinks />
        </section>
      )}
    </div>
  );
}

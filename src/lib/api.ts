import { supabase } from "@/integrations/supabase/client";

export interface SolutionData {
  problemExtracted: string;
  solution: {
    steps: { stepNumber: number; title: string; explanation: string; latex?: string }[];
    finalAnswer: string;
    latex?: string;
  };
  examInfo: {
    possibleExams: string[];
    previousAppearances: string[];
    difficulty: string;
    topic: string;
    subtopic: string;
  };
  theorems: { name: string; statement: string; assumptions: string; limitations: string; relevance: string }[];
  graphData: {
    has2D: boolean;
    has3D: boolean;
    plotExpression2D?: string;
    plotExpression3D?: string;
    xRange: number[];
    yRange: number[];
  };
  youtubeKeywords: string[];
  practiceProblems: {
    easy: { problem: string; hint: string; solution: string }[];
    medium: { problem: string; hint: string; solution: string }[];
    hard: { problem: string; hint: string; solution: string }[];
  };
  quantitativeAptitude: { problem: string; solution: string; difficulty: string }[];
  realLifeApplications: string[];
  referenceLinks: { name: string; url: string; description: string }[];
  rawResponse?: string;
  error?: string;
}

export async function solveMathProblem(problem: string, imageBase64?: string): Promise<SolutionData> {
  const { data, error } = await supabase.functions.invoke("solve-math", {
    body: { problem, imageBase64 },
  });

  if (error) throw new Error(error.message || "Failed to solve problem");
  return data as SolutionData;
}

export async function saveProblemToHistory(problemText: string, problemType: string, solutionData: SolutionData) {
  const { error } = await supabase.from("problem_history").insert({
    problem_text: problemText,
    problem_type: problemType,
    solution_data: solutionData as any,
  });
  if (error) console.error("Error saving to history:", error);
}

export async function getProblemHistory() {
  const { data, error } = await supabase
    .from("problem_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

export async function deleteProblemFromHistory(id: string) {
  const { error } = await supabase.from("problem_history").delete().eq("id", id);
  if (error) throw error;
}

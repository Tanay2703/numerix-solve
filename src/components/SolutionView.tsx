import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { BookOpen, BarChart3, Video, Brain, Wrench, GraduationCap, ExternalLink, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import type { SolutionData } from "@/lib/api";
import GraphViewer from "./GraphViewer";
import MathToolsSidebar from "./MathToolsSidebar";

interface SolutionViewProps {
  data: SolutionData;
}

export default function SolutionView({ data }: SolutionViewProps) {
  const [expandedHints, setExpandedHints] = useState<Record<string, boolean>>({});

  const toggleHint = (key: string) => {
    setExpandedHints((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (data.error || data.rawResponse) {
    return (
      <Card className="card-glow">
        <CardContent className="p-6">
          <p className="text-muted-foreground">{data.rawResponse || data.error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex gap-6 animate-fade-in">
      <div className="flex-1 min-w-0">
        {/* Exam Info Banner */}
        {data.examInfo && (
          <Card className="mb-4 card-glow border-primary/20">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2 items-center mb-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span className="font-semibold text-sm">Exam Relevance</span>
                <Badge variant="secondary" className="text-xs">{data.examInfo.difficulty}</Badge>
                <Badge variant="outline" className="text-xs">{data.examInfo.topic}</Badge>
                {data.examInfo.subtopic && <Badge variant="outline" className="text-xs">{data.examInfo.subtopic}</Badge>}
              </div>
              {data.examInfo.possibleExams?.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  <strong>Appears in:</strong> {data.examInfo.possibleExams.join(", ")}
                </p>
              )}
              {data.examInfo.previousAppearances?.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Previously asked in:</strong> {data.examInfo.previousAppearances.join(", ")}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="youtube" className="w-full">
          <TabsList className="w-full justify-start bg-secondary/50 overflow-x-auto">
            <TabsTrigger value="youtube" className="gap-1.5"><Video className="w-3.5 h-3.5" />YouTube</TabsTrigger>
            <TabsTrigger value="solution" className="gap-1.5"><BookOpen className="w-3.5 h-3.5" />Solution</TabsTrigger>
            <TabsTrigger value="graphs" className="gap-1.5"><BarChart3 className="w-3.5 h-3.5" />Graphs</TabsTrigger>
            <TabsTrigger value="practice" className="gap-1.5"><Brain className="w-3.5 h-3.5" />Practice</TabsTrigger>
          </TabsList>

          {/* YouTube Tab */}
          <TabsContent value="youtube" className="space-y-4 mt-4">
            <h3 className="font-semibold text-lg">YouTube Video Solutions</h3>
            <p className="text-sm text-muted-foreground mb-3">Search for video explanations from top math channels:</p>
            <div className="grid gap-3">
              {(data.youtubeKeywords || []).map((keyword, i) => (
                <a
                  key={i}
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(keyword + " math solution explanation")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{keyword}</p>
                    <p className="text-xs text-muted-foreground">YouTube Search</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              ))}
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                💡 Recommended channels: Khan Academy, 3Blue1Brown, MIT OpenCourseWare, Organic Chemistry Tutor, Professor Leonard
              </p>
            </div>
          </TabsContent>

          {/* Solution Tab */}
          <TabsContent value="solution" className="space-y-4 mt-4">
            <div className="space-y-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Problem</p>
                  <p className="font-mono text-sm">{data.problemExtracted}</p>
                </CardContent>
              </Card>

              <h3 className="font-semibold text-lg">Step-by-Step Solution</h3>
              {data.solution?.steps?.map((step, i) => (
                <Card key={i} className="card-glow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full hero-gradient flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary-foreground">
                        {step.stepNumber}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-1">{step.title}</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{step.explanation}</p>
                        {step.latex && (
                          <code className="block mt-2 p-2 bg-muted rounded text-xs font-mono overflow-x-auto">
                            {step.latex}
                          </code>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-accent/30 bg-accent/5">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-accent mb-1">Final Answer</p>
                  <p className="font-mono font-semibold">{data.solution?.finalAnswer}</p>
                  {data.solution?.latex && (
                    <code className="block mt-2 text-xs font-mono text-muted-foreground">{data.solution.latex}</code>
                  )}
                </CardContent>
              </Card>

              {/* Theorems */}
              {data.theorems?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-chart-4" /> Theorems Applied
                  </h3>
                  <TooltipProvider>
                    <div className="flex flex-wrap gap-2">
                      {data.theorems.map((thm, i) => (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="cursor-help py-1.5 px-3">
                              {thm.name}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-sm">
                            <p className="font-semibold text-sm mb-1">{thm.name}</p>
                            <p className="text-xs mb-1"><strong>Statement:</strong> {thm.statement}</p>
                            <p className="text-xs mb-1"><strong>Assumptions:</strong> {thm.assumptions}</p>
                            <p className="text-xs mb-1"><strong>Limitations:</strong> {thm.limitations}</p>
                            <p className="text-xs"><strong>Relevance:</strong> {thm.relevance}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>
                </div>
              )}

              {/* Quantitative Aptitude */}
              {data.quantitativeAptitude?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Quantitative Aptitude</h3>
                  {data.quantitativeAptitude.map((qa, i) => (
                    <Card key={i}>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{qa.difficulty}</Badge>
                        </div>
                        <p className="text-sm font-medium">{qa.problem}</p>
                        <button onClick={() => toggleHint(`qa-${i}`)} className="text-xs text-primary flex items-center gap-1">
                          {expandedHints[`qa-${i}`] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {expandedHints[`qa-${i}`] ? "Hide Solution" : "Show Solution"}
                        </button>
                        {expandedHints[`qa-${i}`] && (
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded whitespace-pre-wrap">{qa.solution}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Graphs Tab */}
          <TabsContent value="graphs" className="mt-4">
            <GraphViewer graphData={data.graphData} />
          </TabsContent>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-6 mt-4">
            {/* Real-life applications */}
            {data.realLifeApplications?.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Real-Life Applications</h3>
                <div className="grid gap-2">
                  {data.realLifeApplications.map((app, i) => (
                    <div key={i} className="p-3 bg-card border border-border rounded-lg text-sm">{app}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Practice Problems */}
            {["easy", "medium", "hard"].map((level) => {
              const problems = data.practiceProblems?.[level as keyof typeof data.practiceProblems] || [];
              if (problems.length === 0) return null;
              return (
                <div key={level}>
                  <h3 className="font-semibold text-lg mb-3 capitalize flex items-center gap-2">
                    <Badge variant={level === "easy" ? "secondary" : level === "medium" ? "default" : "destructive"}>
                      {level}
                    </Badge>
                    Problems
                  </h3>
                  <div className="grid gap-3">
                    {problems.map((p, i) => (
                      <Card key={i}>
                        <CardContent className="p-4 space-y-2">
                          <p className="text-sm font-medium font-mono">{p.problem}</p>
                          <button onClick={() => toggleHint(`${level}-${i}-hint`)} className="text-xs text-primary flex items-center gap-1">
                            {expandedHints[`${level}-${i}-hint`] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            Hint
                          </button>
                          {expandedHints[`${level}-${i}-hint`] && <p className="text-xs text-muted-foreground bg-muted p-2 rounded">{p.hint}</p>}
                          <button onClick={() => toggleHint(`${level}-${i}-sol`)} className="text-xs text-accent flex items-center gap-1">
                            {expandedHints[`${level}-${i}-sol`] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            Solution
                          </button>
                          {expandedHints[`${level}-${i}-sol`] && <p className="text-sm text-muted-foreground bg-muted p-3 rounded whitespace-pre-wrap">{p.solution}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Reference Links */}
            {data.referenceLinks?.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Reference Links</h3>
                <div className="grid gap-2">
                  {data.referenceLinks.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/40 transition-colors text-sm group">
                      <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">{link.name}</p>
                        <p className="text-xs text-muted-foreground">{link.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Math Tools Sidebar - visible on lg+ */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <MathToolsSidebar />
      </div>
    </div>
  );
}

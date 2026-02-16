import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GraphViewerProps {
  graphData?: {
    has2D: boolean;
    has3D: boolean;
    plotExpression2D?: string;
    plotExpression3D?: string;
    xRange?: number[];
    yRange?: number[];
  };
}

export default function GraphViewer({ graphData }: GraphViewerProps) {
  const desmosUrl2D = useMemo(() => {
    if (!graphData?.plotExpression2D) return null;
    const expr = encodeURIComponent(graphData.plotExpression2D);
    return `https://www.desmos.com/calculator?embed&expr=${expr}`;
  }, [graphData?.plotExpression2D]);

  if (!graphData?.has2D && !graphData?.has3D) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No graphs available for this problem.</p>
          <p className="text-sm text-muted-foreground mt-2">Graphs are generated for problems involving functions, equations, and geometric concepts.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {graphData?.has2D && graphData.plotExpression2D && (
        <Card className="card-glow">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">2D Graph</CardTitle>
            <p className="text-xs font-mono text-muted-foreground">y = {graphData.plotExpression2D}</p>
          </CardHeader>
          <CardContent>
            <div className="w-full aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              <iframe
                src={`https://www.desmos.com/calculator`}
                className="w-full h-full border-0"
                title="2D Graph"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {graphData?.has3D && graphData.plotExpression3D && (
        <Card className="card-glow">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">3D Graph</CardTitle>
            <p className="text-xs font-mono text-muted-foreground">z = {graphData.plotExpression3D}</p>
          </CardHeader>
          <CardContent>
            <div className="w-full aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              <iframe
                src={`https://www.desmos.com/3d`}
                className="w-full h-full border-0"
                title="3D Graph"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

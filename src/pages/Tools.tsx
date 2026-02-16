import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MathToolsSidebar from "@/components/MathToolsSidebar";

export default function Tools() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Math Tools</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <MathToolsSidebar />
        </div>

        <div className="space-y-4">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-base">Desmos Graphing Calculator</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden rounded-b-lg">
              <iframe
                src="https://www.desmos.com/calculator"
                className="w-full h-[400px] border-0"
                title="Desmos Graphing Calculator"
              />
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-base">Desmos 3D Calculator</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden rounded-b-lg">
              <iframe
                src="https://www.desmos.com/3d"
                className="w-full h-[400px] border-0"
                title="Desmos 3D Calculator"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

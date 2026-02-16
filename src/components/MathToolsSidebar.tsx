import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Grid3X3, FunctionSquare, Equal } from "lucide-react";

export default function MathToolsSidebar() {
  return (
    <div className="space-y-4 sticky top-20">
      <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Math Tools</h3>
      
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-secondary/50">
          <TabsTrigger value="calculator" className="text-xs gap-1"><Calculator className="w-3 h-3" />Calc</TabsTrigger>
          
          <TabsTrigger value="desmos" className="text-xs gap-1"><FunctionSquare className="w-3 h-3" />Graph</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <SimpleCalculator />
        </TabsContent>

        <TabsContent value="equation">
          <EquationSolver />
        </TabsContent>

        <TabsContent value="desmos">
          <Card>
            <CardContent className="p-0 overflow-hidden rounded-b-lg">
              <iframe
                src="https://www.desmos.com/calculator"
                className="w-full h-[300px] border-0"
                title="Desmos Calculator" />

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

}

function SimpleCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");

  const handleInput = (val: string) => {
    if (val === "C") {setDisplay("0");setExpression("");return;}
    if (val === "=") {
      try {
        const result = Function(`"use strict"; return (${expression || display})`)();
        setDisplay(String(result));
        setExpression("");
      } catch {
        setDisplay("Error");
      }
      return;
    }
    if (display === "0" && val !== ".") {
      setDisplay(val);
      setExpression(val);
    } else {
      setDisplay(display + val);
      setExpression((expression || display) + val);
    }
  };

  const buttons = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+", "C", "(", ")", "^"];

  return (
    <Card>
      <CardContent className="p-3 space-y-2">
        <div className="p-2 bg-muted rounded text-right font-mono text-lg truncate">{display}</div>
        <div className="grid grid-cols-4 gap-1">
          {buttons.map((btn) =>
          <Button
            key={btn}
            variant={btn === "=" ? "default" : btn === "C" ? "destructive" : "outline"}
            size="sm"
            className="text-xs h-8 font-mono"
            onClick={() => handleInput(btn)}>

              {btn}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>);

}

function EquationSolver() {
  const [equation, setEquation] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const solve = () => {
    try {
      // Simple linear equation solver ax + b = c
      const parts = equation.split("=");
      if (parts.length === 2) {
        const left = parts[0].trim();
        const right = parts[1].trim();
        setResult(`Equation: ${left} = ${right}\nUse the AI solver for complex equations.`);
      } else {
        const res = Function(`"use strict"; return (${equation})`)();
        setResult(`Result: ${res}`);
      }
    } catch {
      setResult("Use the main solver for complex equations");
    }
  };

  return (
    <Card>
      <CardContent className="p-3 space-y-3">
        <Input
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          placeholder="e.g., 2*x + 5 = 15"
          className="font-mono text-sm" />

        <Button size="sm" className="w-full" onClick={solve}>Solve</Button>
        {result && <pre className="text-xs bg-muted p-2 rounded whitespace-pre-wrap font-mono">{result}</pre>}
      </CardContent>
    </Card>);

}
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Grid3X3, FunctionSquare, CircleDot, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function MathToolsSidebar() {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="space-y-3">
      <CollapsibleTrigger className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <CircleDot className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">Math Tools</h3>
        </div>
        <ChevronUp className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "" : "rotate-180"}`} />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-secondary/50">
            <TabsTrigger value="calculator" className="text-xs gap-1.5">
              <Calculator className="w-3.5 h-3.5" />Calc
            </TabsTrigger>
            <TabsTrigger value="matrix" className="text-xs gap-1.5">
              <Grid3X3 className="w-3.5 h-3.5" />Matrix
            </TabsTrigger>
            <TabsTrigger value="integral" className="text-xs gap-1.5">
              <FunctionSquare className="w-3.5 h-3.5" />Integral
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <SimpleCalculator />
          </TabsContent>

          <TabsContent value="matrix">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Matrix calculator — use the AI solver for matrix operations.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integral">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Integral solver — type your integral in the main input.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CollapsibleContent>
    </Collapsible>
  );
}

function SimpleCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");

  const handleInput = (val: string) => {
    if (val === "C") { setDisplay("0"); setExpression(""); return; }
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
        <p className="text-xs text-muted-foreground font-medium mb-1">Expression</p>
        <div className="p-2 bg-muted rounded text-right font-mono text-lg truncate">{display}</div>
        <div className="grid grid-cols-4 gap-1">
          {buttons.map((btn) => (
            <Button
              key={btn}
              variant={btn === "=" ? "default" : btn === "C" ? "destructive" : "outline"}
              size="sm"
              className="text-xs h-8 font-mono"
              onClick={() => handleInput(btn)}
            >
              {btn}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

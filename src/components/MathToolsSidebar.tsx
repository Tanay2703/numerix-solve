import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Grid3X3, FunctionSquare, CircleDot, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
            <MatrixCalculator />
          </TabsContent>

          <TabsContent value="integral">
            <IntegralCalculator />
          </TabsContent>
        </Tabs>
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ───── Simple Calculator ───── */
function SimpleCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");

  const handleInput = (val: string) => {
    if (val === "C") { setDisplay("0"); setExpression(""); return; }
    if (val === "=") {
      try {
        const sanitized = (expression || display).replace(/\^/g, "**");
        const result = Function(`"use strict"; return (${sanitized})`)();
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

/* ───── Matrix Calculator ───── */
type MatrixOp = "add" | "subtract" | "multiply" | "determinant" | "transpose" | "inverse";

function createEmptyMatrix(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function MatrixCalculator() {
  const [size, setSize] = useState(2);
  const [matA, setMatA] = useState<number[][]>(createEmptyMatrix(2, 2));
  const [matB, setMatB] = useState<number[][]>(createEmptyMatrix(2, 2));
  const [operation, setOperation] = useState<MatrixOp>("add");
  const [result, setResult] = useState<string>("");

  const updateSize = (n: number) => {
    setSize(n);
    setMatA(createEmptyMatrix(n, n));
    setMatB(createEmptyMatrix(n, n));
    setResult("");
  };

  const setCell = (mat: "A" | "B", r: number, c: number, val: string) => {
    const setter = mat === "A" ? setMatA : setMatB;
    const source = mat === "A" ? matA : matB;
    const copy = source.map(row => [...row]);
    copy[r][c] = parseFloat(val) || 0;
    setter(copy);
  };

  const determinant = (m: number[][]): number => {
    const n = m.length;
    if (n === 1) return m[0][0];
    if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
    let det = 0;
    for (let c = 0; c < n; c++) {
      const minor = m.slice(1).map(row => [...row.slice(0, c), ...row.slice(c + 1)]);
      det += (c % 2 === 0 ? 1 : -1) * m[0][c] * determinant(minor);
    }
    return det;
  };

  const transpose = (m: number[][]): number[][] =>
    m[0].map((_, c) => m.map(row => row[c]));

  const inverse = (m: number[][]): number[][] | null => {
    const n = m.length;
    const det = determinant(m);
    if (det === 0) return null;
    if (n === 2) {
      return [
        [m[1][1] / det, -m[0][1] / det],
        [-m[1][0] / det, m[0][0] / det],
      ];
    }
    // Cofactor method for n>2
    const cofactors = m.map((row, i) =>
      row.map((_, j) => {
        const minor = m
          .filter((_, ri) => ri !== i)
          .map(r => r.filter((_, ci) => ci !== j));
        return ((i + j) % 2 === 0 ? 1 : -1) * determinant(minor);
      })
    );
    const adj = transpose(cofactors);
    return adj.map(row => row.map(v => v / det));
  };

  const formatMatrix = (m: number[][]): string =>
    m.map(row => "│ " + row.map(v => v.toFixed(2).padStart(7)).join("  ") + " │").join("\n");

  const calculate = () => {
    try {
      switch (operation) {
        case "add":
        case "subtract": {
          const res = matA.map((row, i) =>
            row.map((v, j) => operation === "add" ? v + matB[i][j] : v - matB[i][j])
          );
          setResult(formatMatrix(res));
          break;
        }
        case "multiply": {
          const res = matA.map((row, i) =>
            matB[0].map((_, j) =>
              row.reduce((sum, v, k) => sum + v * matB[k][j], 0)
            )
          );
          setResult(formatMatrix(res));
          break;
        }
        case "determinant":
          setResult(`det(A) = ${determinant(matA)}`);
          break;
        case "transpose":
          setResult(formatMatrix(transpose(matA)));
          break;
        case "inverse": {
          const inv = inverse(matA);
          setResult(inv ? formatMatrix(inv) : "Matrix is singular (det = 0)");
          break;
        }
      }
    } catch {
      setResult("Error in calculation");
    }
  };

  const needsSecondMatrix = operation === "add" || operation === "subtract" || operation === "multiply";

  return (
    <Card>
      <CardContent className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">Size</Label>
          <Select value={String(size)} onValueChange={(v) => updateSize(Number(v))}>
            <SelectTrigger className="h-7 text-xs w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2, 3, 4].map(n => (
                <SelectItem key={n} value={String(n)}>{n}×{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label className="text-xs text-muted-foreground whitespace-nowrap ml-2">Op</Label>
          <Select value={operation} onValueChange={(v) => setOperation(v as MatrixOp)}>
            <SelectTrigger className="h-7 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="add">A + B</SelectItem>
              <SelectItem value="subtract">A − B</SelectItem>
              <SelectItem value="multiply">A × B</SelectItem>
              <SelectItem value="determinant">det(A)</SelectItem>
              <SelectItem value="transpose">Aᵀ</SelectItem>
              <SelectItem value="inverse">A⁻¹</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Matrix A */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Matrix A</p>
          <MatrixGrid matrix={matA} onChange={(r, c, v) => setCell("A", r, c, v)} />
        </div>

        {/* Matrix B */}
        {needsSecondMatrix && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Matrix B</p>
            <MatrixGrid matrix={matB} onChange={(r, c, v) => setCell("B", r, c, v)} />
          </div>
        )}

        <Button size="sm" className="w-full text-xs" onClick={calculate}>
          Calculate
        </Button>

        {result && (
          <div className="p-2 bg-muted rounded">
            <p className="text-xs font-medium text-muted-foreground mb-1">Result</p>
            <pre className="text-xs font-mono whitespace-pre text-foreground">{result}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MatrixGrid({ matrix, onChange }: { matrix: number[][]; onChange: (r: number, c: number, v: string) => void }) {
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${matrix[0].length}, 1fr)` }}>
      {matrix.map((row, r) =>
        row.map((val, c) => (
          <Input
            key={`${r}-${c}`}
            type="number"
            value={val || ""}
            onChange={(e) => onChange(r, c, e.target.value)}
            className="h-7 text-xs text-center font-mono p-0.5"
          />
        ))
      )}
    </div>
  );
}

/* ───── Integral Calculator ───── */
type IntegralType = "power" | "trig" | "exponential" | "logarithmic" | "polynomial";

interface IntegralRule {
  label: string;
  description: string;
  compute: (params: Record<string, number>) => string;
  params: { key: string; label: string; defaultVal: number }[];
}

const INTEGRAL_RULES: Record<IntegralType, IntegralRule> = {
  power: {
    label: "Power Rule",
    description: "∫ axⁿ dx = a·x^(n+1)/(n+1) + C",
    params: [
      { key: "a", label: "a (coefficient)", defaultVal: 1 },
      { key: "n", label: "n (exponent)", defaultVal: 2 },
    ],
    compute: ({ a, n }) => {
      if (n === -1) return `${a} · ln|x| + C`;
      const newExp = n + 1;
      const coeff = a / newExp;
      return `${coeff % 1 === 0 ? coeff : coeff.toFixed(4)}·x^${newExp} + C`;
    },
  },
  trig: {
    label: "Trig Functions",
    description: "∫ a·sin(bx) dx or ∫ a·cos(bx) dx",
    params: [
      { key: "a", label: "a (coefficient)", defaultVal: 1 },
      { key: "b", label: "b (frequency)", defaultVal: 1 },
      { key: "func", label: "0=sin, 1=cos", defaultVal: 0 },
    ],
    compute: ({ a, b, func }) => {
      if (func === 0) return `${(-a / b).toFixed(4)}·cos(${b}x) + C`;
      return `${(a / b).toFixed(4)}·sin(${b}x) + C`;
    },
  },
  exponential: {
    label: "Exponential",
    description: "∫ a·e^(bx) dx = (a/b)·e^(bx) + C",
    params: [
      { key: "a", label: "a (coefficient)", defaultVal: 1 },
      { key: "b", label: "b (exponent coeff)", defaultVal: 1 },
    ],
    compute: ({ a, b }) => `${(a / b).toFixed(4)}·e^(${b}x) + C`,
  },
  logarithmic: {
    label: "Logarithmic",
    description: "∫ a·ln(x) dx = a·(x·ln(x) − x) + C",
    params: [
      { key: "a", label: "a (coefficient)", defaultVal: 1 },
    ],
    compute: ({ a }) => `${a}·(x·ln(x) − x) + C`,
  },
  polynomial: {
    label: "Definite Integral",
    description: "∫[a,b] cxⁿ dx — evaluate over [a,b]",
    params: [
      { key: "c", label: "c (coefficient)", defaultVal: 1 },
      { key: "n", label: "n (exponent)", defaultVal: 2 },
      { key: "lower", label: "Lower bound", defaultVal: 0 },
      { key: "upper", label: "Upper bound", defaultVal: 1 },
    ],
    compute: ({ c, n, lower, upper }) => {
      if (n === -1) {
        const val = c * (Math.log(Math.abs(upper)) - Math.log(Math.abs(lower)));
        return `= ${val.toFixed(6)}`;
      }
      const newExp = n + 1;
      const coeff = c / newExp;
      const val = coeff * (Math.pow(upper, newExp) - Math.pow(lower, newExp));
      return `= ${val.toFixed(6)}`;
    },
  },
};

function IntegralCalculator() {
  const [type, setType] = useState<IntegralType>("power");
  const [params, setParams] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    INTEGRAL_RULES.power.params.forEach(p => { init[p.key] = p.defaultVal; });
    return init;
  });
  const [result, setResult] = useState("");

  const rule = INTEGRAL_RULES[type];

  const switchType = (t: IntegralType) => {
    setType(t);
    const init: Record<string, number> = {};
    INTEGRAL_RULES[t].params.forEach(p => { init[p.key] = p.defaultVal; });
    setParams(init);
    setResult("");
  };

  const compute = () => {
    try {
      setResult(rule.compute(params));
    } catch {
      setResult("Error");
    }
  };

  return (
    <Card>
      <CardContent className="p-3 space-y-3">
        <Select value={type} onValueChange={(v) => switchType(v as IntegralType)}>
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(INTEGRAL_RULES) as IntegralType[]).map(k => (
              <SelectItem key={k} value={k}>{INTEGRAL_RULES[k].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-xs text-muted-foreground font-mono">{rule.description}</p>

        <div className="space-y-2">
          {rule.params.map(p => (
            <div key={p.key} className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground w-24 shrink-0">{p.label}</Label>
              <Input
                type="number"
                value={params[p.key] ?? p.defaultVal}
                onChange={(e) => setParams({ ...params, [p.key]: parseFloat(e.target.value) || 0 })}
                className="h-7 text-xs font-mono"
              />
            </div>
          ))}
        </div>

        <Button size="sm" className="w-full text-xs" onClick={compute}>
          Integrate
        </Button>

        {result && (
          <div className="p-2 bg-muted rounded">
            <p className="text-xs font-medium text-muted-foreground mb-1">Result</p>
            <p className="text-sm font-mono text-foreground">{result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

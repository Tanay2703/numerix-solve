import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Image, Loader2, Sparkles, CircleDot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProblemInputProps {
  onSolve: (problem: string, imageBase64?: string) => void;
  isLoading: boolean;
}

export default function ProblemInput({ onSolve, isLoading }: ProblemInputProps) {
  const [problem, setProblem] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    if (!isImage && !isPdf) {
      toast({ title: "Unsupported file", description: "Please upload an image or PDF.", variant: "destructive" });
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSolve = () => {
    if (!problem.trim() && !imageBase64) {
      toast({ title: "Enter a problem", description: "Type a math problem or upload an image.", variant: "destructive" });
      return;
    }
    onSolve(problem, imageBase64 || undefined);
  };

  return (
    <div className="w-full space-y-3 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <CircleDot className="w-4 h-4 text-primary" />
        <h2 className="font-semibold text-foreground">Enter Your Question</h2>
      </div>

      <Textarea
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        placeholder="Type your math problem here… (e.g., Solve for x: 2x² + 5x − 3 = 0)"
        className="min-h-[140px] text-base bg-card border-border resize-none font-mono"
      />

      <div className="flex flex-wrap gap-3 items-center">
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
          className="gap-2"
        >
          <Image className="w-4 h-4" />
          Upload Image
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
          className="gap-2"
        >
          <FileText className="w-4 h-4" />
          Upload PDF
        </Button>

        {fileName && (
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Upload className="w-3 h-3" /> {fileName}
          </span>
        )}

        <div className="flex-1" />

        <Button
          onClick={handleSolve}
          disabled={isLoading}
          className="gap-2 hero-gradient text-primary-foreground border-0 px-6"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isLoading ? "Solving..." : "Solve Problem"}
        </Button>
      </div>
    </div>
  );
}

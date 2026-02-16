import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { problem, imageBase64 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an expert mathematics tutor and problem solver. When given a math problem, you must respond with a JSON object (no markdown, no code fences) with this exact structure:

{
  "problemExtracted": "the math problem clearly stated",
  "solution": {
    "steps": [
      {"stepNumber": 1, "title": "Step title", "explanation": "Detailed explanation", "latex": "LaTeX expression if applicable"}
    ],
    "finalAnswer": "The final answer",
    "latex": "Final answer in LaTeX"
  },
  "examInfo": {
    "possibleExams": ["List of exams where this type of question appears, e.g. SAT, GRE, JEE Main, JEE Advanced, GATE, Olympiad, AP Calculus, etc."],
    "previousAppearances": ["e.g. JEE Main 2019, SAT 2020 Practice Test 4, etc."],
    "difficulty": "Easy/Medium/Hard",
    "topic": "The mathematical topic",
    "subtopic": "More specific subtopic"
  },
  "theorems": [
    {"name": "Theorem Name", "statement": "Brief statement of the theorem", "assumptions": "Key assumptions", "limitations": "Known limitations", "relevance": "How it applies to this problem"}
  ],
  "graphData": {
    "has2D": true/false,
    "has3D": true/false,
    "plotExpression2D": "e.g. x^2 + 2*x - 3 (use * for multiplication)",
    "plotExpression3D": "e.g. x^2 + y^2 (if applicable)",
    "xRange": [-10, 10],
    "yRange": [-10, 10]
  },
  "youtubeKeywords": ["5 search keywords for YouTube"],
  "practiceProblems": {
    "easy": [{"problem": "...", "hint": "...", "solution": "..."}],
    "medium": [{"problem": "...", "hint": "...", "solution": "..."}],
    "hard": [{"problem": "...", "hint": "...", "solution": "..."}]
  },
  "quantitativeAptitude": [
    {"problem": "A quant aptitude question related to the topic", "solution": "Full worked solution", "difficulty": "Easy/Medium/Hard"}
  ],
  "realLifeApplications": ["Application 1", "Application 2", "Application 3"],
  "referenceLinks": [
    {"name": "Resource Name", "url": "URL", "description": "Brief description"}
  ]
}

Generate 3 easy, 3 medium, and 3 hard practice problems. Generate 3 quantitative aptitude problems. Always include theorems that are relevant to the solution. Be thorough in your step-by-step solution.`;

    const messages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    if (imageBase64) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: "Extract and solve this math problem from the image. Identify the problem, solve step-by-step, and provide all required information:" },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: `Solve this math problem and provide all required information: ${problem}`,
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Try to parse as JSON, clean up if needed
    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { rawResponse: content, error: "Could not parse structured response" };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("solve-math error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { ExternalLink } from "lucide-react";

const resources = [
  { name: "Khan Academy", url: "https://www.khanacademy.org/math", desc: "Free courses from arithmetic to calculus" },
  { name: "MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/mathematics/", desc: "University-level mathematics courses" },
  { name: "Art of Problem Solving", url: "https://artofproblemsolving.com/", desc: "Competition math & advanced problem sets" },
  { name: "Harvard Math", url: "https://www.math.harvard.edu/", desc: "Research & course materials" },
  { name: "3Blue1Brown", url: "https://www.3blue1brown.com/", desc: "Visual math explanations" },
  { name: "Paul's Online Notes", url: "https://tutorial.math.lamar.edu/", desc: "Calculus, algebra & differential equations" },
  { name: "Brilliant.org", url: "https://brilliant.org/courses/#math", desc: "Interactive problem-solving courses" },
  { name: "Project Euler", url: "https://projecteuler.net/", desc: "Challenging math/CS problems" },
];

export default function ResourceLinks() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-fade-in">
      <h2 className="text-lg font-semibold mb-4 text-center">Mathematics Resources</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {resources.map((r) => (
          <a
            key={r.name}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg bg-card border border-border hover:border-primary/40 hover:card-glow transition-all group text-center"
          >
            <p className="text-sm font-medium group-hover:text-primary transition-colors">{r.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

import { Link, useLocation } from "react-router-dom";
import { Calculator, Sun, Moon, BookOpen, Lightbulb, History, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const navItems = [
  { path: "/", label: "Solver", icon: Calculator },
  { path: "/history", label: "History", icon: History },
  { path: "/tools", label: "Tools", icon: Wrench },
];


export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 glass-surface border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full hero-gradient flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-base text-foreground tracking-tight">NumeriX</span>
            <span className="text-[10px] text-muted-foreground font-medium">Powered by Gemini AI</span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  active ?
                  "text-foreground" :
                  "text-muted-foreground hover:text-foreground"}`
                  }>

                  <span>{label}</span>
                </Link>);

            })}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="ml-2 text-muted-foreground hover:text-foreground">

            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </header>);

}
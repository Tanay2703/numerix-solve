import { Link, useLocation } from "react-router-dom";
import { History, Home, BookOpen, Wrench, Lightbulb, House } from "lucide-react";

const navItems = [
{ path: "/", label: "Home", icon: Home },
{ path: "/history", label: "History", icon: History },
{ path: "/tools", label: "Math Tools", icon: Wrench }];


export default function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass-surface border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-base text-foreground tracking-tight">NumeriX</span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">POWERED BY GEMINI AI</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                active ?
                "bg-primary text-primary-foreground" :
                "text-muted-foreground hover:text-foreground hover:bg-secondary"}`
                }>

                <House className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>);

          })}
        </nav>
      </div>
    </header>);

}
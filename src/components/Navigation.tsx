import { Button } from "@/components/ui/button";
import { Moon, BookOpen, TrendingUp, Plus, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  dreamCount: number;
}

const Navigation = ({ activeTab, onTabChange, dreamCount }: NavigationProps) => {
  const { signOut } = useAuth();

  return (
    <nav className="w-full bg-card/40 backdrop-blur-lg border-b border-primary/20 shadow-mystical">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Moon className="h-8 w-8 text-primary animate-dream-float" />
              <h1 className="text-2xl font-bold bg-gradient-dream bg-clip-text text-transparent">
                DreamCatcher
              </h1>
            </div>
            {dreamCount > 0 && (
              <span className="text-sm text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                {dreamCount} dreams captured
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === "entry" ? "dream" : "ethereal"}
              onClick={() => onTabChange("entry")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Dream</span>
            </Button>
            
            <Button
              variant={activeTab === "list" ? "dream" : "ethereal"}
              onClick={() => onTabChange("list")}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Journal</span>
            </Button>
            
            <Button
              variant={activeTab === "analytics" ? "dream" : "ethereal"}
              onClick={() => onTabChange("analytics")}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={signOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
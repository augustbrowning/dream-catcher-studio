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
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-2">
              <Moon className="h-6 w-6 sm:h-8 sm:w-8 text-primary animate-dream-float" />
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-dream bg-clip-text text-transparent">
                <span className="hidden sm:inline">DreamCatcher</span>
                <span className="sm:hidden">Dreams</span>
              </h1>
            </div>
            {dreamCount > 0 && (
              <span className="hidden sm:inline text-sm text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                {dreamCount} dreams captured
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant={activeTab === "entry" ? "dream" : "ethereal"}
              onClick={() => onTabChange("entry")}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
              size="sm"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">New</span>
            </Button>
            
            <Button
              variant={activeTab === "list" ? "dream" : "ethereal"}
              onClick={() => onTabChange("list")}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
              size="sm"
            >
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Journal</span>
            </Button>
            
            <Button
              variant={activeTab === "analytics" ? "dream" : "ethereal"}
              onClick={() => onTabChange("analytics")}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
              size="sm"
            >
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={signOut}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
              size="sm"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import TagBasedDreamEntry from "@/components/TagBasedDreamEntry";
import DreamList from "@/components/DreamList";
import DreamAnalytics from "@/components/DreamAnalytics";
import DreamEntryPopup from "@/components/DreamEntryPopup";
import { Button } from "@/components/ui/button";
import starryBackground from "@/assets/starry-background.jpg";
import { format, isToday } from "date-fns";

interface Dream {
  id: string;
  title: string;
  description: string;
  date: string;
  mood: string;
  themes: string[];
  lucidity: string;
}

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("list"); // Default to journal view
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [showDreamPopup, setShowDreamPopup] = useState(false);

  // Load dreams from localStorage on component mount
  useEffect(() => {
    const savedDreams = localStorage.getItem("dreamcatcher-dreams");
    if (savedDreams) {
      try {
        setDreams(JSON.parse(savedDreams));
      } catch (error) {
        console.error("Error loading dreams from localStorage:", error);
      }
    }
  }, []);

  // Save dreams to localStorage whenever dreams array changes
  useEffect(() => {
    localStorage.setItem("dreamcatcher-dreams", JSON.stringify(dreams));
  }, [dreams]);

  // Check if popup should be shown on first visit each day
  useEffect(() => {
    const lastVisitDate = localStorage.getItem("dreamcatcher-last-visit");
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (lastVisitDate !== today) {
      setShowDreamPopup(true);
      localStorage.setItem("dreamcatcher-last-visit", today);
    }
  }, []);

  // Redirect to auth if not logged in (temporarily disabled for testing)
  useEffect(() => {
    // if (!loading && !user) {
    //   navigate("/auth");
    // }
  }, [user, loading, navigate]);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-night flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto animate-pulse">
            <div className="w-10 h-8 bg-card rounded-sm relative">
              <div className="absolute -top-2 -right-1 w-3 h-3 bg-primary rounded-full" />
              <div className="absolute -top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">DREAM JOURNAL</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveDream = (dreamData: Omit<Dream, 'id'>) => {
    const newDream: Dream = {
      ...dreamData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setDreams(prev => [newDream, ...prev]);
    setActiveTab("list"); // Switch to journal view after saving
  };

  const renderContent = () => {
    switch (activeTab) {
      case "entry":
        return <TagBasedDreamEntry onSaveDream={handleSaveDream} />;
      case "list":
        return <DreamList dreams={dreams} onAddEntry={() => setShowDreamPopup(true)} />;
      case "analytics":
        return <DreamAnalytics dreams={dreams} />;
      default:
        return <DreamList dreams={dreams} onAddEntry={() => setShowDreamPopup(true)} />;
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-night relative overflow-hidden"
      style={{
        backgroundImage: `url(${starryBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-starfield pointer-events-none" />
      
      <div className="relative z-10">
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          dreamCount={dreams.length}
        />
        
        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          {renderContent()}
        </main>
      </div>
      
      {/* Dream Entry Popup */}
      <DreamEntryPopup 
        isOpen={showDreamPopup}
        onClose={() => setShowDreamPopup(false)}
        onSave={handleSaveDream}
      />
      
      {/* Floating stars animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-star-shimmer rounded-full animate-star-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;

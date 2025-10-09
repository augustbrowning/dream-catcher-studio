import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDreams, Dream } from "@/hooks/useDreams";
import Navigation from "@/components/Navigation";
import TagBasedDreamEntry from "@/components/TagBasedDreamEntry";
import DreamList from "@/components/DreamList";
import DreamAnalytics from "@/components/DreamAnalytics";
import DreamEntryPopup from "@/components/DreamEntryPopup";
import { Button } from "@/components/ui/button";
import starryBackground from "@/assets/starry-background.jpg";
import { format, isToday } from "date-fns";

const Index = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [showDreamPopup, setShowDreamPopup] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { dreams, isLoading: dreamsLoading, createDream } = useDreams(user?.id);

  // Editable tag lists
const initialSentiments = [
  'Nervous', 'Intrigued', 'Inquisitive', 'Eager', 'Pondering',
  'Uneasy', 'Engaged', 'Wondering', 'Fascinated', 'Questioning'
];
const initialPeople = [
  'Coach', 'Stranger', 'Coworker', 'Neighbor', 'Teacher', 'Classmate',
  'Future Self', 'Childhood Self', 'A Crowd'
];
const initialActions = [
  'Dreaming', 'Reflecting', 'Driving', 'Sketching', 'Creating',
  'Flying', 'Running', 'Swimming', 'Dancing', 'Exploring'
];
const initialPlaces = [
  'Ocean', 'House', 'Living Room', 'Horizon', 'Car', 'Jungle',
  'Gym', 'Seattle', 'Arizona', 'River', 'Desert', 'Park'
];

const [themeCategories, setThemeCategories] = useState<Record<string, string[]>>({
  Sentiments: initialSentiments,
  People: initialPeople,
  Actions: initialActions,
  Places: initialPlaces,
});

  // Migrate localStorage dreams to database on first login
  useEffect(() => {
    if (user && !dreamsLoading && dreams.length === 0) {
      const storedDreams = localStorage.getItem('dreamcatcher-dreams');
      if (storedDreams) {
        try {
          const localDreams = JSON.parse(storedDreams);
          localDreams.forEach((dream: Dream) => {
            createDream({
              title: dream.title,
              description: dream.description,
              date: dream.date,
              mood: dream.mood,
              themes: dream.themes,
              lucidity: dream.lucidity,
            });
          });
          localStorage.removeItem('dreamcatcher-dreams');
        } catch (error) {
          console.error("Error migrating dreams:", error);
        }
      }
    }
  }, [user, dreamsLoading, dreams.length]);

  // Check if popup should be shown on first visit each day
  useEffect(() => {
    const lastVisitDate = localStorage.getItem("dreamcatcher-last-visit");
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (lastVisitDate !== today) {
      setShowDreamPopup(true);
      localStorage.setItem("dreamcatcher-last-visit", today);
    }
  }, []);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
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
    createDream(dreamData);
    setShowDreamPopup(false);
    setActiveTab("list");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "entry":
        return <TagBasedDreamEntry onSaveDream={handleSaveDream} />;
      case "list":
        return <DreamList dreams={dreams} onAddEntry={() => setShowDreamPopup(true)} />;
      case "analytics":
        return <DreamAnalytics dreams={dreams} themeCategories={themeCategories}/>;
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
        
        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 pt-20 sm:pt-24">
          {renderContent()}
        </main>
      </div>
      
      {/* Dream Entry Popup */}
      <DreamEntryPopup 
        isOpen={showDreamPopup}
        themeCategories={themeCategories}
        setThemeCategories={setThemeCategories}
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

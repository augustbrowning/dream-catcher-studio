import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import DreamEntry from "@/components/DreamEntry";
import DreamList from "@/components/DreamList";
import DreamAnalytics from "@/components/DreamAnalytics";
import starryBackground from "@/assets/starry-background.jpg";

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
  const [activeTab, setActiveTab] = useState("entry");
  const [dreams, setDreams] = useState<Dream[]>([]);

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
        return <DreamEntry onSaveDream={handleSaveDream} />;
      case "list":
        return <DreamList dreams={dreams} />;
      case "analytics":
        return <DreamAnalytics dreams={dreams} />;
      default:
        return <DreamEntry onSaveDream={handleSaveDream} />;
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
        
        <main className="container mx-auto px-4 py-8">
          {renderContent()}
        </main>
      </div>
      
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

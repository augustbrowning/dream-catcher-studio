import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, Lightbulb, ThumbsUp, ThumbsDown, Moon, Plus } from "lucide-react";
import { format, differenceInDays, isToday, isYesterday, startOfDay } from "date-fns";

interface Dream {
  id: string;
  title: string;
  description: string;
  date: string;
  mood: string;
  themes: string[];
  lucidity: string;
}

interface DreamListProps {
  dreams: Dream[];
  onAddEntry?: () => void;
}

const DreamList = ({ dreams, onAddEntry }: DreamListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);

  const getMoodEmoji = (mood: string) => {
    const moodMap: Record<string, string> = {
      joyful: "😊",
      peaceful: "😌",
      exciting: "🤩",
      mysterious: "🔮",
      scary: "😰",
      sad: "😢",
      confused: "😵",
      neutral: "😐"
    };
    return moodMap[mood] || "😐";
  };

  // Calculate streak
  const calculateStreak = () => {
    if (dreams.length === 0) return { current: 0, weekDays: Array(7).fill(null) };

    const sortedDreams = dreams
      .map(dream => startOfDay(new Date(dream.date)))
      .sort((a, b) => b.getTime() - a.getTime());

    const uniqueDays = [...new Set(sortedDreams.map(date => date.getTime()))];
    const today = startOfDay(new Date());
    
    let streak = 0;
    let currentDate = today;

    // Check if there's a dream today or yesterday
    const hasRecentDream = uniqueDays.some(day => {
      const dayDate = new Date(day);
      return isToday(dayDate) || isYesterday(dayDate);
    });

    if (!hasRecentDream) {
      streak = 0;
    } else {
      // Calculate consecutive days
      for (let i = 0; i < uniqueDays.length; i++) {
        const dreamDate = new Date(uniqueDays[i]);
        const daysDiff = differenceInDays(currentDate, dreamDate);
        
        if (daysDiff === 0 || daysDiff === 1) {
          streak++;
          currentDate = dreamDate;
        } else {
          break;
        }
      }
    }

    // Generate week view (last 7 days)
    const weekDays = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = startOfDay(date);
      const hasDream = uniqueDays.some(dreamDay => 
        new Date(dreamDay).getTime() === dayStart.getTime()
      );
      
      weekDays.push({
        day: format(dayStart, 'EEE')[0], // First letter of day
        date: format(dayStart, 'd'),
        hasDream,
        isToday: isToday(dayStart)
      });
    }

    return { current: streak, weekDays };
  };

  const filteredDreams = dreams.filter(dream => {
    const matchesSearch = dream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dream.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dream.themes.some(theme => theme.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const sortedDreams = filteredDreams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const { current: streak, weekDays } = calculateStreak();

  // If viewing individual dream
  if (selectedDream) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedDream(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Journal
          </Button>
        </div>

        <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-mystical">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-foreground flex items-center gap-3">
                  <span className="text-3xl">{getMoodEmoji(selectedDream.mood)}</span>
                  {selectedDream.title}
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  {format(new Date(selectedDream.date), 'MMMM dd, yyyy')}
                </p>
              </div>
              <span className="text-4xl">{getMoodEmoji(selectedDream.mood)}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tags */}
            {selectedDream.themes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedDream.themes.map((theme) => (
                  <Badge 
                    key={theme} 
                    variant="outline" 
                    className="bg-primary/10 border-primary/30 text-foreground"
                  >
                    {theme}
                  </Badge>
                ))}
              </div>
            )}

            {/* Dream Description */}
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground/90 leading-relaxed text-lg">
                {selectedDream.description}
              </p>
            </div>

            {/* Dream Analysis Section */}
            <Card className="bg-card/50 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Dream Analysis</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">AI Insight</p>
                    <p className="text-foreground">
                      This dream shows themes of {selectedDream.themes.slice(0, 2).join(' and ')}, 
                      suggesting your subconscious is processing experiences related to these areas. 
                      The {selectedDream.mood} mood indicates {
                        selectedDream.mood === 'joyful' ? 'positive emotional states' :
                        selectedDream.mood === 'scary' ? 'underlying anxieties or fears' :
                        selectedDream.mood === 'peaceful' ? 'a calm and balanced mindset' :
                        'mixed emotional processing'
                      }.
                    </p>
                  </div>

                  {/* Request Feature */}
                  <div className="border-t border-primary/20 pt-4">
                    <p className="text-sm text-muted-foreground mb-3">Request Feature</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4" />
                          Yes Please!
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <ThumbsDown className="h-4 w-4" />
                          No Thanks
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main journal view
  if (dreams.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-card/80 backdrop-blur-lg border-primary/20 shadow-mystical">
        <CardContent className="p-12 text-center">
          <Moon className="h-16 w-16 mx-auto mb-4 text-primary/50" />
          <h3 className="text-xl font-semibold mb-2 text-moonlight">No Dreams Yet</h3>
          <p className="text-muted-foreground">
            Start capturing your dreams to build your personal dream journal and discover patterns in your subconscious mind.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto space-y-6 pb-20">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search dreams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-card/50 backdrop-blur-sm border-primary/20 focus:border-primary/50"
        />
      </div>

      {/* Days in a Row */}
      <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-mystical">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">DAYS IN A ROW</h3>
          
          <div className="flex justify-between items-end mb-4">
            {weekDays.map((day, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                  day.hasDream 
                    ? 'bg-primary text-primary-foreground' 
                    : day.isToday 
                      ? 'bg-muted border-2 border-primary text-foreground' 
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {day.date}
                </div>
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
          
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">{streak}</span>
            <span className="text-sm text-muted-foreground ml-1">Total</span>
          </div>
        </CardContent>
      </Card>

      {/* Dream Entries */}
      <div className="space-y-4">
        {sortedDreams.map((dream) => (
          <Card 
            key={dream.id} 
            className="bg-card/60 backdrop-blur-lg border-primary/20 shadow-mystical hover:shadow-dream transition-all duration-300 hover:scale-[1.01] cursor-pointer"
            onClick={() => setSelectedDream(dream)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getMoodEmoji(dream.mood)}</span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(dream.date), 'M-dd-yyyy')}
                  </span>
                </div>
                <span className="text-2xl">{getMoodEmoji(dream.mood)}</span>
              </div>
              
              {dream.themes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {dream.themes.slice(0, 4).map((theme) => (
                    <Badge 
                      key={theme} 
                      variant="outline" 
                      className="bg-primary/10 border-primary/30 text-foreground text-xs"
                    >
                      {theme}
                    </Badge>
                  ))}
                  {dream.themes.length > 4 && (
                    <Badge variant="outline" className="bg-muted/20 border-muted text-muted-foreground text-xs">
                      +{dream.themes.length - 4}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedDreams.length === 0 && searchTerm && (
        <Card className="bg-card/60 backdrop-blur-lg border-primary/20">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-primary/50" />
            <h3 className="text-lg font-semibold mb-2 text-moonlight">No Dreams Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms to find your dreams.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Fixed Add Entry Button */}
      {onAddEntry && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button 
            onClick={onAddEntry}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full shadow-lg flex items-center gap-2"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Add Entry
          </Button>
        </div>
      )}
    </div>
  );
};

export default DreamList;
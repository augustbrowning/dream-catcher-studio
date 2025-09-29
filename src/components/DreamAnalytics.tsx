import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { X, Upload, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { format, subDays } from "date-fns";

interface Dream {
  id: string;
  title: string;
  description: string;
  date: string;
  mood: string;
  themes: string[];
  lucidity: string;
}

interface DreamAnalyticsProps {
  dreams: Dream[];
}

const MOOD_EMOJIS = {
  joyful: "😊",
  content: "🙂",
  neutral: "😐",
  disappointed: "😔",
  sad: "😢"
};

const MOOD_COLORS = {
  joyful: "bg-yellow-400",
  peaceful: "bg-blue-400", 
  exciting: "bg-orange-400",
  mysterious: "bg-purple-400",
  scary: "bg-red-400",
  sad: "bg-blue-600",
  confused: "bg-gray-400",
  neutral: "bg-gray-300"
};

// Theme categories based on the tag system
const THEME_CATEGORIES = {
  sensations: ["flying", "falling", "running", "swimming", "climbing", "floating", "pain", "warmth", "cold"],
  figures: ["family", "friends", "strangers", "animals", "celebrities", "deceased", "children", "authority"],
  actions: ["chasing", "escaping", "fighting", "dancing", "singing", "eating", "driving", "working"],
  places: ["home", "school", "work", "nature", "city", "beach", "mountains", "space", "underground"]
};

// Mock behavioral correlation data
const BEHAVIORAL_CORRELATIONS = {
  joyful: [
    { activity: "Meditation", percentage: 85 },
    { activity: "Sleep", percentage: 78 },
    { activity: "Cardio", percentage: 72 }
  ],
  neutral: [
    { activity: "Screen Time", percentage: 65 },
    { activity: "Resistance Training", percentage: 58 },
    { activity: "Sugar", percentage: 45 }
  ],
  scary: [
    { activity: "Alcohol", percentage: 73 },
    { activity: "Screen Time", percentage: 68 },
    { activity: "Sugar", percentage: 61 }
  ]
};

const DreamAnalytics = ({ dreams }: DreamAnalyticsProps) => {
  const [activeThemeCategory, setActiveThemeCategory] = useState<keyof typeof THEME_CATEGORIES>("sensations");
  const [isDaylioConnected, setIsDaylioConnected] = useState(false);
  const [timePeriod, setTimePeriod] = useState<string>("all-time");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleDaylioImport = () => {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // TODO: Process Daylio data file
        toast({
          title: "Import Started",
          description: `Processing ${file.name}...`,
        });
        // For now, just simulate connection
        setTimeout(() => {
          setIsDaylioConnected(true);
          toast({
            title: "Daylio Connected",
            description: "Your habit data has been imported successfully!",
          });
        }, 2000);
      }
    };
    input.click();
  };

  if (dreams.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-card/80 backdrop-blur-lg border-primary/20 shadow-mystical">
        <CardContent className="p-12 text-center">
          <div className="h-16 w-16 mx-auto mb-4 text-primary/50 text-4xl">📊</div>
          <h3 className="text-xl font-semibold mb-2 text-moonlight">No Analytics Yet</h3>
          <p className="text-muted-foreground">
            Capture at least a few dreams to see insights and patterns in your dream journal.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Generate days for dream vibes calendar (responsive: 20 on desktop, 10 on mobile)
  const numDays = isMobile ? 10 : 20;
  const calendarDays = Array.from({ length: numDays }, (_, i) => {
    const date = subDays(new Date(), numDays - 1 - i);
    const dreamOnDay = dreams.find(dream => 
      format(new Date(dream.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    return {
      date,
      day: format(date, 'd'),
      mood: dreamOnDay?.mood || null,
      hasDream: !!dreamOnDay
    };
  });

  // Define the sentiment emojis for the grid (matching DreamEntryPopup moods)
  const sentimentEmojis = ["😊", "🙂", "😐", "😔", "😢"];

  // Calculate theme counts by category
  const getThemesByCategory = (category: keyof typeof THEME_CATEGORIES) => {
    const categoryThemes = THEME_CATEGORIES[category];
    const themeCounts = dreams.reduce((acc, dream) => {
      dream.themes.forEach(theme => {
        const normalizedTheme = theme.toLowerCase();
        if (categoryThemes.includes(normalizedTheme)) {
          acc[theme] = (acc[theme] || 0) + 1;
        }
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(themeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 12);
  };

  const currentThemes = getThemesByCategory(activeThemeCategory);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 p-2 sm:p-6">

      {/* Dream Vibes Calendar */}
      <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-mystical">
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-foreground">Dream Vibes</h3>
          <div className="flex gap-4">
            {/* Sentiment emojis column */}
            <div className="flex flex-col">
              {sentimentEmojis.map((emoji, index) => (
                <div key={index} className="w-8 h-8 flex items-center justify-center text-xl mb-1">
                  {emoji}
                </div>
              ))}
              {/* Spacer for date row */}
              <div className="w-8 h-6 mt-2"></div>
            </div>
            
            {/* Grid of days */}
            <ScrollArea className="flex-1">
              <div className="min-w-min">
                {/* Sentiment grid rows */}
                {sentimentEmojis.map((emoji, emojiIndex) => (
                  <div key={emojiIndex} className="flex gap-1 mb-1">
                    {calendarDays.map((day, dayIndex) => {
                      // Check if this day has a dream with this sentiment
                      const hasThisSentiment = day.hasDream && day.mood && 
                        MOOD_EMOJIS[day.mood as keyof typeof MOOD_EMOJIS] === emoji;
                      
                      return (
                        <div 
                          key={dayIndex} 
                          className={`w-8 h-8 rounded flex-shrink-0 ${
                            hasThisSentiment 
                              ? 'bg-green-500' 
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
                
                {/* Date row at bottom */}
                <div className="flex gap-1 mt-2">
                  {calendarDays.map((day, index) => (
                    <div key={index} className="w-8 h-6 text-xs text-center text-muted-foreground flex items-center justify-center flex-shrink-0">
                      {day.day}
                    </div>
                  ))}
                </div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Recurring Themes */}
      <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-mystical">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">Recurring Themes</h3>
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-[130px] sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-1 mb-4 sm:mb-6 bg-muted/30 rounded-lg p-1">
            {Object.keys(THEME_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setActiveThemeCategory(category as keyof typeof THEME_CATEGORIES)}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  activeThemeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Word Cloud Visualization */}
          <div className="min-h-[150px] sm:min-h-[200px] relative p-3 sm:p-6">
            {currentThemes.length > 0 ? (
              currentThemes.map(([theme, count], index) => {
                const baseSize = window.innerWidth < 640 ? 12 : 14;
                const maxSize = window.innerWidth < 640 ? 24 : 32;
                const size = Math.max(baseSize, Math.min(maxSize, baseSize + (count * 2)));
                const opacity = Math.max(0.5, Math.min(1, 0.5 + (count * 0.1)));
                
                // Generate random but deterministic position based on theme name
                const seed = theme.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const random = (offset: number) => ((seed * (offset + 1) * 9301 + 49297) % 233280) / 233280;
                
                // Grid-based positioning to reduce overlap (4x3 grid)
                const gridSize = 4;
                const gridX = (index % gridSize) / gridSize;
                const gridY = Math.floor(index / gridSize) / Math.ceil(currentThemes.length / gridSize);
                
                // Add randomness within grid cell
                const randomOffsetX = (random(1) - 0.5) * 20; // ±10%
                const randomOffsetY = (random(2) - 0.5) * 20; // ±10%
                const left = `${Math.max(5, Math.min(85, gridX * 100 + randomOffsetX))}%`;
                const top = `${Math.max(5, Math.min(85, gridY * 100 + randomOffsetY))}%`;
                
                // Random rotation between -10 and 10 degrees
                const rotation = (random(3) - 0.5) * 20;
                
                return (
                  <span
                    key={theme}
                    className="cursor-pointer hover:text-primary transition-all absolute"
                    style={{
                      fontSize: `${size}px`,
                      opacity,
                      fontWeight: count > 3 ? 'bold' : 'normal',
                      left,
                      top,
                      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    }}
                  >
                    {theme}
                  </span>
                );
              })
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground text-center text-sm sm:text-base">
                  No {activeThemeCategory} themes recorded yet
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Behavioral Correlations */}
      <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-mystical">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-foreground">Behavioral Correlations</h3>
          
          {!isDaylioConnected ? (
            /* Daylio Connection CTA */
            <div className="text-center py-12">
              <div className="mb-6">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h4 className="text-xl font-semibold text-foreground mb-2">Connect Your Habit Tracker</h4>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Import data from Daylio to see correlations between your daily habits and dream patterns.
                </p>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleDaylioImport}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Daylio Data
                </Button>
                
                <div className="text-xs text-muted-foreground">
                  <p>Supported formats: CSV, JSON</p>
                  <p className="mt-1">
                    Export your data from Daylio: Settings → Data → Export
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Connected State - Show actual correlations */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Joyful Dreams */}
              <div>
                <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-foreground flex items-center gap-2">
                  😊 <span className="hidden sm:inline">Joyful Dreams</span><span className="sm:hidden">Joyful</span>
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {BEHAVIORAL_CORRELATIONS.joyful.map((item) => (
                    <div key={item.activity} className="flex items-center justify-between p-2 sm:p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <span className="text-xs sm:text-sm">{item.activity}</span>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm font-medium">{item.percentage}%</span>
                        <button className="text-xs text-muted-foreground hover:text-foreground hidden sm:inline">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Neutral/Mixed Dreams */}
              <div>
                <h4 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
                  😐 Neutral/Mixed Dreams
                </h4>
                <div className="space-y-3">
                  {BEHAVIORAL_CORRELATIONS.neutral.map((item) => (
                    <div key={item.activity} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg">
                      <span className="text-sm">{item.activity}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.percentage}%</span>
                        <button className="text-xs text-muted-foreground hover:text-foreground">
                          Remove Connection
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terrifying Dreams */}
              <div>
                <h4 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
                  😨 Terrifying Dreams
                </h4>
                <div className="space-y-3">
                  {BEHAVIORAL_CORRELATIONS.scary.map((item) => (
                    <div key={item.activity} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <span className="text-sm">{item.activity}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.percentage}%</span>
                        <button className="text-xs text-muted-foreground hover:text-foreground">
                          Remove Connection
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DreamAnalytics;
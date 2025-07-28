import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Filter, Moon, Sparkles, Clock, Heart, Brain } from "lucide-react";
import { format } from "date-fns";

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
}

const DreamList = ({ dreams }: DreamListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [moodFilter, setMoodFilter] = useState("all");
  const [lucidityFilter, setLucidityFilter] = useState("all");

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

  const getLucidityIcon = (lucidity: string) => {
    switch (lucidity) {
      case "fully-lucid": return <Brain className="h-4 w-4 text-accent" />;
      case "semi-lucid": return <Brain className="h-4 w-4 text-primary/70" />;
      default: return <Moon className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const filteredDreams = dreams.filter(dream => {
    const matchesSearch = dream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dream.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dream.themes.some(theme => theme.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMood = moodFilter === "all" || dream.mood === moodFilter;
    const matchesLucidity = lucidityFilter === "all" || dream.lucidity === lucidityFilter;
    
    return matchesSearch && matchesMood && matchesLucidity;
  });

  const sortedDreams = filteredDreams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-mystical">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl bg-gradient-dream bg-clip-text text-transparent">
            <Sparkles className="h-5 w-5 text-primary" />
            Your Dream Journal
            <span className="text-sm font-normal text-muted-foreground">({dreams.length} dreams captured)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your dreams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card/50 backdrop-blur-sm border-primary/20 focus:border-primary/50"
              />
            </div>
            <Select value={moodFilter} onValueChange={setMoodFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-card/50 backdrop-blur-sm border-primary/20">
                <SelectValue placeholder="Filter by mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Moods</SelectItem>
                <SelectItem value="joyful">😊 Joyful</SelectItem>
                <SelectItem value="peaceful">😌 Peaceful</SelectItem>
                <SelectItem value="exciting">🤩 Exciting</SelectItem>
                <SelectItem value="mysterious">🔮 Mysterious</SelectItem>
                <SelectItem value="scary">😰 Scary</SelectItem>
                <SelectItem value="sad">😢 Sad</SelectItem>
                <SelectItem value="confused">😵 Confused</SelectItem>
                <SelectItem value="neutral">😐 Neutral</SelectItem>
              </SelectContent>
            </Select>
            <Select value={lucidityFilter} onValueChange={setLucidityFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-card/50 backdrop-blur-sm border-primary/20">
                <SelectValue placeholder="Filter by lucidity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="not-lucid">Not Lucid</SelectItem>
                <SelectItem value="semi-lucid">Semi-Lucid</SelectItem>
                <SelectItem value="fully-lucid">Fully Lucid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {sortedDreams.map((dream) => (
          <Card 
            key={dream.id} 
            className="bg-card/60 backdrop-blur-lg border-primary/20 shadow-mystical hover:shadow-dream transition-all duration-300 hover:scale-[1.01] animate-dream-float"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                  <span className="text-2xl">{getMoodEmoji(dream.mood)}</span>
                  {dream.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getLucidityIcon(dream.lucidity)}
                  <Calendar className="h-4 w-4" />
                  {format(new Date(dream.date), 'MMM dd, yyyy')}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90 leading-relaxed">{dream.description}</p>
              
              {dream.themes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {dream.themes.map((theme) => (
                    <Badge 
                      key={theme} 
                      variant="outline" 
                      className="bg-primary/10 border-primary/30 text-foreground hover:bg-primary/20"
                    >
                      {theme}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {dream.mood}
                  </span>
                  <span className="flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    {dream.lucidity.replace('-', ' ')}
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(dream.date), 'h:mm a')}
                </span>
              </div>
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
              Try adjusting your search terms or filters to find your dreams.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DreamList;
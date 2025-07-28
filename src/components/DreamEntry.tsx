import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Moon, Star, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Dream {
  id: string;
  title: string;
  description: string;
  date: string;
  mood: string;
  themes: string[];
  lucidity: string;
}

interface DreamEntryProps {
  onSaveDream: (dream: Omit<Dream, 'id'>) => void;
}

const DreamEntry = ({ onSaveDream }: DreamEntryProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mood, setMood] = useState("");
  const [lucidity, setLucidity] = useState("");
  const [themes, setThemes] = useState<string[]>([]);
  const [newTheme, setNewTheme] = useState("");
  const { toast } = useToast();

  const commonThemes = [
    "Flying", "Falling", "Water", "Animals", "People", "Adventure", 
    "Nightmare", "Fantasy", "School/Work", "Family", "Travel", "Death"
  ];

  const addTheme = (theme: string) => {
    if (theme && !themes.includes(theme)) {
      setThemes([...themes, theme]);
      setNewTheme("");
    }
  };

  const removeTheme = (theme: string) => {
    setThemes(themes.filter(t => t !== theme));
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and description for your dream.",
        variant: "destructive"
      });
      return;
    }

    const dream = {
      title: title.trim(),
      description: description.trim(),
      date: new Date().toISOString(),
      mood: mood || "neutral",
      themes,
      lucidity: lucidity || "not-lucid"
    };

    onSaveDream(dream);
    
    // Reset form
    setTitle("");
    setDescription("");
    setMood("");
    setLucidity("");
    setThemes([]);
    
    toast({
      title: "Dream Captured",
      description: "Your dream has been saved to your journal.",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-lg border-primary/20 shadow-dream animate-dream-float">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl bg-gradient-dream bg-clip-text text-transparent">
          <Moon className="h-6 w-6 text-primary" />
          Capture Your Dream
          <Sparkles className="h-6 w-6 text-accent" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-moonlight">Dream Title</Label>
          <Input
            id="title"
            placeholder="Give your dream a memorable title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-card/50 backdrop-blur-sm border-primary/20 focus:border-primary/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-moonlight">Dream Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your dream in detail... What did you see? How did you feel?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-32 bg-card/50 backdrop-blur-sm border-primary/20 focus:border-primary/50 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mood" className="text-moonlight">Mood/Emotion</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger className="bg-card/50 backdrop-blur-sm border-primary/20">
                <SelectValue placeholder="How did the dream feel?" />
              </SelectTrigger>
              <SelectContent>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="lucidity" className="text-moonlight">Lucidity Level</Label>
            <Select value={lucidity} onValueChange={setLucidity}>
              <SelectTrigger className="bg-card/50 backdrop-blur-sm border-primary/20">
                <SelectValue placeholder="Were you aware you were dreaming?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-lucid">Not Lucid</SelectItem>
                <SelectItem value="semi-lucid">Semi-Lucid</SelectItem>
                <SelectItem value="fully-lucid">Fully Lucid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-moonlight">Dream Themes</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {themes.map((theme) => (
              <Badge 
                key={theme} 
                variant="secondary" 
                className="bg-primary/20 text-foreground hover:bg-primary/30 cursor-pointer"
                onClick={() => removeTheme(theme)}
              >
                {theme}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add a custom theme..."
              value={newTheme}
              onChange={(e) => setNewTheme(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTheme(newTheme)}
              className="bg-card/50 backdrop-blur-sm border-primary/20 focus:border-primary/50"
            />
            <Button 
              variant="outline" 
              onClick={() => addTheme(newTheme)}
              disabled={!newTheme.trim()}
            >
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {commonThemes.filter(theme => !themes.includes(theme)).map((theme) => (
              <Badge 
                key={theme} 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/10 border-primary/30"
                onClick={() => addTheme(theme)}
              >
                <Star className="h-3 w-3 mr-1" />
                {theme}
              </Badge>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleSubmit} 
          className="w-full" 
          variant="dream"
          size="lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Save Dream to Journal
        </Button>
      </CardContent>
    </Card>
  );
};

export default DreamEntry;
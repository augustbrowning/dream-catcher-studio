import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Moon, X } from "lucide-react";
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

interface TagBasedDreamEntryProps {
  onSaveDream: (dream: Omit<Dream, 'id'>) => void;
}

const TagBasedDreamEntry = ({ onSaveDream }: TagBasedDreamEntryProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState("");
  const { toast } = useToast();

  const moodOptions = [
    { value: "joyful", emoji: "😊", label: "Joyful" },
    { value: "peaceful", emoji: "😌", label: "Peaceful" },
    { value: "exciting", emoji: "🤩", label: "Exciting" },
    { value: "mysterious", emoji: "🔮", label: "Mysterious" },
    { value: "scary", emoji: "😰", label: "Scary" },
    { value: "sad", emoji: "😢", label: "Sad" },
    { value: "confused", emoji: "😵", label: "Confused" },
    { value: "nervous", emoji: "😰", label: "Nervous" },
  ];

  const tagCategories = {
    "Actions & Movement": [
      "Flying", "Falling", "Running", "Swimming", "Dancing", "Climbing", "Fighting", "Hiding", "Chasing", "Escaping"
    ],
    "People & Relationships": [
      "Family", "Friends", "Strangers", "Ex-Partner", "Celebrities", "Children", "Parents", "Teachers", "Coworkers", "Romantic Interest"
    ],
    "Places & Settings": [
      "School", "Work", "Home", "Beach", "Forest", "City", "Space", "Underground", "Hospital", "Restaurant", "Childhood Home", "Unknown Place"
    ],
    "Nature & Elements": [
      "Water", "Fire", "Earth", "Air", "Ocean", "Mountains", "Sky", "Rain", "Snow", "Lightning", "Animals", "Plants"
    ],
    "Objects & Items": [
      "Car", "Phone", "Money", "Food", "Clothes", "Books", "Mirror", "Keys", "Door", "Window", "Stairs", "Bridge"
    ],
    "Supernatural & Fantasy": [
      "Magic", "Monsters", "Ghosts", "Angels", "Demons", "Superpowers", "Time Travel", "Alternate Reality", "Shapeshifting", "Telepathy"
    ],
    "Life Events": [
      "Death", "Birth", "Wedding", "Graduation", "Moving", "Travel", "Accident", "Illness", "Success", "Failure", "Tests", "Performance"
    ]
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < 10) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      toast({
        title: "Maximum Tags Reached",
        description: "You can select up to 10 tags maximum.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = () => {
    if (selectedTags.length < 3) {
      toast({
        title: "Not Enough Tags",
        description: "Please select at least 3 tags to describe your dream.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedMood) {
      toast({
        title: "Mood Required",
        description: "Please select how the dream felt.",
        variant: "destructive"
      });
      return;
    }

    const dream = {
      title: `Dream with ${selectedTags.slice(0, 3).join(", ")}`,
      description: `Tags: ${selectedTags.join(", ")}`,
      date: new Date().toISOString(),
      mood: selectedMood,
      themes: selectedTags,
      lucidity: "not-lucid"
    };

    onSaveDream(dream);
    
    // Reset form
    setSelectedTags([]);
    setSelectedMood("");
    
    toast({
      title: "Dream Captured",
      description: "Your dream has been saved to your journal.",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Selected Tags Section */}
      <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-dream">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl bg-gradient-dream bg-clip-text text-transparent">
            <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Selected Dream Tags ({selectedTags.length}/10)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {selectedTags.length === 0 ? (
            <p className="text-center text-muted-foreground py-4 text-sm sm:text-base">
              Select at least 3 tags to describe your dream
            </p>
          ) : (
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {selectedTags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="default" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer px-2 sm:px-3 py-1 text-xs sm:text-sm"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  <X className="h-3 w-3 ml-1 sm:ml-2" />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tag Categories */}
      <div className="space-y-3 sm:space-y-4">
        {Object.entries(tagCategories).map(([category, tags]) => (
          <Card key={category} className="bg-card/60 backdrop-blur-lg border-primary/10">
            <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">{category}</h3>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 py-1 ${
                      selectedTags.includes(tag) 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "hover:bg-primary/10 border-primary/30"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sticky Mood Selection and CTA */}
      <div className="sticky bottom-4 z-10 space-y-3 sm:space-y-4 pb-4 sm:pb-0">
        <Card className="bg-card/95 backdrop-blur-lg border-primary/20 shadow-dream">
          <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
            <CardTitle className="text-center text-base sm:text-lg">How did this dream feel?</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="grid grid-cols-4 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-3">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`flex flex-col items-center p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedMood === mood.value
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <span className="text-lg sm:text-2xl mb-1">{mood.emoji}</span>
                  <span className="text-xs sm:text-sm font-medium">{mood.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleSubmit} 
          className="w-full text-sm sm:text-base" 
          variant="dream"
          size="lg"
          disabled={selectedTags.length < 3 || !selectedMood}
        >
          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          Save Dream to Journal
        </Button>
      </div>
    </div>
  );
};

export default TagBasedDreamEntry;
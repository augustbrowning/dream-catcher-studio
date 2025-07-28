import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
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

interface DreamEntryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dreamData: Omit<Dream, 'id'>) => void;
}

const SLEEP_QUALITY = [
  { id: 'poor', label: 'Poor', color: 'bg-red-100 border-red-300 text-red-800' },
  { id: 'fair', label: 'Fair', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  { id: 'good', label: 'Good', color: 'bg-green-100 border-green-300 text-green-800' }
];

const SENTIMENTS = [
  'Nervous', 'Intrigued', 'Inquisitive', 'Eager', 'Pondering',
  'Uneasy', 'Engaged', 'Wondering', 'Fascinated', 'Questioning'
];

const PEOPLE = [
  'Alex', 'Pet', 'Sorceress', 'Skylar', 'Drew', 'Quinn',
  'Morgan', 'Taylor', 'Casey', 'Riley', 'Jamie', 'Cameron'
];

const ACTIONS = [
  'Dreaming', 'Reflecting', 'Driving', 'Sketching', 'Creating',
  'Flying', 'Running', 'Swimming', 'Dancing', 'Exploring'
];

const MOOD_OPTIONS = [
  { emoji: '😢', value: 'sad' },
  { emoji: '😔', value: 'disappointed' },
  { emoji: '😐', value: 'neutral' },
  { emoji: '🙂', value: 'content' },
  { emoji: '😊', value: 'joyful' }
];

const DreamEntryPopup = ({ isOpen, onClose, onSave }: DreamEntryPopupProps) => {
  const [sleepQuality, setSleepQuality] = useState<string>('');
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');

  const handleTagToggle = (tag: string, selectedTags: string[], setSelectedTags: (tags: string[]) => void) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 10) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const allSelectedTags = [...selectedSentiments, ...selectedPeople, ...selectedActions];
  const canSubmit = allSelectedTags.length >= 3 && selectedMood;

  const handleSave = () => {
    if (!canSubmit) return;

    const dreamData = {
      title: `Dream from ${format(new Date(), 'MMM dd, yyyy')}`,
      description: `A dream featuring ${allSelectedTags.slice(0, 3).join(', ')} with a ${selectedMood} mood.`,
      date: new Date().toISOString(),
      mood: selectedMood,
      themes: allSelectedTags,
      lucidity: 'not-lucid'
    };

    onSave(dreamData);
    
    // Reset form
    setSleepQuality('');
    setSelectedSentiments([]);
    setSelectedPeople([]);
    setSelectedActions([]);
    setSelectedMood('');
    onClose();
  };

  const handleNoDreams = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-xl font-semibold">DreamJournal</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-1">
          {/* How did you sleep? */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">How did you sleep?</h3>
              <span className="text-sm text-muted-foreground">{format(new Date(), 'M-dd-yyyy')}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Select all that apply</p>
            <div className="flex gap-3">
              {SLEEP_QUALITY.map((quality) => (
                <button
                  key={quality.id}
                  onClick={() => setSleepQuality(quality.id)}
                  className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                    sleepQuality === quality.id ? quality.color : 'bg-muted border-muted'
                  }`}
                >
                  {quality.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sentiments */}
          <div>
            <h3 className="text-lg font-medium mb-3">Sentiments</h3>
            <div className="flex flex-wrap gap-2">
              {SENTIMENTS.map((sentiment) => (
                <button
                  key={sentiment}
                  onClick={() => handleTagToggle(sentiment, selectedSentiments, setSelectedSentiments)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    selectedSentiments.includes(sentiment)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  {sentiment}
                </button>
              ))}
            </div>
          </div>

          {/* People */}
          <div>
            <h3 className="text-lg font-medium mb-3">People</h3>
            <div className="flex flex-wrap gap-2">
              {PEOPLE.map((person) => (
                <button
                  key={person}
                  onClick={() => handleTagToggle(person, selectedPeople, setSelectedPeople)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    selectedPeople.includes(person)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  {person}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3 className="text-lg font-medium mb-3">Actions</h3>
            <div className="flex flex-wrap gap-2">
              {ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => handleTagToggle(action, selectedActions, setSelectedActions)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    selectedActions.includes(action)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Selected tags summary */}
          {allSelectedTags.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Selected ({allSelectedTags.length}/10) - Minimum 3 required
              </p>
              <div className="flex flex-wrap gap-2">
                {allSelectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Mood Selection - Sticky */}
          <div className="sticky bottom-0 bg-background border-t pt-4 -mx-1 px-1">
            <div className="flex justify-center gap-4 mb-4">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`w-12 h-12 rounded-full border-2 transition-colors flex items-center justify-center text-2xl ${
                    selectedMood === mood.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleSave}
                disabled={!canSubmit}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                size="lg"
              >
                Log Dream
              </Button>
              
              <Button 
                onClick={handleNoDreams}
                variant="outline" 
                className="w-full"
                size="lg"
              >
                No Dreams To Log
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DreamEntryPopup;
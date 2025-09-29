import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus } from "lucide-react";
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
  'Coach', 'Stranger', 'Coworker', 'Neighbor', 'Teacher', 'Classmate',
  'Future Self', 'Childhood Self', 'A Crowd'
];

const ACTIONS = [
  'Dreaming', 'Reflecting', 'Driving', 'Sketching', 'Creating',
  'Flying', 'Running', 'Swimming', 'Dancing', 'Exploring'
];

const PLACES = [
  'Ocean', 'House', 'Living Room', 'Horizon', 'Car', 'Jungle',
  'Gym', 'Seattle', 'Arizona', 'River', 'Desert', 'Park'
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
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [expandedSentiments, setExpandedSentiments] = useState<boolean>(false);
  const [expandedPeople, setExpandedPeople] = useState<boolean>(false);
  const [expandedActions, setExpandedActions] = useState<boolean>(false);
  const [expandedPlaces, setExpandedPlaces] = useState<boolean>(false);
  const [showCustomSentiment, setShowCustomSentiment] = useState<boolean>(false);
  const [showCustomPerson, setShowCustomPerson] = useState<boolean>(false);
  const [showCustomAction, setShowCustomAction] = useState<boolean>(false);
  const [showCustomPlace, setShowCustomPlace] = useState<boolean>(false);
  const [customSentiment, setCustomSentiment] = useState<string>('');
  const [customPerson, setCustomPerson] = useState<string>('');
  const [customAction, setCustomAction] = useState<string>('');
  const [customPlace, setCustomPlace] = useState<string>('');

  const handleTagToggle = (tag: string, selectedTags: string[], setSelectedTags: (tags: string[]) => void) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 10) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const allSelectedTags = [...selectedSentiments, ...selectedPeople, ...selectedActions, ...selectedPlaces];
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
    setSelectedPlaces([]);
    setSelectedMood('');
    onClose();
  };

  const handleAddCustomTag = (
    customValue: string,
    selectedTags: string[],
    setSelectedTags: (tags: string[]) => void,
    setCustomValue: (value: string) => void,
    setShowCustom: (show: boolean) => void
  ) => {
    if (customValue.trim() && !selectedTags.includes(customValue.trim()) && selectedTags.length < 10) {
      setSelectedTags([...selectedTags, customValue.trim()]);
      setCustomValue('');
      setShowCustom(false);
    }
  };

  const handleNoDreams = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-xl font-semibold">DreamJournal</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-1">
          {/* Dream Description Header */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Describe Your Dream</h3>
              <span className="text-sm text-muted-foreground">{format(new Date(), 'M-dd-yyyy')}</span>
            </div>
            
            {/* Selected tags display */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                Selected ({allSelectedTags.length}/10) - Minimum 3 required
              </p>
              <div className="flex flex-wrap gap-2">
                {/* Show selected tags first */}
                {allSelectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {/* Show empty placeholders for remaining slots up to 3 minimum */}
                {Array.from({ length: Math.max(0, 3 - allSelectedTags.length) }).map((_, index) => (
                  <Badge 
                    key={`placeholder-${index}`} 
                    variant="outline" 
                    className="text-sm border-dashed border-muted-foreground/30 text-muted-foreground/50"
                  >
                    Tag {allSelectedTags.length + index + 1}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Places */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Places</h3>
              <button
                onClick={() => setShowCustomPlace(!showCustomPlace)}
                className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add New
              </button>
            </div>
            {showCustomPlace && (
              <div className="mb-3 flex gap-2">
                <Input
                  placeholder="Enter custom place"
                  value={customPlace}
                  onChange={(e) => setCustomPlace(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddCustomTag(customPlace, selectedPlaces, setSelectedPlaces, setCustomPlace, setShowCustomPlace);
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleAddCustomTag(customPlace, selectedPlaces, setSelectedPlaces, setCustomPlace, setShowCustomPlace)}
                  disabled={!customPlace.trim()}
                >
                  Add
                </Button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {(expandedPlaces ? PLACES : PLACES.slice(0, 4)).map((place) => (
                <button
                  key={place}
                  onClick={() => handleTagToggle(place, selectedPlaces, setSelectedPlaces)}
                  className={`px-2 py-1 rounded-lg border text-sm transition-colors ${
                    selectedPlaces.includes(place)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  {place}
                </button>
              ))}
              {PLACES.length > 4 && (
                <button
                  onClick={() => setExpandedPlaces(!expandedPlaces)}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-muted-foreground transition-colors"
                >
                  {expandedPlaces ? 'Less' : 'More'}
                </button>
              )}
            </div>
          </div>

          {/* Sentiments */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Sentiments</h3>
              <button
                onClick={() => setShowCustomSentiment(!showCustomSentiment)}
                className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add New
              </button>
            </div>
            {showCustomSentiment && (
              <div className="mb-3 flex gap-2">
                <Input
                  placeholder="Enter custom sentiment"
                  value={customSentiment}
                  onChange={(e) => setCustomSentiment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddCustomTag(customSentiment, selectedSentiments, setSelectedSentiments, setCustomSentiment, setShowCustomSentiment);
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleAddCustomTag(customSentiment, selectedSentiments, setSelectedSentiments, setCustomSentiment, setShowCustomSentiment)}
                  disabled={!customSentiment.trim()}
                >
                  Add
                </Button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {(expandedSentiments ? SENTIMENTS : SENTIMENTS.slice(0, 4)).map((sentiment) => (
                <button
                  key={sentiment}
                  onClick={() => handleTagToggle(sentiment, selectedSentiments, setSelectedSentiments)}
                  className={`px-2 py-1 rounded-lg border text-sm transition-colors ${
                    selectedSentiments.includes(sentiment)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  {sentiment}
                </button>
              ))}
              {SENTIMENTS.length > 4 && (
                <button
                  onClick={() => setExpandedSentiments(!expandedSentiments)}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-muted-foreground transition-colors"
                >
                  {expandedSentiments ? 'Less' : 'More'}
                </button>
              )}
            </div>
          </div>

          {/* People */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">People</h3>
              <button
                onClick={() => setShowCustomPerson(!showCustomPerson)}
                className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add New
              </button>
            </div>
            {showCustomPerson && (
              <div className="mb-3 flex gap-2">
                <Input
                  placeholder="Enter custom person"
                  value={customPerson}
                  onChange={(e) => setCustomPerson(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddCustomTag(customPerson, selectedPeople, setSelectedPeople, setCustomPerson, setShowCustomPerson);
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleAddCustomTag(customPerson, selectedPeople, setSelectedPeople, setCustomPerson, setShowCustomPerson)}
                  disabled={!customPerson.trim()}
                >
                  Add
                </Button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {(expandedPeople ? PEOPLE : PEOPLE.slice(0, 4)).map((person) => (
                <button
                  key={person}
                  onClick={() => handleTagToggle(person, selectedPeople, setSelectedPeople)}
                  className={`px-2 py-1 rounded-lg border text-sm transition-colors ${
                    selectedPeople.includes(person)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  {person}
                </button>
              ))}
              {PEOPLE.length > 4 && (
                <button
                  onClick={() => setExpandedPeople(!expandedPeople)}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-muted-foreground transition-colors"
                >
                  {expandedPeople ? 'Less' : 'More'}
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Actions</h3>
              <button
                onClick={() => setShowCustomAction(!showCustomAction)}
                className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add New
              </button>
            </div>
            {showCustomAction && (
              <div className="mb-3 flex gap-2">
                <Input
                  placeholder="Enter custom action"
                  value={customAction}
                  onChange={(e) => setCustomAction(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddCustomTag(customAction, selectedActions, setSelectedActions, setCustomAction, setShowCustomAction);
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleAddCustomTag(customAction, selectedActions, setSelectedActions, setCustomAction, setShowCustomAction)}
                  disabled={!customAction.trim()}
                >
                  Add
                </Button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {(expandedActions ? ACTIONS : ACTIONS.slice(0, 4)).map((action) => (
                <button
                  key={action}
                  onClick={() => handleTagToggle(action, selectedActions, setSelectedActions)}
                  className={`px-2 py-1 rounded-lg border text-sm transition-colors ${
                    selectedActions.includes(action)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  {action}
                </button>
              ))}
              {ACTIONS.length > 4 && (
                <button
                  onClick={() => setExpandedActions(!expandedActions)}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-muted-foreground transition-colors"
                >
                  {expandedActions ? 'Less' : 'More'}
                </button>
              )}
            </div>
          </div>

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
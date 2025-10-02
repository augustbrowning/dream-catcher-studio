import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import * as constants from "./dreamEntryConstants";
import styles from './dreamEntryPopup.module.scss';

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
  themeCategories: Record<string, string[]>;
  setThemeCategories: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

const DreamEntryPopup = ({ isOpen, onClose, onSave, themeCategories, setThemeCategories }: DreamEntryPopupProps) => {
  // Error states for custom tag inputs
  const [customSentimentError, setCustomSentimentError] = useState<string>('');
  const [customPersonError, setCustomPersonError] = useState<string>('');
  const [customActionError, setCustomActionError] = useState<string>('');
  const [customPlaceError, setCustomPlaceError] = useState<string>('');
  // Editable tag state
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
    setShowCustom: (show: boolean) => void,
    category: 'Sentiments' | 'People' | 'Actions' | 'Places',
    setError: (msg: string) => void
  ) => {
    const trimmed = customValue.trim();
    if (!trimmed || selectedTags.length >= 10) return;

    // Lowercase for duplicate check
    const lower = trimmed.toLowerCase();
    const selectedLower = selectedTags.map(t => t.toLowerCase());
    const mainLower = themeCategories[category].map(t => t.toLowerCase());

    // Check for duplicates in all lists (case-insensitive)
    if (selectedLower.includes(lower) || mainLower.includes(lower)) {
      setError(constants.ERROR_TAG_EXISTS);
      return;
    }

    // Add the tag and expand if needed
    setThemeCategories(prev => {
      const newList = [...prev[category], trimmed];
      // Expand if new length exceeds SHORT_LIST_TAG_COUNT
      if (newList.length > constants.SHORT_LIST_TAG_COUNT) {
        if (category === 'Sentiments') setExpandedSentiments(true);
        if (category === 'People') setExpandedPeople(true);
        if (category === 'Actions') setExpandedActions(true);
        if (category === 'Places') setExpandedPlaces(true);
      }
      return { ...prev, [category]: newList };
    });
    setSelectedTags([...selectedTags, trimmed]);
    setCustomValue('');
    setShowCustom(false);
    setError('');
  };

  const handleNoDreams = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={styles.dreamEntryPopup}>
        <DialogHeader className="sticky top-0 z-10 bg-background border-b pb-4 pt-6 px-6 pr-12 rounded-t-lg">
          <div className="flex items-center gap-4">
            <DialogTitle className="text-sm sm:text-lg font-medium">Describe Your Dream</DialogTitle>
            <span className="text-xs sm:text-sm text-muted-foreground">{format(new Date(), 'M-dd-yyyy')}</span>
          </div>
        </DialogHeader>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1, overflowY: 'auto' }} className="px-6">
            <div className="space-y-6 p-1">
              {/* Dream Description Header */}
              <div>
                {/* Selected tags display */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {constants.SELECTED_TAGS_LABEL(allSelectedTags.length)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {/* Show selected tags first */}
                    {allSelectedTags.map((tag) => (
                      <Badge key={tag} variant="default" className="text-sm font-normal">
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
                        {constants.TAG_PLACEHOLDER(allSelectedTags.length + index + 1)}
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
                    {constants.ADD_NEW_STRING}
                  </button>
                </div>
                {showCustomPlace && (
                  <div className="mb-3 flex flex-col gap-1">
                    <form
                      className={styles.customInputRow}
                      onSubmit={e => {
                        e.preventDefault();
                        handleAddCustomTag(customPlace, selectedPlaces, setSelectedPlaces, setCustomPlace, setShowCustomPlace, 'Places', setCustomPlaceError);
                      }}
                    >
                      <Input
                        placeholder="Enter custom place"
                        value={customPlace}
                        onChange={(e) => { setCustomPlace(e.target.value); setCustomPlaceError(''); }}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        type="submit"
                        disabled={!customPlace.trim()}
                      >
                        Add
                      </Button>
                    </form>
                    {customPlaceError && <span className={styles.customInputError}>{customPlaceError}</span>}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {(themeCategories.Places
                    .slice(0, expandedPlaces ? undefined : constants.SHORT_LIST_TAG_COUNT)
                  ).map((place) => (
                    <button
                      key={place}
                      onClick={() => handleTagToggle(place, selectedPlaces, setSelectedPlaces)}
                      className={
                        selectedPlaces.includes(place)
                          ? `${styles.tagButton} ${styles.selected}`
                          : styles.tagButton
                      }
                    >
                      {place}
                    </button>
                  ))}
                  {themeCategories.Places.length > constants.SHORT_LIST_TAG_COUNT && (
                    <button
                      onClick={() => setExpandedPlaces(!expandedPlaces)}
                      className={styles.moreLessButton}
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
                    {constants.ADD_NEW_STRING}
                  </button>
                </div>
                {showCustomSentiment && (
                  <div className="mb-3 flex flex-col gap-1">
                    <form
                      className={styles.customInputRow}
                      onSubmit={e => {
                        e.preventDefault();
                        handleAddCustomTag(customSentiment, selectedSentiments, setSelectedSentiments, setCustomSentiment, setShowCustomSentiment, 'Sentiments', setCustomSentimentError);
                      }}
                    >
                      <Input
                        placeholder="Enter custom sentiment"
                        value={customSentiment}
                        onChange={(e) => { setCustomSentiment(e.target.value); setCustomSentimentError(''); }}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        type="submit"
                        disabled={!customSentiment.trim()}
                      >
                        Add
                      </Button>
                    </form>
                    {customSentimentError && <span className={styles.customInputError}>{customSentimentError}</span>}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {(themeCategories.Sentiments
                    .slice(0, expandedSentiments ? undefined : constants.SHORT_LIST_TAG_COUNT)
                  ).map((sentiment) => (
                    <button
                      key={sentiment}
                      onClick={() => handleTagToggle(sentiment, selectedSentiments, setSelectedSentiments)}
                      className={
                        selectedSentiments.includes(sentiment)
                          ? `${styles.tagButton} ${styles.selected}`
                          : styles.tagButton
                      }
                    >
                      {sentiment}
                    </button>
                  ))}
                  {themeCategories.Sentiments.length > constants.SHORT_LIST_TAG_COUNT && (
                    <button
                      onClick={() => setExpandedSentiments(!expandedSentiments)}
                      className={styles.moreLessButton}
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
                    {constants.ADD_NEW_STRING}
                  </button>
                </div>
                {showCustomPerson && (
                  <div className="mb-3 flex flex-col gap-1">
                    <form
                      className={styles.customInputRow}
                      onSubmit={e => {
                        e.preventDefault();
                        handleAddCustomTag(customPerson, selectedPeople, setSelectedPeople, setCustomPerson, setShowCustomPerson, 'People', setCustomPersonError);
                      }}
                    >
                      <Input
                        placeholder="Enter custom person"
                        value={customPerson}
                        onChange={(e) => { setCustomPerson(e.target.value); setCustomPersonError(''); }}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        type="submit"
                        disabled={!customPerson.trim()}
                      >
                        Add
                      </Button>
                    </form>
                    {customPersonError && <span className={styles.customInputError}>{customPersonError}</span>}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {(themeCategories.People
                    .slice(0, expandedPeople ? undefined : constants.SHORT_LIST_TAG_COUNT)
                  ).map((person) => (
                    <button
                      key={person}
                      onClick={() => handleTagToggle(person, selectedPeople, setSelectedPeople)}
                      className={
                        selectedPeople.includes(person)
                          ? `${styles.tagButton} ${styles.selected}`
                          : styles.tagButton
                      }
                    >
                      {person}
                    </button>
                  ))}
                  {themeCategories.People.length > constants.SHORT_LIST_TAG_COUNT && (
                    <button
                      onClick={() => setExpandedPeople(!expandedPeople)}
                      className={styles.moreLessButton}
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
                    {constants.ADD_NEW_STRING}
                  </button>
                </div>
                {showCustomAction && (
                  <div className="mb-3 flex flex-col gap-1">
                    <form
                      className={styles.customInputRow}
                      onSubmit={e => {
                        e.preventDefault();
                        handleAddCustomTag(customAction, selectedActions, setSelectedActions, setCustomAction, setShowCustomAction, 'Actions', setCustomActionError);
                      }}
                    >
                      <Input
                        placeholder="Enter custom action"
                        value={customAction}
                        onChange={(e) => { setCustomAction(e.target.value); setCustomActionError(''); }}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        type="submit"
                        disabled={!customAction.trim()}
                      >
                        Add
                      </Button>
                    </form>
                    {customActionError && <span className={styles.customInputError}>{customActionError}</span>}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {(themeCategories.Actions
                    .slice(0, expandedActions ? undefined : constants.SHORT_LIST_TAG_COUNT)
                  ).map((action) => (
                    <button
                      key={action}
                      onClick={() => handleTagToggle(action, selectedActions, setSelectedActions)}
                      className={
                        selectedActions.includes(action)
                          ? `${styles.tagButton} ${styles.selected}`
                          : styles.tagButton
                      }
                    >
                      {action}
                    </button>
                  ))}
                  {themeCategories.Actions.length > constants.SHORT_LIST_TAG_COUNT && (
                    <button
                      onClick={() => setExpandedActions(!expandedActions)}
                      className={styles.moreLessButton}
                    >
                      {expandedActions ? 'Less' : 'More'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Mood Selection - now always at the bottom of the dialog */}
          <div className="bg-background border-t pt-4 px-6 pb-4" style={{ width: '100%' }}>
            <div className="flex justify-center gap-4 mb-4">
              {constants.MOOD_OPTIONS.map((mood) => (
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
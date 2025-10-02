// dreamEntryStrings.ts
// Centralized strings for DreamEntryPopup UI

export const SLEEP_QUALITY = [
  { id: 'poor', label: 'Poor', color: 'bg-red-100 border-red-300 text-red-800' },
  { id: 'fair', label: 'Fair', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  { id: 'good', label: 'Good', color: 'bg-green-100 border-green-300 text-green-800' }
];

export const MOOD_OPTIONS = [
  { emoji: '😢', value: 'sad' },
  { emoji: '😔', value: 'disappointed' },
  { emoji: '😐', value: 'neutral' },
  { emoji: '🙂', value: 'content' },
  { emoji: '😊', value: 'joyful' }
];

export const SHORT_LIST_TAG_COUNT = 10;
export const ADD_NEW_STRING = 'Add New';
export const ERROR_TAG_EXISTS = 'That tag already exists.';
export const SELECTED_TAGS_LABEL = (count: number) => `Selected (${count}/10) - Minimum 3 required`;
export const TAG_PLACEHOLDER = (n: number) => `Tag ${n}`;

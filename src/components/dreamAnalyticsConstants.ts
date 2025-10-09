// dreamAnalyticsConstants.ts
// Centralized constants for DreamAnalytics UI

export const MOOD_EMOJIS = {
  joyful: "😊",
  content: "🙂",
  neutral: "😐",
  disappointed: "😔",
  sad: "😢"
};

export const MOOD_COLORS = {
  joyful: "bg-yellow-400",
  peaceful: "bg-blue-400", 
  exciting: "bg-orange-400",
  mysterious: "bg-purple-400",
  scary: "bg-red-400",
  sad: "bg-blue-600",
  confused: "bg-gray-400",
  neutral: "bg-gray-300"
};

// Mock behavioral correlation data
export const BEHAVIORAL_CORRELATIONS = {
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

export const ALL_TIME = "All Time";
export const CAPTURE_A_FEW_DREAMS = "Capture at least a few dreams to see insights and patterns in your dream journal.";
export const DREAM_VIBES = "Dream Vibes";
export const LAST_MONTH = "Last Month";
export const LAST_WEEK = "Last Week";
export const NO_ANALYTICS_YET = "No Analytics Yet";
export const RECURRING_THEMES = "Recurring Themes";

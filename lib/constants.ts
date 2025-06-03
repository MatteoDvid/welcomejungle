export const interests = [
  { id: "tech", label: "Tech", emoji: "💻" },
  { id: "design", label: "Design", emoji: "🎨" },
  { id: "coffee", label: "Coffee", emoji: "☕" },
  { id: "fitness", label: "Fitness", emoji: "💪" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
  { id: "books", label: "Books", emoji: "📚" },
  { id: "food", label: "Food", emoji: "🍕" },
  { id: "travel", label: "Travel", emoji: "✈️" },
  { id: "photography", label: "Photography", emoji: "📸" },
  { id: "art", label: "Art", emoji: "🎭" },
  { id: "movies", label: "Movies", emoji: "🎬" },
];

export const activities = [
  { id: "coffee", label: "Coffee", emoji: "☕" },
  { id: "lunch", label: "Lunch", emoji: "🍽️" },
  { id: "brainstorming", label: "Brainstorming", emoji: "💡" },
  { id: "walking", label: "Walking", emoji: "🚶" },
  { id: "workshop", label: "Workshop", emoji: "🛠️" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
  { id: "workout", label: "Workout", emoji: "🏋️" },
  { id: "reading", label: "Reading", emoji: "📖" },
];

export const days = [
  { id: "monday", label: "Monday", emoji: "📅", short: "Mon" },
  { id: "tuesday", label: "Tuesday", emoji: "📅", short: "Tue" },
  { id: "wednesday", label: "Wednesday", emoji: "📅", short: "Wed" },
  { id: "thursday", label: "Thursday", emoji: "📅", short: "Thu" },
  { id: "friday", label: "Friday", emoji: "📅", short: "Fri" },
];

export interface SelectableItem {
  id: string;
  label: string;
  emoji: string;
  short?: string; // Optional for days
} 
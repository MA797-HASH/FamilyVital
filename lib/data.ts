export type Trend = "up" | "down" | "flat"

export type FamilyMember = {
  id: string
  name: string
  role: string
  age: number
  avatarColor: string
  initials: string
  focus: string
  metrics: {
    steps: { value: number; goal: number }
    sleep: { value: number; goal: number } // hours
    water: { value: number; goal: number } // glasses
    activeMinutes: { value: number; goal: number }
  }
  vitals: {
    restingHr: number
    weeklyMood: number // 1-5
  }
}

export const family: FamilyMember[] = [
  {
    id: "maya",
    name: "Maya Rivera",
    role: "Parent",
    age: 38,
    avatarColor: "oklch(0.55 0.11 160)",
    initials: "MR",
    focus: "Lower stress & stay active",
    metrics: {
      steps: { value: 8420, goal: 10000 },
      sleep: { value: 6.8, goal: 8 },
      water: { value: 6, goal: 8 },
      activeMinutes: { value: 42, goal: 45 },
    },
    vitals: { restingHr: 64, weeklyMood: 4 },
  },
  {
    id: "diego",
    name: "Diego Rivera",
    role: "Parent",
    age: 41,
    avatarColor: "oklch(0.6 0.1 220)",
    initials: "DR",
    focus: "Heart health & weight",
    metrics: {
      steps: { value: 11200, goal: 10000 },
      sleep: { value: 7.5, goal: 8 },
      water: { value: 5, goal: 8 },
      activeMinutes: { value: 55, goal: 45 },
    },
    vitals: { restingHr: 58, weeklyMood: 4 },
  },
  {
    id: "sofia",
    name: "Sofia Rivera",
    role: "Child",
    age: 14,
    avatarColor: "oklch(0.7 0.13 80)",
    initials: "SR",
    focus: "Build healthy screen habits",
    metrics: {
      steps: { value: 9300, goal: 9000 },
      sleep: { value: 8.2, goal: 9 },
      water: { value: 4, goal: 6 },
      activeMinutes: { value: 60, goal: 60 },
    },
    vitals: { restingHr: 72, weeklyMood: 5 },
  },
  {
    id: "leo",
    name: "Leo Rivera",
    role: "Child",
    age: 9,
    avatarColor: "oklch(0.65 0.15 30)",
    initials: "LR",
    focus: "More outdoor play",
    metrics: {
      steps: { value: 12400, goal: 11000 },
      sleep: { value: 9.5, goal: 10 },
      water: { value: 5, goal: 6 },
      activeMinutes: { value: 80, goal: 60 },
    },
    vitals: { restingHr: 80, weeklyMood: 5 },
  },
]

export type Reminder = {
  id: string
  title: string
  memberId: string
  time: string
  category: "Medication" | "Hydration" | "Activity" | "Checkup" | "Sleep" | "Nutrition"
  done: boolean
  repeat: string
}

export const reminders: Reminder[] = [
  { id: "r1", title: "Morning vitamins", memberId: "maya", time: "8:00 AM", category: "Medication", done: true, repeat: "Daily" },
  { id: "r2", title: "Drink a glass of water", memberId: "diego", time: "10:30 AM", category: "Hydration", done: false, repeat: "Every 2h" },
  { id: "r3", title: "Family evening walk", memberId: "leo", time: "6:00 PM", category: "Activity", done: false, repeat: "Daily" },
  { id: "r4", title: "Pediatric checkup", memberId: "sofia", time: "Thu 2:00 PM", category: "Checkup", done: false, repeat: "Once" },
  { id: "r5", title: "Lights out", memberId: "leo", time: "8:30 PM", category: "Sleep", done: false, repeat: "Daily" },
  { id: "r6", title: "Pack a fruit for lunch", memberId: "sofia", time: "7:15 AM", category: "Nutrition", done: true, repeat: "Weekdays" },
]

export type Goal = {
  id: string
  title: string
  memberId: string
  progress: number // 0-100
  target: string
  streak: number
}

export const goals: Goal[] = [
  { id: "g1", title: "Walk 10k steps", memberId: "maya", progress: 84, target: "10,000 steps/day", streak: 5 },
  { id: "g2", title: "Sleep 8 hours", memberId: "maya", progress: 60, target: "8h nightly", streak: 2 },
  { id: "g3", title: "Cardio 4x / week", memberId: "diego", progress: 75, target: "4 sessions", streak: 9 },
  { id: "g4", title: "Limit screen time", memberId: "sofia", progress: 50, target: "Under 2h/day", streak: 3 },
  { id: "g5", title: "Outdoor play daily", memberId: "leo", progress: 100, target: "60 min/day", streak: 12 },
]

export const weeklyActivity = [
  { day: "Mon", steps: 38000 },
  { day: "Tue", steps: 42500 },
  { day: "Wed", steps: 36000 },
  { day: "Thu", steps: 45200 },
  { day: "Fri", steps: 41320 },
  { day: "Sat", steps: 52800 },
  { day: "Sun", steps: 48100 },
]

export function memberById(id: string) {
  return family.find((m) => m.id === id)
}

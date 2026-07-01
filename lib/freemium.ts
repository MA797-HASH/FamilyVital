export type Plan = "free" | "premium"

const PLAN_STORAGE_KEY = "familyvital-plan"
const COACH_USAGE_STORAGE_KEY = "familyvital-coach-usage"
const FREE_MEMBER_LIMIT = 1
const FREE_COACH_LIMIT = 5

export function getStoredPlan(): Plan {
  if (typeof window === "undefined") return "free"

  const stored = window.localStorage.getItem(PLAN_STORAGE_KEY)
  return stored === "premium" ? "premium" : "free"
}

export function setStoredPlan(plan: Plan) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(PLAN_STORAGE_KEY, plan)
}

export function isPremiumPlan(plan: Plan | null | undefined) {
  return plan === "premium"
}

export function getCoachUsage() {
  if (typeof window === "undefined") return { monthKey: getMonthKey(), count: 0 }

  const stored = window.localStorage.getItem(COACH_USAGE_STORAGE_KEY)
  if (!stored) return { monthKey: getMonthKey(), count: 0 }

  try {
    const parsed = JSON.parse(stored) as { monthKey?: string; count?: number }
    const monthKey = parsed.monthKey || getMonthKey()
    if (monthKey !== getMonthKey()) {
      window.localStorage.setItem(COACH_USAGE_STORAGE_KEY, JSON.stringify({ monthKey: getMonthKey(), count: 0 }))
      return { monthKey: getMonthKey(), count: 0 }
    }

    return { monthKey, count: typeof parsed.count === "number" ? parsed.count : 0 }
  } catch {
    return { monthKey: getMonthKey(), count: 0 }
  }
}

export function recordCoachMessage() {
  if (typeof window === "undefined") return { monthKey: getMonthKey(), count: 0 }

  const current = getCoachUsage()
  const next = { monthKey: current.monthKey, count: current.count + 1 }
  window.localStorage.setItem(COACH_USAGE_STORAGE_KEY, JSON.stringify(next))
  return next
}

export function canAddMember(plan: Plan | null | undefined, memberCount: number) {
  if (isPremiumPlan(plan)) return true
  return memberCount < FREE_MEMBER_LIMIT
}

export function canUseCoach(plan: Plan | null | undefined, count: number) {
  if (isPremiumPlan(plan)) return true
  return count < FREE_COACH_LIMIT
}

export function getFreeMemberLimit() {
  return FREE_MEMBER_LIMIT
}

export function getFreeCoachLimit() {
  return FREE_COACH_LIMIT
}

function getMonthKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

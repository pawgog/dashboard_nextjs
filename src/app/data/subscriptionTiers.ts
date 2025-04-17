import { env } from "./env/server"

export const subscriptionTiers = {
  Basic: {
    name: "Basic",
    price: 0,
    maxNumberOfProducts: 1,
    maxNumberOfVisits: 1000,
    canAccessAnalytics: false,
    canCustomizeBanner: false,
    canRemoveBranding: false,
    stripePriceId: undefined
  },
  Standard: {
    name: "Standard",
    price: 4999,
    maxNumberOfProducts: 5,
    maxNumberOfVisits: 10000,
    canAccessAnalytics: true,
    canCustomizeBanner: false,
    canRemoveBranding: true,
    stripePriceId: env.STRIPE_STANDARD_PLAN_PRICE_ID
  },
  Premium: {
    name: "Premium",
    price: 19999,
    maxNumberOfProducts: 30,
    maxNumberOfVisits: 100000,
    canAccessAnalytics: true,
    canCustomizeBanner: true,
    canRemoveBranding: true,
    stripePriceId: env.STRIPE_PREMIUM_PLAN_PRICE_ID
  }
} as const

export const subscriptionTiersInOrder = [
  subscriptionTiers.Basic,
  subscriptionTiers.Standard,
  subscriptionTiers.Premium
] as const

export type TierNames = keyof typeof subscriptionTiers
export type PaidTierNames = Exclude<TierNames, "Free">

export function getTierByPriceId(stripePriceId: string) {
  return Object.values(subscriptionTiers).find(
    tier => tier.stripePriceId === stripePriceId
  )
}

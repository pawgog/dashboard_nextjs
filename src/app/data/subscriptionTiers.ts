export const subscriptionTiers = {
  Basic: {
    name: "Basic",
    price: 0,
    maxNumberOfProducts: 1,
    maxNumberOfVisits: 1000,
    canAccessAnalytics: false,
    canCustomizeBanner: false,
    canRemoveBranding: false
  },
  Standard: {
    name: "Standrad",
    price: 4999,
    maxNumberOfProducts: 5,
    maxNumberOfVisits: 10000,
    canAccessAnalytics: true,
    canCustomizeBanner: false,
    canRemoveBranding: true
  },
  Premium: {
    name: "Premium",
    price: 19999,
    maxNumberOfProducts: 30,
    maxNumberOfVisits: 100000,
    canAccessAnalytics: true,
    canCustomizeBanner: true,
    canRemoveBranding: true
  }
} as const

export const subscriptionTiersInOrder = [
  subscriptionTiers.Basic,
  subscriptionTiers.Standard,
  subscriptionTiers.Premium
] as const

export type TierNames = keyof typeof subscriptionTiers
"use server"

import { currentUser, User } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Stripe } from "stripe"

import { PaidTierNames, subscriptionTiers } from "@/app/data/subscriptionTiers"
import { getUserSubscription } from "../db/subscription"
import { env as serverEnv } from "@/app/data/env/server"
import { env as clientEnv } from "@/app/data/env/client"

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY)

export async function createCheckoutSession(tier: PaidTierNames) {
  const user = await currentUser()
  if (user == null) return { error: true }

  const subscription = await getUserSubscription(user.id)

  if (subscription == null) return { error: true }

  if (subscription.stripeCustomerId == null) {
    const url = await getCheckoutSession(tier, user)
    if (url == null) return { error: true }
    redirect(url)
  }
}

async function getCheckoutSession(tier: PaidTierNames, user: User) {
  const session = await stripe.checkout.sessions.create({
    customer_email: user.primaryEmailAddress?.emailAddress,
    subscription_data: {
      metadata: {
        clerkUserId: user.id,
      },
    },
    line_items: [
      {
        price: subscriptionTiers[tier].stripePriceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    cancel_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
  })

  return session.url
}

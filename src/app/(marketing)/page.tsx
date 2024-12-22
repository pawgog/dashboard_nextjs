import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRightIcon } from "lucide-react";
import { GitLabIcon } from "./_icons/GitLabIcon";
import { AtlassianIcon } from "./_icons/AtlassianIcon";
import { VercelIcon } from "./_icons/VercelIcon";
import { subscriptionTiersInOrder } from "../data/subscriptionTiers";

export default function Home() {
  return (
    <>
      <section className="min-h-screen bg-[radial-gradient(hsl(0,72%, 65%, 40%),hsl(24,62%,73%,40%),hsl(var(--background))_60%)] flex items-center justify-center text-center text-balance flex-col gap-8 px-4">
        <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight m-4">
          Lorem ipsum dolor sit amet
        </h1>
        <p className="text-lg lg:text-2xl max-w-screen-xl">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit earum fugiat
          eligendi quidem nobis aut. At aperiam rerum ipsum mollitia
          repellendus.
        </p>
        <SignUpButton>
          <Button className="text-lg p-6 rounded-xl flex gap-2">
            Let`s start for free <ArrowRightIcon className="size-5" />
          </Button>
        </SignUpButton>
      </section>
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 flex flex-col gap-16 px-8 md:px-16">
          <h2 className="text-3xl text-center text-balance">
            Trusted by these top world companies:
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-16">
            <Link href="https://about.gitlab.com/">
              <GitLabIcon />
            </Link>
            <Link href="https://www.atlassian.com/">
              <AtlassianIcon />
            </Link>
            <Link href="https://vercel.com/">
              <VercelIcon />
            </Link>
            <Link href="https://about.gitlab.com/">
              <GitLabIcon />
            </Link>
            <Link href="https://www.atlassian.com/">
              <AtlassianIcon />
            </Link>
            <Link href="https://vercel.com/">
              <VercelIcon />
            </Link>
            <Link href="https://about.gitlab.com/">
              <GitLabIcon />
            </Link>
            <Link href="https://www.atlassian.com/">
              <AtlassianIcon />
            </Link>
            <Link href="https://vercel.com/">
              <VercelIcon />
            </Link>
          </div>
        </div>
      </section>
      <section id="pricing" className="px-8 py-16 bg-accent/5">
        <h2 className="text-4xl text-center text-balance font-semibold mb-8">
          Pricing for membership levels
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-screen-xl mx-auto">
          {subscriptionTiersInOrder.map((tier) => (
            <PriceCard key={tier.name} {...tier} />
          ))}
        </div>
      </section>
    </>
  );
}

function PriceCard({
  name,
  price,
  maxNumberOfVisits,
}: (typeof subscriptionTiersInOrder)[number]) {
  return (
    <Card>
      <CardHeader>
        <div className="text-accent font-semibold mb-8">{name}</div>
        <CardTitle className="text-xl font-bold">${price / 100}</CardTitle>
        <CardDescription>{maxNumberOfVisits} pricing visit/mo</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpButton>
          <Button>Get started</Button>
        </SignUpButton>
      </CardContent>
    </Card>
  );
}

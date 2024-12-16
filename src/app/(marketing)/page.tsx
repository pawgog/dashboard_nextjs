import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRightIcon } from "lucide-react";

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
    </>
  );
}

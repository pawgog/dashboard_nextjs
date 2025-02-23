"use client";

import { useState } from "react";
import { env } from "@/app/data/env/client";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CopyState = "idle" | "copied" | "error";

export function AddToSiteProductModalContent({ id }: { id: string }) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const code = `<script src="${env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}/banner"></script>`;

  return (
    <DialogContent className="max-w-max">
      <DialogHeader>
        <DialogTitle className="text-2xl">
          Start with Marketing App!
        </DialogTitle>
        <DialogDescription>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi,
          ut! Similique accusantium excepturi eum quia distinctio, nobis fuga
          perspiciatis dolore sequi praesentium. Nostrum deleniti alias dolorem
          cumque quod quam ab!
        </DialogDescription>
      </DialogHeader>
      <pre className="mb-4 overflow-x-auto p-4 bg-secondary rounded max-w-screen-xl text-secondary-foreground">
        <code>{code}</code>
      </pre>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            navigator.clipboard
              .writeText(code)
              .then(() => {
                setCopyState("copied");
                setTimeout(() => setCopyState("idle"), 2000);
              })
              .catch(() => {
                setCopyState("error");
                setTimeout(() => setCopyState("idle"), 2000);
              });
          }}
        >
          {getChildren(copyState)}
        </Button>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
}

function getChildren(copyState: CopyState) {
  switch (copyState) {
    case "idle":
      return "Copy Code";
    case "copied":
      return "Copied!";
    case "error":
      return "Error";
  }
}

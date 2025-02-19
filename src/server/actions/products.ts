"use server"

import { z } from "zod";
import { redirect } from "next/navigation";
import { productDetailsSchema } from "@/schemas/products";
import { auth } from "@clerk/nextjs/server";
import { createProduct as createProductDB } from "../db/products";

export async function createProduct(
  unsafeData: z.infer<typeof productDetailsSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth()
  const { success, data } = productDetailsSchema.safeParse(unsafeData)

  if (!success || userId == null) {
    return { error: true, message: "There was an error creating your product" }
  }

  const { id } = await createProductDB({ ...data, clerkUserId: userId })

  redirect(`/dashboard/products/${id}/edit?tab=countries`)
}
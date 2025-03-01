"use server"

import { z } from "zod";
import { redirect } from "next/navigation";
import { productDetailsSchema } from "@/schemas/products";
import { auth } from "@clerk/nextjs/server";
import { createProduct as createProductDB, deleteProduct as deleteProductDB } from "../db/products";

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

export async function deleteProduct(id: string) {
  const { userId } = await auth()
  const errorMessage = "There was an error deleting your product"

  if (userId == null) {
    return { error: true, message: errorMessage }
  }

  const isSuccess = await deleteProductDB({ id, userId })

  return {
    error: !isSuccess,
    message: isSuccess ? "Successfully deleted your product" : errorMessage,
  }
}

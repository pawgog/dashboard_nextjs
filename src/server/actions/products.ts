"use server"

import { z } from "zod";
import { redirect } from "next/navigation";
import { productCountryDiscountsSchema, productCustomizationSchema, productDetailsSchema } from "@/schemas/products";
import { auth } from "@clerk/nextjs/server";
import { 
  createProduct as createProductDB, 
  updateProduct as updateProductDB, 
  deleteProduct as deleteProductDB ,
  updateProductCustomization as updateProductCustomizationDB,
  updateCountryDiscounts as updateCountryDiscountsDB
} from "../db/products";
import { canCustomizeBanner } from "../permissions";

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

export async function updateProduct(
  id: string,
  unsafeData: z.infer<typeof productDetailsSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth()
  const { success, data } = productDetailsSchema.safeParse(unsafeData)
  const errorMessage = "There was an error updating your product";

  if (!success || userId == null) {
    return { error: true, message: errorMessage }
  }

  const isSuccess = await updateProductDB(data, { id, userId })

  return { error: !isSuccess, message: isSuccess ? "Product details updated!" : errorMessage}
}

export async function updateProductCustomization(
  id: string,
  unsafeData: z.infer<typeof productCustomizationSchema>
) {
  const { userId } = await auth()
  const { success, data } = productCustomizationSchema.safeParse(unsafeData)
  const canCustomize = await canCustomizeBanner(userId)

  if (!success || userId == null || !canCustomize) {
    return {
      error: true,
      message: "There was an error updating your banner",
    }
  }

  await updateProductCustomizationDB(data, { productId: id, userId })

  return { error: false, message: "Banner updated" }
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

export async function updateCountryDiscounts(
  id: string,
  unsafeData: z.infer<typeof productCountryDiscountsSchema>
) {
  const { userId } = await auth()
  const { success, data } = productCountryDiscountsSchema.safeParse(unsafeData)

  if (!success || userId == null) {
    return {
      error: true,
      message: "There was an error saving your country discounts",
    }
  }

  const insert: {
    countryGroupId: string
    productId: string
    coupon: string
    discountPercentage: number
  }[] = []
  const deleteIds: { countryGroupId: string }[] = []

  data.groups.forEach(group => {
    if (
      group.coupon != null &&
      group.coupon.length > 0 &&
      group.discountPercentage != null &&
      group.discountPercentage > 0
    ) {
      insert.push({
        countryGroupId: group.countryGroupId,
        coupon: group.coupon,
        discountPercentage: group.discountPercentage / 100,
        productId: id,
      })
    } else {
      deleteIds.push({ countryGroupId: group.countryGroupId })
    }
  })

  await updateCountryDiscountsDB(deleteIds, insert, { productId: id, userId })

  return { error: false, message: "Country discounts saved" }
}
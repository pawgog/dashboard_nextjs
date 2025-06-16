import { createElement } from "react"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { NextRequest } from "next/server"
import { geolocation } from '@vercel/functions'

import { getProductForBanner } from "@/server/db/products"
import { createProductView } from "@/server/db/productViews"
import { canRemoveBranding, canShowDiscountBanner } from "@/server/permissions"
import { Banner } from "@/components/Banner"

export const runtime = "edge"

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const { productId } = await params;
  const headersMap = await headers()
  const requestingUrl = headersMap.get("referer") || headersMap.get("origin")

  if (requestingUrl == null) return notFound()
  const { country: countryCode } = geolocation(request)
  if (countryCode == null) return notFound()

  const { product, discount, country } = await getProductForBanner({
    id: productId,
    countryCode,
    requestingUrl
  })

  if (product == null) return notFound()

  const canShowBanner = await canShowDiscountBanner(product.clerkUserId)

  await createProductView({
    productId: product.id,
    countryId: country?.id,
    userId: product.clerkUserId,
  })

  if (!canShowBanner) return notFound()
  if (country == null || discount == null) return notFound()

  return new Response(
    await getJavaScript(
      product,
      country,
      discount,
      await canRemoveBranding(product.clerkUserId)
    ),
    { headers: { "content-type": "text/javascript" } }
  )
}

async function getJavaScript(
  product: {
    customization: {
      locationMessage: string
      bannerContainer: string
      backgroundColor: string
      textColor: string
      fontSize: string
      isSticky: boolean
      classPrefix?: string | null
    }
  },
  country: { name: string },
  discount: { coupon: string; percentage: number },
  canRemoveBranding: boolean
) {
  const { renderToStaticMarkup } = await import("react-dom/server")
  return `
    const banner = document.createElement("div");
    banner.innerHTML = '${renderToStaticMarkup(
      createElement(Banner, {
        message: product.customization.locationMessage,
        mappings: {
          country: country.name,
          coupon: discount.coupon,
          discount: (discount.percentage * 100).toString(),
        },
        customization: product.customization,
        canRemoveBranding,
      })
    )}';
    document.querySelector("${
      product.customization.bannerContainer
    }").prepend(...banner.children);
  `.replace(/(\r\n|\n|\r)/g, "")
}

import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ChevronDownIcon } from "lucide-react";
import { HasPermission } from "@/components/HasPermission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CHART_INTERVALS,
  getViewsByCountryChartData,
  getViewsByDayChartData,
  getViewsByMarketingChartData,
} from "@/server/db/productViews";
import { getProducts } from "@/server/db/products";
import { canAccessAnalytics } from "@/server/permissions";
import { ViewsByCountryChart } from "../_components/charts/ViewsByCountryChart";
import { ViewsByMarketingChart } from "../_components/charts/ViewsByMarketingChart";
import { ViewsByDayChart } from "../_components/charts/ViewsByDayChart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { createURL } from "@/lib/utils";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: {
    interval?: string;
    timezone?: string;
    productId?: string;
  };
}) {
  const { userId, redirectToSignIn } = await auth();
  if (userId == null) return redirectToSignIn();

  const searchParamsObject = await searchParams;

  const interval =
    CHART_INTERVALS[
      searchParamsObject.interval as keyof typeof CHART_INTERVALS
    ] ?? CHART_INTERVALS.last7Days;
  const timezone = searchParamsObject.timezone || "UTC";
  const productId = searchParamsObject.productId;

  return (
    <>
      <div className="mb-6 flex justify-between items-baseline">
        <h1 className="text-3xl font-semibold">Analytics</h1>
        <HasPermission permission={canAccessAnalytics}>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {interval.label}
                  <ChevronDownIcon className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(CHART_INTERVALS).map(([key, value]) => (
                  <DropdownMenuItem asChild key={key}>
                    <Link
                      href={createURL(
                        "/dashboard/analytics",
                        searchParamsObject,
                        {
                          interval: key,
                        }
                      )}
                    >
                      {value.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <ProductDropdown
              userId={userId}
              selectedProductId={productId}
              searchParams={searchParams}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {timezone}
                  <ChevronDownIcon className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>
        </HasPermission>
      </div>
      <HasPermission permission={canAccessAnalytics} renderFallback>
        <div className="flex flex-col gap-8">
          <ViewsByDayCard
            interval={interval}
            timezone={timezone}
            userId={userId}
            productId={productId}
          />
          <ViewsByCountryCard
            interval={interval}
            timezone={timezone}
            userId={userId}
            productId={productId}
          />
          <ViewsByMarketingCard
            interval={interval}
            timezone={timezone}
            userId={userId}
            productId={productId}
          />
        </div>
      </HasPermission>
    </>
  );
}

async function ProductDropdown({
  userId,
  selectedProductId,
  searchParams,
}: {
  userId: string;
  selectedProductId?: string;
  searchParams: Record<string, string>;
}) {
  const products = await getProducts(userId);
  const searchParamsObject = await searchParams;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {products.find((p) => p.id === selectedProductId)?.name ??
            "All Products"}
          <ChevronDownIcon className="size-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link
            href={createURL("/dashboard/analytics", searchParamsObject, {
              productId: undefined,
            })}
          >
            All Products
          </Link>
        </DropdownMenuItem>
        {products.map((product) => (
          <DropdownMenuItem asChild key={product.id}>
            <Link
              href={createURL("/dashboard/analytics", searchParamsObject, {
                productId: product.id,
              })}
            >
              {product.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function ViewsByDayCard(
  props: Parameters<typeof getViewsByDayChartData>[0]
) {
  const chartData = await getViewsByDayChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByDayChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

async function ViewsByCountryCard(
  props: Parameters<typeof getViewsByCountryChartData>[0]
) {
  const chartData = await getViewsByCountryChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Country</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByCountryChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

async function ViewsByMarketingCard(
  props: Parameters<typeof getViewsByMarketingChartData>[0]
) {
  const chartData = await getViewsByMarketingChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Marketing Group</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByMarketingChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

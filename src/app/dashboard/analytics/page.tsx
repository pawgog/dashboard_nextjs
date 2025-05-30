import { HasPermission } from "@/components/HasPermission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CHART_INTERVALS,
  getViewsByCountryChartData,
  getViewsByMarketingChartData,
} from "@/server/db/productViews";
import { canAccessAnalytics } from "@/server/permissions";
import { auth } from "@clerk/nextjs/server";
import { ViewsByCountryChart } from "../_components/charts/ViewsByCountryChart";
import { ViewsByMarketingChart } from "../_components/charts/ViewsByMarketingChart";

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
      <HasPermission permission={canAccessAnalytics} renderFallback>
        <div className="flex flex-col gap-8">
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

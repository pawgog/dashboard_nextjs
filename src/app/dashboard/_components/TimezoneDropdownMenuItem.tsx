import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createURL } from "@/lib/utils";
import Link from "next/link";

export async function TimezoneDropdownMenuItem({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const searchParamsObject = await searchParams;

  return (
    <DropdownMenuItem asChild>
      <Link
        href={createURL("/dashboard/analytics", searchParamsObject, {
          timezone: userTimezone,
        })}
      >
        {userTimezone}
      </Link>
    </DropdownMenuItem>
  );
}

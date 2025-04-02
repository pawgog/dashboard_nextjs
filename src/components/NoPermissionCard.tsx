import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function NoPermissionCard({
  children = "You have no permission to introduce this action. Please try to upgrade your account to have access to this feature.",
}: {
  children?: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Permission Denied</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{children}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href="/dashboard/subscription">Upgrade Account</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

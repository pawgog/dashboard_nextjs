import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { UserButton } from "@clerk/nextjs";

export default function NavBar() {
  return (
    <header className="flex py-4 shadow fixed top-0 w-full z-10 bg-background/95">
      <nav className="flex items-center gap-10 container font-semibold">
        <Link className="mr-auto" href="/dashboard">
          <BrandLogo />
        </Link>
        <Link href="/dashboard/products">Products</Link>
        <Link href="/dashboard/analytics">Analytics</Link>
        <Link href="/dashboard/subscription">Subscription</Link>
        <UserButton />
      </nav>
    </header>
  );
}

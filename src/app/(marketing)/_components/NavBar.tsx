import BrandLogo from "@/components/BrandLogo";
import Link from "next/link";

export default function NavBar() {
  return (
    <header className="flex py-6 shadow-xl fixed top-0 w-full z-10 bg-background/95">
      <nav className="flex items-center gap-10 container font-semibold">
        <Link href="/" className="mr-auto">
          <BrandLogo />
        </Link>
      </nav>
    </header>
  );
}

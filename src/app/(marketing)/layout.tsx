import { ReactNode } from "react";
import NavBar from "./_components/NavBar";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="selection:bg-[hsla(157,65%,52%,0)]">
      <NavBar />
      {children}
    </div>
  );
}

import { BadgeDollarSignIcon } from "lucide-react";

export default function BrandLogo() {
  return (
    <span className="flex items-center gap-2 font-semibold flex-shrink-0 mr-auto text-lg">
      <BadgeDollarSignIcon className="size-8" />
      <span>Marketing App</span>
    </span>
  );
}

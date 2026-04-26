import { Cog } from "lucide-react";
import logoMark from "@/assets/logo.jpeg";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  /** Compact = footer/inline, default = full header */
  size?: "sm" | "md" | "lg";
  /** Hide the small "— РЕМОНТ КОФЕМАШИН —" tagline */
  hideTagline?: boolean;
  className?: string;
};

/**
 * Brand lockup: large coffee-cup-with-wrench logo + uppercase "КОФЕ МЕХАНИКУС"
 * (with a gear glyph replacing the first "О") + small "— РЕМОНТ КОФЕМАШИН —"
 * tagline. Uses the existing display font so it stays consistent with the rest
 * of the site.
 */
export const BrandMark = ({ size = "md", hideTagline = false, className }: BrandMarkProps) => {
  const logoSize = {
    sm: "h-10 w-10",
    md: "h-14 w-14 sm:h-16 sm:w-16",
    lg: "h-20 w-20 sm:h-24 sm:w-24",
  }[size];

  const titleSize = {
    sm: "text-sm leading-[0.95]",
    md: "text-base sm:text-lg leading-[0.95]",
    lg: "text-xl sm:text-2xl leading-[0.95]",
  }[size];

  // Gear "O" should visually match the cap-height of "К" and "Ф".
  // Settings icon has thicker teeth that read like the reference cog.
  const gearSize = "h-[1em] w-[1em]";

  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      <img
        src={logoMark}
        alt="Кофе Механикус — ремонт кофемашин"
        className={cn("shrink-0 object-contain", logoSize)}
      />
      <div className="flex flex-col">
        <div
          className={cn(
            "font-display font-bold tracking-[-0.02em] uppercase text-coffee-dark",
            titleSize,
          )}
        >
          <div className="flex items-baseline">
            <span>К</span>
            <Cog
              className={cn(gearSize, "text-coffee-dark inline-block self-center -mx-[0.02em]")}
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>ФЕ</span>
          </div>
          <div className="text-coffee-medium">МЕХАНИКУС</div>
        </div>
        {!hideTagline && (
          <div className="mt-1 hidden sm:flex items-center gap-1.5 text-[9px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
            <span className="h-px w-3 bg-border" />
            Ремонт кофемашин
            <span className="h-px w-3 bg-border" />
          </div>
        )}
      </div>
    </div>
  );
};

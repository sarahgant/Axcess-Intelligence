import * as React from "react";
import { cn } from "../../lib/utils";

export interface CCHIntelligenceTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * The HTML heading element to render (h1, h2, h3, etc.)
   * @default "h1"
   */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

/**
 * CCH Axcess™ Intelligence Title Component
 * 
 * A reusable component that applies the standardized styling for the
 * "CCH Axcess™ Intelligence" title throughout the application.
 * 
 * Styling specifications:
 * - Color: #353535
 * - Font: Fira Sans, 20px, 500 weight
 * - Line height: 26px (130%)
 * - Font features: lining-nums, proportional-nums, case, cpsp, dlig, mgrk
 * - Disabled ligatures: liga, clig
 * 
 * @example
 * ```tsx
 * <CCHIntelligenceTitle />
 * <CCHIntelligenceTitle as="h3" className="mb-4" />
 * ```
 */
const CCHIntelligenceTitle = React.forwardRef<
  HTMLHeadingElement,
  CCHIntelligenceTitleProps
>(({ className, as: Comp = "h1", ...props }, ref) => {
  return (
    <Comp
      ref={ref}
      className={cn("cch-intelligence-title whitespace-nowrap", className)}
      {...props}
    >
      CCH Axcess™ Intelligence
    </Comp>
  );
});

CCHIntelligenceTitle.displayName = "CCHIntelligenceTitle";

export { CCHIntelligenceTitle };
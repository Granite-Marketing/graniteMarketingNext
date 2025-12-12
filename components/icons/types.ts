import { SVGProps } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  /** Width and height of the icon (uses same value for both) */
  size?: number | string;
  /** Icon color - defaults to currentColor */
  color?: string;
  /** Additional CSS classes */
  className?: string;
  /** Title for accessibility - if provided, icon is not aria-hidden */
  title?: string;
}

export type IconComponent = React.FC<IconProps>;


import { IconProps } from "../types";

export function CloseIcon({
  size = 24,
  color = "currentColor",
  className,
  title,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={!title}
      role={title ? "img" : undefined}
      {...props}
    >
      {title && <title>{title}</title>}
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}


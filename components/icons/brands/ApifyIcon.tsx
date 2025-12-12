import { IconProps } from "../types";

interface ApifyIconProps extends IconProps {
  /** Show the circular background with backdrop filter */
  showBackground?: boolean;
}

export function ApifyIcon({
  size = 75,
  color,
  className,
  title = "Apify",
  showBackground = true,
  ...props
}: ApifyIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 75 74"
      fill="none"
      className={className}
      aria-hidden={!title}
      role={title ? "img" : undefined}
      {...props}
    >
      {title && <title>{title}</title>}
      {showBackground && (
        <>
          <defs>
            <filter
              id="apify-blur"
              x="-0.5"
              y="-0.003"
              width="76"
              height="76"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="0.5" />
              <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
              <feBlend in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
            </filter>
          </defs>
          <g filter="url(#apify-blur)">
            <circle cx="37.5" cy="36.997" r="37" fill="#1A1A1A" fillOpacity="0.4" />
            <circle cx="37.5" cy="36.997" r="36.5" stroke="#636363" strokeOpacity="0.4" />
          </g>
        </>
      )}
      {/* Apify "A" logo */}
      <g transform="translate(25, 24)">
        <path
          d="M12.5 4L2 28H8L10.5 22H16.5L19 28H25L14.5 4H12.5ZM12 10L15 18H9L12 10Z"
          fill="#97D700"
        />
      </g>
    </svg>
  );
}


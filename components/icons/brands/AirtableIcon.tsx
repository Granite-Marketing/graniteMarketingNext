import { IconProps } from "../types";

interface AirtableIconProps extends IconProps {
  /** Show the circular background with backdrop filter */
  showBackground?: boolean;
}

export function AirtableIcon({
  size = 75,
  color,
  className,
  title = "Airtable",
  showBackground = true,
  ...props
}: AirtableIconProps) {
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
              id="airtable-blur"
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
            <clipPath id="airtable-clip">
              <rect width="26" height="22" fill="white" transform="translate(24.5 25.997)" />
            </clipPath>
          </defs>
          <g filter="url(#airtable-blur)">
            <circle cx="37.5" cy="36.997" r="37" fill="#1A1A1A" fillOpacity="0.4" />
            <circle cx="37.5" cy="36.997" r="36.5" stroke="#636363" strokeOpacity="0.4" />
          </g>
        </>
      )}
      <g clipPath={showBackground ? "url(#airtable-clip)" : undefined}>
        <path
          d="M36.8203 27.4502L26.3066 31.5107C25.6777 31.754 25.7027 32.6519 26.3441 32.8591L36.893 36.266C37.4548 36.4477 38.0622 36.4477 38.624 36.266L49.1729 32.8591C49.8143 32.6519 49.8393 31.754 49.2104 31.5107L38.6967 27.4502C38.0837 27.2131 37.4333 27.2131 36.8203 27.4502Z"
          fill="#FCBF00"
        />
        <path
          d="M38.4583 38.2434V47.3614C38.4583 47.8368 38.9247 48.172 39.367 48.0018L50.1042 44.0065C50.3609 43.9096 50.5294 43.6652 50.5294 43.3936V34.2756C50.5294 33.8002 50.063 33.465 49.6208 33.6352L38.8836 37.6305C38.6269 37.7274 38.4583 37.9718 38.4583 38.2434Z"
          fill="#26B5F8"
        />
        <path
          d="M36.1971 38.5393L32.7247 36.9003C32.5649 36.8252 32.3814 36.8185 32.2163 36.8809L24.937 39.6335C24.4644 39.8117 24.4462 40.4699 24.9071 40.6734L32.3405 43.9539C32.5119 44.0296 32.7073 44.0297 32.8794 43.955L36.184 42.5188C36.6866 42.3005 36.711 41.5994 36.2236 41.3478L33.3891 39.8832C33.1765 39.7733 33.1663 39.4699 33.3712 39.346L36.1474 37.668C36.3751 37.5304 36.3885 37.2004 36.1716 37.0443L34.5879 35.9049L36.235 38.8279C36.4058 39.1309 36.5124 39.3372 36.1971 38.5393Z"
          fill="#F82B60"
        />
      </g>
    </svg>
  );
}


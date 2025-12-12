import { IconProps } from "../types";

interface N8nIconProps extends IconProps {
  /** Show the circular background with backdrop filter */
  showBackground?: boolean;
}

export function N8nIcon({
  size = 75,
  color,
  className,
  title = "n8n",
  showBackground = true,
  ...props
}: N8nIconProps) {
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
              id="n8n-blur"
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
            <clipPath id="n8n-clip">
              <rect width="34" height="14.37" fill="white" transform="translate(20.75 30.037)" />
            </clipPath>
          </defs>
          <g filter="url(#n8n-blur)">
            <path
              fill="#1A1A1A"
              fillOpacity="0.4"
              d="M74.5 36.997c0 20.435-16.566 37-37 37s-37-16.565-37-37c0-20.434 16.566-37 37-37s37 16.566 37 37Z"
            />
            <path
              stroke="#636363"
              strokeOpacity="0.4"
              d="M74 36.997c0 20.159-16.342 36.5-36.5 36.5S1 57.156 1 36.997C1 16.84 17.342.497 37.5.497S74 16.84 74 36.997Z"
            />
          </g>
        </>
      )}
      <g clipPath={showBackground ? "url(#n8n-clip)" : undefined}>
        <path
          d="M45.4168 30.0371H44.9651C42.2082 30.0371 40.8297 31.4155 40.8297 34.1724V35.7607C40.8297 37.8024 40.0097 38.8482 38.0014 38.8482H37.7247C39.683 38.8482 40.5113 39.8357 40.5113 41.8274V44.1657C40.5113 45.6007 41.3014 46.4407 42.7447 46.5174C42.6847 44.6541 42.6597 44.3358 42.6597 44.2591V42.2174C42.6597 40.4208 43.6472 38.7108 46.0022 38.6841C43.613 38.6424 42.6597 36.9158 42.6597 35.1608V33.5891C42.6597 32.2691 42.6764 31.8858 42.753 30.5908C42.443 30.2241 41.998 30.0371 41.4114 30.0371H41.0014H40.9747C40.9747 30.0371 40.9764 30.0371 40.9747 30.0371H45.4168V30.0371Z"
          fill="#EA4B71"
        />
        <path
          d="M29.5081 30.0371H29.9598C32.7167 30.0371 34.0951 31.4155 34.0951 34.1724V35.7607C34.0951 37.8024 34.9151 38.8482 36.9235 38.8482H37.2001C35.2418 38.8482 34.4135 39.8357 34.4135 41.8274V44.1657C34.4135 45.6007 33.6235 46.4407 32.1801 46.5174C32.2401 44.6541 32.2651 44.3358 32.2651 44.2591V42.2174C32.2651 40.4208 31.2776 38.7108 28.9226 38.6841C31.3118 38.6424 32.2651 36.9158 32.2651 35.1608V33.5891C32.2651 32.2691 32.2485 31.8858 32.1718 30.5908C32.4818 30.2241 32.9268 30.0371 33.5135 30.0371H33.9234H33.9501C33.9501 30.0371 33.9485 30.0371 33.9501 30.0371H29.5081V30.0371Z"
          fill="#EA4B71"
        />
      </g>
    </svg>
  );
}


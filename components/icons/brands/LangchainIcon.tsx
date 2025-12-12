import { IconProps } from "../types";

interface LangchainIconProps extends IconProps {
  /** Show the circular background with backdrop filter */
  showBackground?: boolean;
}

export function LangchainIcon({
  size = 75,
  color,
  className,
  title = "LangChain",
  showBackground = true,
  ...props
}: LangchainIconProps) {
  // LangChain uses a parrot/chain link style icon
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
              id="langchain-blur"
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
          <g filter="url(#langchain-blur)">
            <circle cx="37.5" cy="36.997" r="37" fill="#1A1A1A" fillOpacity="0.4" />
            <circle cx="37.5" cy="36.997" r="36.5" stroke="#636363" strokeOpacity="0.4" />
          </g>
        </>
      )}
      {/* LangChain parrot icon simplified */}
      <g transform="translate(22, 20)">
        <path
          d="M15.5 4C10.5 4 6.5 8 6.5 13C6.5 15.5 7.5 17.8 9.2 19.5L8 24L12.5 22.8C14 23.6 15.7 24 17.5 24C22.5 24 26.5 20 26.5 15C26.5 10 22.5 6 17.5 6"
          stroke="#1FE06F"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="20" cy="14" r="1.5" fill="#1FE06F" />
        <circle cx="14" cy="14" r="1.5" fill="#1FE06F" />
        <path
          d="M14 18C14 18 15.5 20 17 20C18.5 20 20 18 20 18"
          stroke="#1FE06F"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}


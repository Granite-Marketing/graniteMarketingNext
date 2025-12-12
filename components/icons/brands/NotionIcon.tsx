import { IconProps } from "../types";

interface NotionIconProps extends IconProps {
  /** Show the circular background with backdrop filter */
  showBackground?: boolean;
}

export function NotionIcon({
  size = 75,
  color,
  className,
  title = "Notion",
  showBackground = true,
  ...props
}: NotionIconProps) {
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
              id="notion-blur"
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
            <clipPath id="notion-clip">
              <rect width="20" height="24" fill="white" transform="translate(27.5 24.997)" />
            </clipPath>
          </defs>
          <g filter="url(#notion-blur)">
            <circle cx="37.5" cy="36.997" r="37" fill="#1A1A1A" fillOpacity="0.4" />
            <circle cx="37.5" cy="36.997" r="36.5" stroke="#636363" strokeOpacity="0.4" />
          </g>
        </>
      )}
      <g clipPath={showBackground ? "url(#notion-clip)" : undefined}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M31.8553 26.3145C32.4881 26.7894 32.7395 26.7546 33.7178 26.6841L45.3823 25.9808C45.6357 25.9808 45.418 25.7274 45.3475 25.6921L43.446 24.3327C43.0516 24.0088 42.5176 23.6507 41.5041 23.7212L30.225 24.5303C29.8306 24.5656 29.7601 24.7837 29.9006 24.9313L31.8553 26.3145ZM32.5234 29.3421V47.4579C32.5234 48.4029 32.9883 48.7268 34.0722 48.6563L46.8844 47.8824C47.9683 47.812 48.1159 47.1792 48.1159 46.375V28.3649C48.1159 27.5609 47.7922 27.131 47.0889 27.2015L33.6473 28.0106C32.9078 28.0811 32.5234 28.5381 32.5234 29.3421ZM45.5299 30.1099C45.6357 30.5854 45.5299 31.0604 45.0534 31.1309L44.3501 31.2719V45.2176C43.7525 45.5415 43.1902 45.7244 42.7253 45.7244C41.9918 45.7244 41.8091 45.4711 41.2755 44.7678L36.1859 36.8839V44.5092L37.6044 44.8331C37.6044 44.8331 37.6044 45.7244 36.3617 45.7244L32.9883 45.9425C32.8825 45.7244 32.9883 45.1824 33.4179 45.0766L34.355 44.8279V34.5721L32.9884 34.4663C32.8826 33.9913 33.0959 33.2881 33.8987 33.2176L37.5339 32.9642L42.8311 41.0241V33.9207L41.6414 33.7732C41.5356 33.1928 41.9565 32.7885 42.4851 32.7179L45.5299 30.1099ZM29.0699 23.0884L40.8049 22.2441C42.5176 22.1031 42.9473 22.2088 44.0665 23.0179L47.6174 25.5554C48.364 26.1177 48.6174 26.2587 48.6174 26.8563V47.8824C48.6174 49.1603 48.1878 49.8989 46.8844 49.9694L33.1664 50.8137C32.1881 50.8842 31.7232 50.7432 31.2231 50.1013L28.4975 46.5503C27.9282 45.7816 27.7148 45.2008 27.7148 44.5328V24.6713C27.7148 23.8319 28.1797 23.1586 29.0699 23.0884Z"
          fill="white"
        />
      </g>
    </svg>
  );
}


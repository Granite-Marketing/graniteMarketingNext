import Link from "next/link";
import { clsx } from "clsx";
import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "alternate";
type ButtonSize = "default" | "small";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-brand-green hover:bg-brand-green-light text-black",
  secondary: "bg-transparent border border-brand-off-white text-brand-off-white hover:bg-brand-off-white hover:text-black",
  alternate: "bg-brand-green hover:bg-brand-green-light text-black",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "px-6 py-3 text-base",
  small: "px-4 py-2 text-sm",
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "default",
  icon,
  className,
  onClick,
  type = "button",
  disabled = false,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const baseStyles = clsx(
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors",
    variantStyles[variant],
    sizeStyles[size],
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  const content = (
    <>
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </>
  );

  // Use Link for navigation, button for actions
  if (href) {
    return (
      <Link href={href} className={baseStyles} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}

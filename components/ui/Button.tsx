import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "link";
  size?: "sm" | "md" | "lg" | "link";
  title?: string;
  asChild?: boolean;
  iconRight?: React.ReactNode;
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  title,
  asChild,
  iconRight,
  ...props
}: ButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
      // Primary - black background, white text
      "bg-text-primary text-background-primary hover:opacity-90":
        variant === "primary",
      // Secondary - border, transparent background
      "border border-border-primary bg-transparent text-text-primary hover:bg-background-secondary":
        variant === "secondary",
      // Link - no border, just text
      "border-transparent bg-transparent text-text-primary hover:underline underline-offset-4":
        variant === "link" || size === "link",
      // Sizes
      "h-9 px-4 text-sm": size === "sm" && variant !== "link",
      "h-10 px-6 text-base": (size === "md" || size === undefined) && variant !== "link",
      "h-12 px-8 text-lg": size === "lg" && variant !== "link",
      "gap-2": iconRight,
    },
    className
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    // Extract button-specific props that shouldn't be passed to Link/anchor
    const { type, onClick, onMouseEnter, onTouchStart, ...safeProps } = props as any;
    const linkContent = (
      <>
        {child.props.children}
        {iconRight && <span>{iconRight}</span>}
      </>
    );
    return React.cloneElement(child, {
      className: cn(baseClasses, child.props?.className),
      title,
      ...safeProps,
      children: linkContent,
    });
  }

  const content = (
    <>
      {children}
      {iconRight && <span>{iconRight}</span>}
    </>
  );

  return (
    <button
      type="button"
      className={baseClasses}
      title={title}
      {...props}
    >
      {content}
    </button>
  );
}

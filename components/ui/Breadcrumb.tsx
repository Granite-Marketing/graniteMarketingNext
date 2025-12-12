import React from "react";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
  children: React.ReactNode;
  className?: string;
}

export function Breadcrumb({ children, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("", className)}>
      {children}
    </nav>
  );
}

interface BreadcrumbListProps {
  children: React.ReactNode;
  className?: string;
}

export function BreadcrumbList({
  children,
  className,
}: BreadcrumbListProps) {
  return (
    <ol className={cn("flex items-center space-x-2", className)}>
      {children}
    </ol>
  );
}

interface BreadcrumbItemProps {
  children: React.ReactNode;
  className?: string;
}

export function BreadcrumbItem({
  children,
  className,
}: BreadcrumbItemProps) {
  return <li className={cn("", className)}>{children}</li>;
}

interface BreadcrumbLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  className?: string;
}

export function BreadcrumbLink({
  children,
  className,
  ...props
}: BreadcrumbLinkProps) {
  return (
    <a
      className={cn(
        "text-text-primary hover:text-text-secondary transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

interface BreadcrumbSeparatorProps {
  className?: string;
}

export function BreadcrumbSeparator({
  className,
}: BreadcrumbSeparatorProps) {
  return (
    <span className={cn("text-text-secondary mx-2", className)}>/</span>
  );
}


import { ReactNode } from "react";
import { clsx } from "clsx";
import Image from "next/image";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "gradient";
  padding?: "none" | "small" | "medium" | "large";
  as?: "div" | "article" | "li";
}

const paddingStyles = {
  none: "",
  small: "p-4",
  medium: "p-6",
  large: "p-8",
};

export default function Card({
  children,
  className,
  variant = "default",
  padding = "medium",
  as: Component = "div",
}: CardProps) {
  return (
    <Component
      className={clsx(
        "rounded-xl",
        paddingStyles[padding],
        variant === "gradient" && "gradient-border",
        variant === "default" && "bg-neutral-darker border border-neutral-dark",
        className
      )}
    >
      {children}
    </Component>
  );
}

// Icon Card for services/features
interface IconCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function IconCard({ icon, title, description, className }: IconCardProps) {
  return (
    <article className={clsx("gradient-border p-8 group", className)}>
      <div 
        className="w-12 h-12 flex items-center justify-center rounded-lg bg-brand-green/10 text-brand-green group-hover:bg-brand-green group-hover:text-black transition-all mb-4" 
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-brand-white mb-2">{title}</h3>
      <p className="text-brand-off-white">{description}</p>
    </article>
  );
}

// Testimonial Card - using figure/blockquote for semantics
interface TestimonialCardProps {
  quote: string;
  author: string;
  company: string;
  role?: string;
  image?: string;
  className?: string;
}

export function TestimonialCard({
  quote,
  author,
  company,
  role,
  image,
  className,
}: TestimonialCardProps) {
  return (
    <figure className={clsx("gradient-border p-8", className)}>
      <blockquote className="text-xl md:text-2xl text-brand-white leading-relaxed mb-6">
        <p>&ldquo;{quote}&rdquo;</p>
      </blockquote>
      <figcaption className="flex items-center gap-4">
        {image && (
          <Image 
            src={image} 
            alt="" 
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover bg-neutral-dark"
          />
        )}
        <cite className="not-italic">
          <strong className="text-brand-green font-medium block">{author}</strong>
          <span className="text-neutral-light text-sm font-mono">
            {role && `${role}, `}{company}
          </span>
        </cite>
      </figcaption>
    </figure>
  );
}

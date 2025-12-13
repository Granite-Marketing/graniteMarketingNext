import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-3 py-1 text-xs font-medium transition-all duration-200 w-fit whitespace-nowrap shrink-0",
  {
    variants: {
      variant: {
        category: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 hover:border-primary/30",
        published: "bg-muted/50 text-muted-foreground border-border/30 hover:bg-muted hover:border-border/50",
        sectionLabel:
          "bg-gradient-to-br from-primary/20 via-primary/10 to-transparent text-primary border-primary/30 backdrop-blur-sm shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:border-primary/40 uppercase tracking-wider font-semibold",
        interactive:
          "bg-card/50 text-foreground border-border/50 hover:border-primary/50 hover:bg-primary/10 hover:text-foreground cursor-pointer",
        selected: "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 hover:bg-primary/90",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-xs px-3 py-1",
        lg: "text-sm px-4 py-1.5",
      },
    },
    defaultVariants: {
      variant: "category",
      size: "md",
    },
  },
)

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {
  asChild?: boolean
}

function Tag({ className, variant, size, ...props }: TagProps) {
  return <span className={cn(tagVariants({ variant, size }), className)} {...props} />
}

export { Tag, tagVariants }

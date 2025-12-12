import React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-border-primary text-text-primary focus:ring-2 focus:ring-border-primary focus:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}


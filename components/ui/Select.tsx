"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  value: string | undefined;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextValue | undefined>(undefined);

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Select({
  children,
  value: controlledValue,
  defaultValue,
  onValueChange,
  className,
}: SelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{ value, onValueChange: handleValueChange, open, setOpen }}
    >
      <div className={cn("relative", className)}>{children}</div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function SelectTrigger({
  children,
  className,
  ...props
}: SelectTriggerProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within Select");

  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-border-primary bg-background-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-primary focus:ring-offset-2",
        className
      )}
      onClick={() => context.setOpen(!context.open)}
      {...props}
    >
      {children}
      <span className="ml-2">▼</span>
    </button>
  );
}

interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export function SelectValue({ placeholder, className }: SelectValueProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within Select");

  return (
    <span className={cn("text-text-secondary", className)}>
      {context.value || placeholder}
    </span>
  );
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectContent({ children, className }: SelectContentProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectContent must be used within Select");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        context.setOpen(false);
      }
    };

    if (context.open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [context.open, context]);

  if (!context.open) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 mt-1 max-h-[300px] w-full overflow-auto rounded-md border border-border-primary bg-background-primary shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export function SelectItem({
  children,
  value,
  className,
}: SelectItemProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within Select");

  return (
    <button
      type="button"
      className={cn(
        "w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-background-secondary focus:bg-background-secondary focus:outline-none",
        context.value === value && "bg-background-secondary",
        className
      )}
      onClick={() => context.onValueChange(value)}
    >
      {children}
    </button>
  );
}


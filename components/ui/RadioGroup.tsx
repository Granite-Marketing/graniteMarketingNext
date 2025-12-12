"use client";

import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface RadioGroupContextValue {
  value: string | undefined;
  onValueChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(
  undefined
);

interface RadioGroupProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function RadioGroup({
  children,
  value: controlledValue,
  defaultValue,
  onValueChange,
  className,
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <RadioGroupContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn("grid gap-2", className)} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  id?: string;
}

export function RadioGroupItem({
  value,
  id,
  className,
  ...props
}: RadioGroupItemProps) {
  const context = useContext(RadioGroupContext);
  if (!context)
    throw new Error("RadioGroupItem must be used within RadioGroup");

  const isChecked = context.value === value;

  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={isChecked}
      onChange={() => context.onValueChange(value)}
      className={cn(
        "h-4 w-4 border-border-primary text-text-primary focus:ring-2 focus:ring-border-primary focus:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}


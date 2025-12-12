"use client";

import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
	value: string[];
	onValueChange: (value: string) => void;
	type: "single" | "multiple";
}

const AccordionContext = createContext<AccordionContextValue | undefined>(
	undefined
);

const AccordionItemContext = createContext<{ value: string } | undefined>(
	undefined
);

interface AccordionProps {
	children: React.ReactNode;
	type?: "single" | "multiple";
	defaultValue?: string | string[];
	className?: string;
}

export function Accordion({
	children,
	type = "single",
	defaultValue,
	className,
}: AccordionProps) {
	const [value, setValue] = useState<string[]>(() => {
		if (type === "single") {
			return defaultValue ? [String(defaultValue)] : [];
		}
		return Array.isArray(defaultValue) ? defaultValue : [];
	});

	const onValueChange = (itemValue: string) => {
		if (type === "single") {
			setValue(value.includes(itemValue) ? [] : [itemValue]);
		} else {
			setValue((prev) =>
				prev.includes(itemValue)
					? prev.filter((v) => v !== itemValue)
					: [...prev, itemValue]
			);
		}
	};

	return (
		<AccordionContext.Provider value={{ value, onValueChange, type }}>
			<div className={cn("w-full", className)}>{children}</div>
		</AccordionContext.Provider>
	);
}

interface AccordionItemProps {
	children: React.ReactNode;
	value: string;
	className?: string;
}

export function AccordionItem({
	children,
	value,
	className,
}: AccordionItemProps) {
	return (
		<AccordionItemContext.Provider value={{ value }}>
			<div className={cn("border-b border-border-primary", className)}>
				{children}
			</div>
		</AccordionItemContext.Provider>
	);
}

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	className?: string;
}

export function AccordionTrigger({
	children,
	className,
	...props
}: AccordionTriggerProps) {
	const context = useContext(AccordionContext);
	if (!context)
		throw new Error("AccordionTrigger must be used within Accordion");

	const itemContext = useContext(AccordionItemContext);
	if (!itemContext)
		throw new Error("AccordionTrigger must be used within AccordionItem");

	const isOpen = context.value.includes(itemContext.value);

	return (
		<button
			type="button"
			className={cn(
				"flex w-full items-center justify-between py-4 text-left font-semibold transition-all hover:opacity-80",
				className
			)}
			onClick={() => context.onValueChange(itemContext.value)}
			aria-expanded={isOpen}
			{...props}
		>
			{children}
			<span className={cn("transition-transform", isOpen && "rotate-180")}>
				▼
			</span>
		</button>
	);
}

interface AccordionContentProps {
	children: React.ReactNode;
	className?: string;
}

export function AccordionContent({
	children,
	className,
}: AccordionContentProps) {
	const context = useContext(AccordionContext);
	if (!context)
		throw new Error("AccordionContent must be used within Accordion");

	const itemContext = useContext(AccordionItemContext);
	if (!itemContext)
		throw new Error("AccordionContent must be used within AccordionItem");

	const isOpen = context.value.includes(itemContext.value);

	return (
		<div
			className={cn(
				"overflow-hidden transition-all duration-300",
				isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
				className
			)}
		>
			<div className="pb-4">{children}</div>
		</div>
	);
}

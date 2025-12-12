import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, type = "text", ...props }: InputProps) {
	return (
		<input
			type={type}
			className={`flex h-10 w-full rounded-md border border-border-primary bg-background-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-border-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
			{...props}
		/>
	);
}

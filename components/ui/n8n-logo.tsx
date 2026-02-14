import { cn } from "@/lib/utils";

interface N8nLogoProps {
	className?: string;
}

export function N8nLogo({ className }: N8nLogoProps) {
	return (
		<img
			src="/images/logos/n8n_icon_pink.svg"
			alt="n8n"
			className={cn("size-4 shrink-0 object-contain", className)}
		/>
	);
}

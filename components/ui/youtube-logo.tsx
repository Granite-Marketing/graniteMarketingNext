import { cn } from "@/lib/utils";

interface YoutubeLogoProps {
	className?: string;
}

export function YoutubeLogo({ className }: YoutubeLogoProps) {
	return (
		<img
			src="/images/logos/youtube.svg"
			alt="YouTube"
			className={cn("size-4 shrink-0", className)}
		/>
	);
}

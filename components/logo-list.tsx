import { cn } from "@/lib/utils";
import type { LogoItem } from "@/lib/sanity/lib/adapters";
import Image from "next/image";

type LogoListProps = {
	logos: LogoItem[];
	label?: string;
	className?: string;
};

export function LogoList({
	logos,
	label = "TRUSTED BY",
	className,
}: LogoListProps) {
	if (!logos || logos.length === 0) return null;

	const visibleLogos = logos.slice(0, 5);

	return (
		<section
			className={cn("flex flex-col items-center", className)}
			aria-label={label}
		>
			<div className="flex items-center gap-2 mb-6 w-full max-w-md">
				<div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
				<span className="text-xs md:text-sm uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
					{label}
				</span>
				<div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
			</div>

			<ul
				className="flex flex-wrap items-center justify-center gap-4 md:gap-6"
				role="list"
			>
				{visibleLogos.map((logo) => {
					const content = (
						<Image
							src={logo.logoUrl}
							alt={logo.name || "Client logo"}
							className="h-5 md:h-6 lg:h-7 w-auto object-contain mx-auto filter grayscale opacity-80 hover:opacity-100 transition"
							loading="lazy"
							width={80}
							height={28}
						/>
					);

					return (
						<li
							key={logo.id}
							className="flex items-center justify-center max-w-[80px] md:max-w-[100px]"
						>
							{logo.website ? (
								<a
									href={logo.website}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
								>
									{content}
								</a>
							) : (
								content
							)}
						</li>
					);
				})}
			</ul>
		</section>
	);
}

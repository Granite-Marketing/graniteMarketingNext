export function RouteGlyph({ className }: { className?: string }) {
	return (
		<svg viewBox="17 5 78 90" aria-hidden="true" className={className}>
			<path
				d="M86 14 L26 14 L26 86 L86 86 L86 50 L70 50"
				fill="none"
				strokeWidth="13"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="stroke-relay-ink"
			/>
			<circle cx="48" cy="50" r="6.5" className="fill-relay-cyan" />
		</svg>
	);
}

export function BrandMark({
	hideWordmarkOnMobile = false,
}: {
	hideWordmarkOnMobile?: boolean;
}) {
	return (
		<span className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-relay-ink">
			<RouteGlyph className="h-6 w-auto shrink-0 md:h-4" />
			<span className={hideWordmarkOnMobile ? "hidden md:inline" : undefined}>
				granite
			</span>
		</span>
	);
}

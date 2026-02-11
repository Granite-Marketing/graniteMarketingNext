export default function Loading() {
	return (
		<div className="min-h-screen pt-32 pb-24">
			<div className="container mx-auto px-4 max-w-4xl">
				{/* Hero skeleton */}
				<div className="mb-12 animate-pulse">
					<div className="h-4 w-32 bg-muted rounded-lg mb-6" />
					<div className="h-12 w-full bg-muted rounded-lg mb-4" />
					<div className="h-6 w-3/4 bg-muted rounded-lg mb-8" />
					<div className="h-64 w-full bg-muted rounded-xl" />
				</div>

				{/* Content skeleton */}
				<div className="space-y-6 animate-pulse">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="space-y-3">
							<div className="h-6 w-full bg-muted/50 rounded" />
							<div className="h-6 w-full bg-muted/50 rounded" />
							<div className="h-6 w-5/6 bg-muted/50 rounded" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

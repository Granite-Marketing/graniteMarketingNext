export default function Loading() {
	return (
		<div className="min-h-screen pt-32 pb-24">
			<div className="container mx-auto px-4">
				{/* Hero skeleton */}
				<div className="mb-16 animate-pulse">
					<div className="h-12 w-64 bg-muted rounded-lg mb-4 mx-auto" />
					<div className="h-6 w-96 bg-muted rounded-lg mx-auto" />
				</div>

				{/* Grid skeleton */}
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className="bg-muted/30 rounded-xl overflow-hidden border border-border/50 animate-pulse"
						>
							<div className="h-48 bg-muted/50" />
							<div className="p-6 space-y-4">
								<div className="h-4 w-24 bg-muted/50 rounded" />
								<div className="h-6 w-full bg-muted/50 rounded" />
								<div className="h-4 w-3/4 bg-muted/50 rounded" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

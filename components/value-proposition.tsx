import { Tag } from "@/components/ui/tag";

const stats = [
	{ value: "250+", label: "Clients Served" },
	{ value: "98%", label: "Satisfaction Rate" },
	{ value: "5x", label: "Average ROI" },
	{ value: "12+", label: "Years Experience" },
];

export function ValueProposition() {
	return (
		<section className="py-24">
			<div className="container mx-auto px-4">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div>
						<Tag variant="sectionLabel" className="mb-4">
							Why Choose Us
						</Tag>
						<h2 className="font-semibold mb-6 text-balance">
							Results That Speak for Themselves
						</h2>
						<p className="text-xl text-muted-foreground leading-relaxed mb-8 text-pretty">
							We don't just promise growth, we deliver it. Our proven
							methodologies and expert team have helped hundreds of businesses
							achieve their marketing goals and exceed their expectations.
						</p>
						<div className="grid grid-cols-2 gap-8">
							{stats.map((stat, index) => (
								<div key={index}>
									<div className="text-4xl font-bold text-primary mb-2">
										{stat.value}
									</div>
									<div className="text-muted-foreground">{stat.label}</div>
								</div>
							))}
						</div>
					</div>
					<div className="relative h-[500px] rounded-2xl overflow-hidden">
						<img
							src="/marketing-team-analyzing-data-on-screens.jpg"
							alt="Marketing analytics"
							className="w-full h-full object-cover"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

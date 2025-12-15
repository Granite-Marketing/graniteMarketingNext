import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import { Tag } from "@/components/ui/tag";
import type { TestimonialItem } from "@/lib/sanity/lib/adapters";
import { PortableTextRenderer } from "@/lib/sanity/components/PortableTextRenderer";
import Image from "next/image";

interface TestimonialsProps {
	testimonials: TestimonialItem[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
	return (
		<section id="testimonials" className="py-24 bg-muted/30 overflow-hidden">
			<div className="container mx-auto px-4">
				<div className="text-center mb-16">
					<Tag variant="sectionLabel" className="mb-4">
						Testimonials
					</Tag>
					<h2 className="text-4xl md:text-5xl font-medium mb-4 text-balance">
						Real results
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
						Teams that moved faster
					</p>
				</div>

				<div className="max-w-7xl mx-auto">
					{/* Desktop: 3 columns, Tablet: 2 columns, Mobile: 1 column */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
						{testimonials.map((testimonial) => (
							<Card
								key={testimonial.id}
								className="hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur h-full"
							>
								<CardContent className="p-8">
									{testimonial.locationName && (
										<Tag
											variant="published"
											size="sm"
											className="mb-3 flex items-center gap-1.5"
										>
											<MapPin className="w-3 h-3" />
											{testimonial.locationName}
										</Tag>
									)}
									{testimonial.companyLogoUrl && (
										<figure className="mb-6">
											<Image
												src={testimonial.companyLogoUrl}
												alt={testimonial.company || "Company logo"}
												width={120}
												height={40}
												className="h-10 w-auto object-contain"
											/>
										</figure>
									)}
									<div className="mb-6 text-base leading-relaxed text-pretty">
										<PortableTextRenderer value={testimonial.quote} />
									</div>
									<div className="flex items-center gap-4">
										<Avatar className="h-12 w-12">
											<AvatarImage
												src={testimonial.headshotUrl || "/placeholder.svg"}
												alt={testimonial.authorName}
											/>
											<AvatarFallback>
												{testimonial.authorName
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<div className="font-semibold">
												{testimonial.authorName}
											</div>
											<div className="text-sm text-muted-foreground">
												{testimonial.company ?? testimonial.role}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

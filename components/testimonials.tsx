import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Tag } from "@/components/ui/tag";
import type { TestimonialItem } from "@/lib/sanity/lib/adapters";
import { PortableTextRenderer } from "@/lib/sanity/components/PortableTextRenderer";

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
						{/* Left column - 2 cards with offset on desktop */}
						<Card className="hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur h-full">
							<CardContent className="p-8">
								<div className="flex mb-4">
									{Array.from({ length: testimonials[0].rating }).map(
										(_, i) => (
											<Star
												key={i}
												className="w-5 h-5 fill-primary"
												style={{
													stroke: "none",
												}}
											/>
										)
									)}
								</div>
								<p className="text-base mb-6 leading-relaxed text-pretty">
									"{testimonials[0].content}"
								</p>
								<div className="flex items-center gap-4">
									<Avatar className="h-12 w-12">
										<AvatarImage
											src={testimonials[0].headshotUrl || "/placeholder.svg"}
											alt={testimonials[0].authorName}
										/>
										<AvatarFallback>
											{testimonials[0].authorName
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-semibold">{testimonials[0].authorName}</div>
										<div className="text-sm text-muted-foreground">
											{testimonials[0].company ?? testimonials[0].role}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur h-full">
							<CardContent className="p-8">
								<div className="flex mb-4">
									{Array.from({ length: testimonials[3].rating }).map(
										(_, i) => (
											<Star
												key={i}
												className="w-5 h-5 fill-primary"
												style={{
													stroke: "none",
												}}
											/>
										)
									)}
								</div>
								<p className="text-base mb-6 leading-relaxed text-pretty">
									"{testimonials[3].content}"
								</p>
								<div className="flex items-center gap-4">
									<Avatar className="h-12 w-12">
										<AvatarImage
											src={testimonials[3].headshotUrl || "/placeholder.svg"}
											alt={testimonials[3].authorName}
										/>
										<AvatarFallback>
											{testimonials[3].authorName
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-semibold">{testimonials[3].authorName}</div>
										<div className="text-sm text-muted-foreground">
											{testimonials[3].company ?? testimonials[3].role}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Middle column - 2 cards, no offset */}
						<Card className="hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur h-full">
							<CardContent className="p-8">
								<div className="flex mb-4">
									{Array.from({ length: testimonials[1].rating }).map(
										(_, i) => (
											<Star
												key={i}
												className="w-5 h-5 fill-primary"
												style={{
													stroke: "none",
												}}
											/>
										)
									)}
								</div>
								<p className="text-base mb-6 leading-relaxed text-pretty">
									"{testimonials[1].content}"
								</p>
								<div className="flex items-center gap-4">
									<Avatar className="h-12 w-12">
										<AvatarImage
											src={testimonials[1].headshotUrl || "/placeholder.svg"}
											alt={testimonials[1].authorName}
										/>
										<AvatarFallback>
											{testimonials[1].authorName
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-semibold">{testimonials[1].authorName}</div>
										<div className="text-sm text-muted-foreground">
											{testimonials[1].company ?? testimonials[1].role}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur h-full">
							<CardContent className="p-8">
								<div className="flex mb-4">
									{Array.from({ length: testimonials[4].rating }).map(
										(_, i) => (
											<Star
												key={i}
												className="w-5 h-5 fill-primary"
												style={{
													stroke: "none",
												}}
											/>
										)
									)}
								</div>
								<p className="text-base mb-6 leading-relaxed text-pretty">
									"{testimonials[4].content}"
								</p>
								<div className="flex items-center gap-4">
									<Avatar className="h-12 w-12">
										<AvatarImage
											src={testimonials[4].headshotUrl || "/placeholder.svg"}
											alt={testimonials[4].authorName}
										/>
										<AvatarFallback>
											{testimonials[4].authorName
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-semibold">{testimonials[4].authorName}</div>
										<div className="text-sm text-muted-foreground">
											{testimonials[4].company ?? testimonials[4].role}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Right column - 2 cards with offset on desktop */}
						<Card className="hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur h-full">
							<CardContent className="p-8">
								<div className="flex mb-4">
									{Array.from({ length: testimonials[2].rating }).map(
										(_, i) => (
											<Star
												key={i}
												className="w-5 h-5 fill-primary"
												style={{
													stroke: "none",
												}}
											/>
										)
									)}
								</div>
								<p className="text-base mb-6 leading-relaxed text-pretty">
									"{testimonials[2].content}"
								</p>
								<div className="flex items-center gap-4">
									<Avatar className="h-12 w-12">
										<AvatarImage
											src={testimonials[2].headshotUrl || "/placeholder.svg"}
											alt={testimonials[2].authorName}
										/>
										<AvatarFallback>
											{testimonials[2].authorName
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-semibold">{testimonials[2].authorName}</div>
										<div className="text-sm text-muted-foreground">
											{testimonials[2].company ?? testimonials[2].role}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur h-full">
							<CardContent className="p-8">
								<div className="flex mb-4">
									{Array.from({ length: testimonials[5].rating }).map(
										(_, i) => (
											<Star
												key={i}
												className="w-5 h-5 fill-primary"
												style={{
													stroke: "none",
												}}
											/>
										)
									)}
								</div>
								<p className="text-base mb-6 leading-relaxed text-pretty">
									"{testimonials[5].content}"
								</p>
								<div className="flex items-center gap-4">
									<Avatar className="h-12 w-12">
										<AvatarImage
											src={testimonials[5].headshotUrl || "/placeholder.svg"}
											alt={testimonials[5].authorName}
										/>
										<AvatarFallback>
											{testimonials[5].authorName
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-semibold">{testimonials[5].authorName}</div>
										<div className="text-sm text-muted-foreground">
											{testimonials[5].company ?? testimonials[5].role}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</section>
	);
}

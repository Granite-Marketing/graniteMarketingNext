import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Tag } from "@/components/ui/tag";

const testimonials = [
	{
		name: "Sarah Mitchell",
		role: "Operations director, retail",
		image: "/placeholder.svg?height=48&width=48",
		content:
			"The automation runs while we sleep. What took three people all morning now happens in minutes.",
		rating: 5,
	},
	{
		name: "Marcus Webb",
		role: "Operations lead, e-commerce",
		image: "/placeholder.svg?height=48&width=48",
		content:
			"Granite Marketing didn't just build us a tool. They understood our process and made it faster without changing how we work.",
		rating: 5,
	},
	{
		name: "David Park",
		role: "Founder, SaaS startup",
		image: "/placeholder.svg?height=48&width=48",
		content:
			"Setup was clean. Deployment was faster. The workflow just works the way we do.",
		rating: 5,
	},
	{
		name: "James Chen",
		role: "CEO, logistics firm",
		image: "/placeholder.svg?height=48&width=48",
		content:
			"We cut our data entry time in half. The automation handles what used to take our team hours every morning.",
		rating: 5,
	},
	{
		name: "Elena Rodriguez",
		role: "Director, marketing agency",
		image: "/placeholder.svg?height=48&width=48",
		content:
			"Granite Marketing built exactly what we needed without overcomplicating it. Our team reclaimed ten hours a week and never looked back.",
		rating: 5,
	},
	{
		name: "Priya Kapoor",
		role: "VP operations, finance",
		image: "/placeholder.svg?height=48&width=48",
		content:
			"We stopped managing data entry and started managing growth instead.",
		rating: 5,
	},
];

export function Testimonials() {
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
						<Card className="hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur lg:mt-6">
							<CardContent className="p-8">
								<div className="flex mb-4">
									{Array.from({ length: testimonials[0].rating }).map(
										(_, i) => (
											<Star
												key={i}
												className="w-5 h-5 fill-foreground text-foreground"
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
											src={testimonials[0].image || "/placeholder.svg"}
											alt={testimonials[0].name}
										/>
										<AvatarFallback>
											{testimonials[0].name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-semibold">{testimonials[0].name}</div>
										<div className="text-sm text-muted-foreground">
											{testimonials[0].role}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur">
							<CardContent className="p-8">
								<div className="flex mb-4">
									{Array.from({ length: testimonials[3].rating }).map(
										(_, i) => (
											<Star
												key={i}
												className="w-5 h-5 fill-foreground text-foreground"
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
											src={testimonials[3].image || "/placeholder.svg"}
											alt={testimonials[3].name}
										/>
										<AvatarFallback>
											{testimonials[3].name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-semibold">{testimonials[3].name}</div>
										<div className="text-sm text-muted-foreground">
											{testimonials[3].role}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Middle column - 2 cards, no offset */}
						<Card className="hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur lg:mt-6">
							<CardContent className="p-8">
								<div className="flex mb-4">
									{Array.from({ length: testimonials[1].rating }).map(
										(_, i) => (
											<Star
												key={i}
												className="w-5 h-5 fill-foreground text-foreground"
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
											src={testimonials[1].image || "/placeholder.svg"}
											alt={testimonials[1].name}
										/>
										<AvatarFallback>
											{testimonials[1].name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-semibold">{testimonials[1].name}</div>
										<div className="text-sm text-muted-foreground">
											{testimonials[1].role}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur">
							<CardContent className="p-8">
								<div className="flex mb-4">
									{Array.from({ length: testimonials[4].rating }).map(
										(_, i) => (
											<Star
												key={i}
												className="w-5 h-5 fill-foreground text-foreground"
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
											src={testimonials[4].image || "/placeholder.svg"}
											alt={testimonials[4].name}
										/>
										<AvatarFallback>
											{testimonials[4].name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-semibold">{testimonials[4].name}</div>
										<div className="text-sm text-muted-foreground">
											{testimonials[4].role}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Right column - 2 cards with offset on desktop */}
						<Card className="hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur lg:-mt-6">
							<CardContent className="p-8">
								<div className="flex mb-4">
									{Array.from({ length: testimonials[2].rating }).map(
										(_, i) => (
											<Star
												key={i}
												className="w-5 h-5 fill-foreground text-foreground"
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
											src={testimonials[2].image || "/placeholder.svg"}
											alt={testimonials[2].name}
										/>
										<AvatarFallback>
											{testimonials[2].name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-semibold">{testimonials[2].name}</div>
										<div className="text-sm text-muted-foreground">
											{testimonials[2].role}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur">
							<CardContent className="p-8">
								<div className="flex mb-4">
									{Array.from({ length: testimonials[5].rating }).map(
										(_, i) => (
											<Star
												key={i}
												className="w-5 h-5 fill-foreground text-foreground"
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
											src={testimonials[5].image || "/placeholder.svg"}
											alt={testimonials[5].name}
										/>
										<AvatarFallback>
											{testimonials[5].name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-semibold">{testimonials[5].name}</div>
										<div className="text-sm text-muted-foreground">
											{testimonials[5].role}
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

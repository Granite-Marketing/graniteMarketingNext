import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Tag } from "@/components/ui/tag";

const testimonials = [
	{
		name: "Liyapa Sikazwe",
		role: "Founder, Dose of Venture",
		image: "/images/liyapa-sikazwe.avif",
		content:
			"Granite Marketing is both innovative and reliable. Their team took the time to understand our unique challenges and provided a customised solution that integrated with our existing tools.",
		rating: 5,
	},
	{
		name: "Nick Saraev",
		role: "Nick Saraev",
		image: "/images/nick-headshot.avif",
		content:
			"Stephen is a keen & active contributor to Make Money With Make. He consistently shared valuable insights on AI automation and delivered multiple in-depth presentations to our group of over 400.",
		rating: 5,
	},
	{
		name: "Santi Leoni",
		role: "Founder, Pulpe Sense",
		image: "/images/santi-leoni.avif",
		content:
			"Working with Stephen was an exceptionally professional experience. He's highly responsible, structured, and his communication is outstanding—even when things get challenging.",
		rating: 5,
	},
	{
		name: "Dyland Watkins",
		role: "Founder, DJW Consulting",
		image: "/images/dylan.avif",
		content:
			"Stephen is a top-notch automation expert. He not only knows the latest AI and automation but also is a full stack developer which is incredible for advanced projects.",
		rating: 5,
	},
	{
		name: "Kotada Yunus",
		role: "Founder, Aktarr",
		image: "/images/kotada.avif",
		content:
			"My team used to spend every waking moment looking for content which meant we couldn't utilise our production studio. Now we have both, great content and we're making full use of our studio space.",
		rating: 5,
	},
	{
		name: "Naill Al-Sibai",
		role: "Founder, Sib Co. Ltd",
		image: "/images/naill-al-sibai.png",
		content:
			"Granite Marketing were easy to work with and delivered to a high standard. Communication was smooth, the process was straightforward, and the final result was exactly what we had in mind. Everything was delivered one time, with no unnecessary back-and-forth. I’d happily recommend to anyone looking for a solid, reliable web build.",
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

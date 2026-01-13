import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tag } from "@/components/ui/tag";
import type { LogoItem } from "@/lib/sanity/lib/adapters";
import { LogoList } from "@/components/logo-list";

type HeroProps = {
	logos?: LogoItem[];
};

export function Hero({ logos }: HeroProps) {
	return (
		<section
			id="hero"
			className="relative py-32 px-4 md:px-8 bg-muted/30 border-b border-border/40 overflow-hidden"
		>
			<div className="absolute inset-0 z-0">
				{/* Base gradient layer */}
				<div className="absolute inset-0 bg-gradient-to-br from-background via-muted/8 to-background" />

				{/* Diagonal accent gradient */}
				<div className="absolute inset-0 bg-gradient-to-tr from-primary/3 via-transparent to-tertiary/3" />

				{/* Animated subtle glow with slow pulse */}
				<div
					className="absolute inset-0 opacity-50 animate-pulse"
					style={{
						background:
							"radial-gradient(circle at 50% 50%, oklch(0.25 0.03 180 / 0.06) 0%, transparent 60%)",
						animationDuration: "8s",
					}}
				/>
			</div>
			{/* </CHANGE> */}

			<div className="container mx-auto px-4 z-10 relative">
				<div className="max-w-4xl mx-auto text-center py-12 md:py-20 relative border border-border/50 rounded-xl p-8">
					<article className="relative z-10">
						<Tag variant="sectionLabel" className="mb-6">
							AI-Powered Automation
						</Tag>

						<h1 className="mb-8 text-balance leading-tight">
							Automate your workflows with AI
						</h1>

						<p className="text-lg md:text-xl mb-10 text-muted-foreground leading-relaxed max-w-3xl mx-auto text-balance">
							Automate the grind and focus on the growth. Building custom
							automations that work the way you do.
						</p>

						<footer className="flex flex-col items-center gap-8">
							<div className="flex flex-wrap gap-4 justify-center items-center">
								<Button
									size="lg"
									className="group relative rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
									asChild
								>
									<Link href="#contact">
										<span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer transition-all group-hover:animate-shimmer" />
										<span className="relative z-10">Get Started</span>
									</Link>
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="rounded-full px-8 bg-transparent hover:bg-primary/5 border-border/50 hover:border-primary/50 hover:text-primary transition-all duration-300 hover:scale-105"
									asChild
								>
									<Link href="#services">Services</Link>
								</Button>
							</div>

							{logos && logos.length > 0 && (
								<LogoList
									logos={logos}
									label="Trusted By"
									className="w-full max-w-3xl md:mt-6"
								/>
							)}
						</footer>
					</article>
				</div>
			</div>
		</section>
	);
}

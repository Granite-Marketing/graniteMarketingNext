import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
	return (
		<section
			id="hero"
			className="relative min-h-[85vh] flex items-center justify-center pt-16 pb-8 px-4 md:px-8 bg-background border-b border-border/40 overflow-hidden"
		>
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 bg-gradient-to-br from-background via-muted/10 to-background" />
				<div
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(circle at 50% 50%, oklch(0.2 0.03 180 / 0.08) 0%, transparent 70%)",
					}}
				/>

				<svg
					className="absolute inset-0 w-full h-full pointer-events-none"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 1400 800"
					preserveAspectRatio="xMidYMid slice"
				>
					<defs>
						<linearGradient id="neural-line" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop
								offset="0%"
								stopColor="oklch(0.4 0.02 200)"
								stopOpacity="0.15"
							/>
							<stop
								offset="50%"
								stopColor="oklch(0.45 0.03 180)"
								stopOpacity="0.25"
							/>
							<stop
								offset="100%"
								stopColor="oklch(0.4 0.02 200)"
								stopOpacity="0.15"
							/>
						</linearGradient>
					</defs>

					<g
						stroke="url(#neural-line)"
						strokeWidth="1.5"
						fill="none"
						strokeLinecap="square"
					>
						{/* Top-left - irregular branching with sharp angles */}
						<path
							d="M 520 310 L 440 310 L 440 260 L 360 260 L 320 220 L 240 180"
							opacity="0.3"
						/>
						<path
							d="M 500 330 L 420 350 L 360 340 L 300 310 L 220 280"
							opacity="0.25"
						/>

						{/* Top-right - asymmetric with obtuse and right angles */}
						<path
							d="M 880 300 L 960 300 L 1020 270 L 1080 240 L 1160 220"
							opacity="0.3"
						/>
						<path
							d="M 900 335 L 980 360 L 1040 340 L 1100 310 L 1180 290"
							opacity="0.25"
						/>
						<path
							d="M 920 315 L 1000 315 L 1000 280 L 1070 280 L 1130 250"
							opacity="0.2"
						/>

						{/* Bottom-left - organic branching pattern */}
						<path
							d="M 510 490 L 450 490 L 410 520 L 340 540 L 280 570 L 200 600"
							opacity="0.3"
						/>
						<path
							d="M 490 470 L 410 450 L 350 460 L 290 490 L 210 520"
							opacity="0.25"
						/>

						{/* Bottom-right - irregular circuit paths */}
						<path
							d="M 890 500 L 950 500 L 1010 530 L 1070 560 L 1150 590"
							opacity="0.3"
						/>
						<path
							d="M 910 475 L 990 460 L 1050 480 L 1110 510 L 1190 540"
							opacity="0.25"
						/>

						{/* Left mid-section - sparse asymmetric connections */}
						<path
							d="M 530 395 L 470 395 L 410 410 L 340 420 L 260 440"
							opacity="0.2"
						/>

						{/* Right mid-section - varied angle branches */}
						<path
							d="M 870 405 L 930 405 L 990 390 L 1060 380 L 1140 360"
							opacity="0.2"
						/>

						{/* Diagonal branch - top left */}
						<path d="M 460 300 L 430 280 L 400 250 L 370 210" opacity="0.2" />

						{/* Diagonal branch - bottom right with angles */}
						<path d="M 940 510 L 970 530 L 1000 560 L 1030 590" opacity="0.2" />
					</g>

					<g fill="oklch(0.5 0.04 180)">
						{/* Safe zone boundary nodes */}
						<circle cx="520" cy="310" r="3" opacity="0.4" />
						<circle cx="880" cy="300" r="3" opacity="0.4" />
						<circle cx="510" cy="490" r="3" opacity="0.4" />
						<circle cx="890" cy="500" r="3" opacity="0.4" />

						{/* Junction nodes - at path intersections */}
						<circle cx="440" cy="310" r="2.5" opacity="0.35" />
						<circle cx="960" cy="300" r="2.5" opacity="0.35" />
						<circle cx="450" cy="490" r="2.5" opacity="0.35" />
						<circle cx="950" cy="500" r="2.5" opacity="0.35" />

						{/* Peripheral endpoint nodes */}
						<circle cx="240" cy="180" r="3" opacity="0.3" />
						<circle cx="1160" cy="220" r="3" opacity="0.3" />
						<circle cx="200" cy="600" r="3" opacity="0.3" />
						<circle cx="1150" cy="590" r="3" opacity="0.3" />
						<circle cx="260" cy="440" r="2.5" opacity="0.25" />
						<circle cx="1140" cy="360" r="2.5" opacity="0.25" />
					</g>

					<g fill="oklch(0.55 0.06 170)">
						{/* Animated node 1 - top-left diagonal path */}
						<circle cx="520" cy="310" r="3">
							<animateMotion
								path="M 520 310 L 440 310 L 440 260 L 360 260 L 320 220 L 240 180"
								dur="8s"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="r"
								values="3;5;3"
								dur="2.5s"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="opacity"
								values="0.4;0.7;0.4"
								dur="2.5s"
								repeatCount="indefinite"
							/>
						</circle>

						{/* Animated node 2 - bottom-right organic path */}
						<circle cx="890" cy="500" r="3">
							<animateMotion
								path="M 890 500 L 950 500 L 1010 530 L 1070 560 L 1150 590"
								dur="7.5s"
								begin="1.2s"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="r"
								values="3;5;3"
								dur="2.8s"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="opacity"
								values="0.4;0.7;0.4"
								dur="2.8s"
								repeatCount="indefinite"
							/>
						</circle>

						{/* Animated node 3 - top-right angular path */}
						<circle cx="880" cy="300" r="3">
							<animateMotion
								path="M 880 300 L 960 300 L 1020 270 L 1080 240 L 1160 220"
								dur="7s"
								begin="2s"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="r"
								values="3;5;3"
								dur="2.3s"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="opacity"
								values="0.4;0.7;0.4"
								dur="2.3s"
								repeatCount="indefinite"
							/>
						</circle>

						{/* Animated node 4 - bottom-left irregular path */}
						<circle cx="510" cy="490" r="3">
							<animateMotion
								path="M 510 490 L 450 490 L 410 520 L 340 540 L 280 570 L 200 600"
								dur="8.5s"
								begin="0.8s"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="r"
								values="3;5;3"
								dur="2.6s"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="opacity"
								values="0.4;0.7;0.4"
								dur="2.6s"
								repeatCount="indefinite"
							/>
						</circle>
					</g>
				</svg>
			</div>

			<div className="container mx-auto px-4 z-10 relative">
				<div className="max-w-4xl mx-auto text-center p-12 md:p-16 my-8 relative">
					<div className="relative z-10">
						<h1 className="mb-8 text-balance leading-tight relative">
							<span className="absolute inset-0 blur-3xl opacity-15 bg-gradient-to-r from-primary/30 via-tertiary/30 to-primary/30" />
							<span className="relative">Automate your workflows with AI</span>
						</h1>
						<p className="text-lg mb-10 text-muted-foreground leading-relaxed mx-auto text-pretty max-w-xl">
							Automate the grind and focus on the growth. Building custom
							automations that work the way you do.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<Button
								size="lg"
								className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
								asChild
							>
								<Link href="#contact">Start</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="rounded-full px-8 bg-transparent hover:bg-primary/5 border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105"
								asChild
							>
								<Link href="#services">Learn</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

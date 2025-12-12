"use client";

import Link from "next/link";
import {
	PlusIcon,
	AirtableIcon,
	N8nIcon,
	NotionIcon,
} from "@/components/icons";

export default function Hero() {
	return (
		<section
			className="relative min-h-screen flex items-center pt-24"
			aria-labelledby="hero-heading"
		>
			<div className="px-6 padding-section-large relative z-10 w-full">
				<div className="container text-center  mx-auto">
					<h1 id="hero-heading" className="heading-style-h1 mb-6">
						Build custom AI workflows that{" "}
						<span className="text-brand-green">scale</span> with your business
					</h1>

					<p className="text-size-medium text-weight-medium text-color-white max-w-2xl mx-auto mb-8">
						We help founders, marketers, and operators optimise their tech stack
						using powerful no-code and low-code automations.
					</p>

					<div className="flex justify-center gap-4 mb-12">
						<Link
							href="#contact-form"
							className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-light text-black font-medium px-6 py-3 rounded-lg transition-colors"
						>
							<PlusIcon size={20} />
							<span>Get Started</span>
						</Link>
					</div>

					{/* Floating Icons - decorative */}
					<div className="relative h-24 md:h-32" aria-hidden="true">
						<div className="absolute left-[10%] top-0 w-16 h-16 md:w-20 md:h-20 animate-float-slow opacity-80">
							<AirtableIcon size={80} className="w-full h-full" />
						</div>
						<div className="absolute left-1/2 -translate-x-1/2 top-4 w-16 h-16 md:w-20 md:h-20 animate-float opacity-80">
							<N8nIcon size={80} className="w-full h-full" />
						</div>
						<div className="absolute right-[10%] top-0 w-16 h-16 md:w-20 md:h-20 animate-float-slow opacity-80 hidden md:block">
							<NotionIcon size={80} className="w-full h-full" />
						</div>
					</div>
				</div>
			</div>

			{/* Background Pattern - decorative */}
			<div
				className="absolute inset-0 overflow-hidden pointer-events-none"
				aria-hidden="true"
			>
				<div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-90" />
				<div
					className="absolute inset-0 opacity-20"
					style={{
						backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
						backgroundSize: "40px 40px",
					}}
				/>
			</div>

			<style jsx>{`
				@keyframes float {
					0%,
					100% {
						transform: translateY(0) translateX(-50%);
					}
					50% {
						transform: translateY(-20px) translateX(-50%);
					}
				}
				@keyframes float-slow {
					0%,
					100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-15px);
					}
				}
				.animate-float {
					animation: float 6s ease-in-out infinite;
				}
				.animate-float-slow {
					animation: float-slow 8s ease-in-out infinite;
				}
			`}</style>
		</section>
	);
}

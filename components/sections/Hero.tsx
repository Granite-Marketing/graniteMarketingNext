import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
	return (
		<section id="hero" className="px-[5%] py-12 md:py-16 lg:py-20">
			<div className="container">
				<header className="relative flex min-h-[32rem] flex-col items-center justify-center border border-border-primary p-8 text-center md:min-h-[40rem] md:p-16">
					<div className="w-full max-w-lg">
						<h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
							Automate your workflows with AI
						</h1>
						<p className="md:text-md">
							Build custom automations that work the way you do. No code
							required, just results that matter.
						</p>
					</div>
					<div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
						<Button title="Start" variant="primary" asChild>
							<Link href="/contact-us">Start</Link>
						</Button>
						<Button title="Learn" variant="secondary" asChild>
							<Link href="/#services">Learn</Link>
						</Button>
					</div>
				</header>
			</div>
		</section>
	);
}

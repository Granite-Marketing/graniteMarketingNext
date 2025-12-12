import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
	return (
		<main>
			<section className="px-[5%] py-16 md:py-24 lg:py-28">
				<div className="container">
					<div className="mx-auto max-w-lg text-center">
						<h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
							404
						</h1>
						<p className="mb-8 text-lg md:text-xl">
							The page you're looking for doesn't exist.
						</p>
						<Button variant="primary" asChild>
							<Link href="/">Go home</Link>
						</Button>
					</div>
				</div>
			</section>
		</main>
	);
}

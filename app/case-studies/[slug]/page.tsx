import React from "react";
import type { Metadata } from "next";

interface CaseStudyPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: CaseStudyPageProps): Promise<Metadata> {
	const { slug } = await params;
	return {
		title: `${slug} | Case Study`,
		description: "Read about our automation case study",
	};
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
	const { slug } = await params;

	return (
		<main>
			<section className="px-[5%] py-16 md:py-24 lg:py-28">
				<div className="container">
					<article className="mx-auto max-w-lg">
						<h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
							Case Study: {slug}
						</h1>
						<div className="prose md:prose-md lg:prose-lg">
							<p>Case study content will be loaded from Sanity CMS.</p>
						</div>
					</article>
				</div>
			</section>
		</main>
	);
}

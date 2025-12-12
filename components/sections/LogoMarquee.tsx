import React from "react";

const logos = [
	{
		src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
		alt: "Webflow logo",
	},
	{
		src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg",
		alt: "Relume logo",
	},
	{
		src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
		alt: "Webflow logo",
	},
	{
		src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg",
		alt: "Relume logo",
	},
	{
		src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
		alt: "Webflow logo",
	},
	{
		src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg",
		alt: "Relume logo",
	},
	{
		src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
		alt: "Webflow logo",
	},
	{
		src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg",
		alt: "Relume logo",
	},
	{
		src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
		alt: "Webflow logo",
	},
	{
		src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg",
		alt: "Relume logo",
	},
	{
		src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
		alt: "Webflow logo",
	},
];

export function LogoMarquee() {
	return (
		<section id="partners" className="px-[5%] py-12 md:py-16 lg:py-20">
			<div className="container">
				<h2 className="mx-auto mb-6 w-full max-w-lg text-center text-base font-bold leading-[1.2] md:mb-8 md:text-md md:leading-[1.2]">
					Built on the tools that power modern business
				</h2>
				<ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pb-2 pt-4 md:pt-2">
					{logos.map((logo, index) => (
						<li key={index}>
							<img
								src={logo.src}
								alt={logo.alt}
								className="max-h-12 md:max-h-14"
							/>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

import Link from "next/link";
import Image from "next/image";
import { NavigationClient } from "./navigation-client";

export function Navigation() {
	const logo = (
		<Link
			href="/"
			className="flex items-center rounded-full border border-border/60 overflow-hidden"
		>
			<Image
				src="/images/granite-marketing-new-logo.png"
				alt="Logo brand logo for Granite Marketing. The logo is a simple, modern, and clean logo that is easy to recognize and remember."
				width={48}
				height={48}
				className="w-12 h-12 object-contain"
			/>
		</Link>
	);

	return <NavigationClient logo={logo} />;
}

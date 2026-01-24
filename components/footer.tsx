import Image from "next/image";
import { FooterClient } from "./footer-client";

export function Footer() {
	const logo = (
		<Image
			src="/images/granite-marketing-new-logo.png"
			alt="Logo brand logo for Granite Marketing. The logo is a simple, modern, and clean logo that is easy to recognize and remember."
			width={48}
			height={48}
			className="w-12 h-12 object-contain"
		/>
	);

	return <FooterClient logo={logo} />;
}

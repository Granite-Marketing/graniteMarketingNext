import Link from "next/link";
import Image from "next/image";
import { BrandMark } from "./brand-mark";
import { complianceLinks, footerColumns } from "./data";

export function RelayFooter() {
	return (
		<footer className="border-t border-relay-line">
			<div className="mx-auto container px-6">
				<div className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
					<div>
						<Link href="/" className="inline-block">
							<BrandMark />
							<span className="sr-only">Granite Marketing home</span>
						</Link>
						<p className="mt-4 max-w-64 text-sm leading-relaxed text-relay-faint">
							AI-powered workflow automation for teams who&apos;d rather grow
							the business than run it by hand.
						</p>
					</div>

					{footerColumns.map((column) => (
						<nav key={column.heading} aria-label={column.heading}>
							<h2 className="mb-4.5 font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-relay-faint">
								{column.heading}
							</h2>
							<ul className="flex flex-col gap-0.5">
								{column.links.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											className="inline-block py-1.5 text-sm text-relay-body transition-colors hover:text-relay-cyan"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					))}
				</div>

				{/* Wise compliance bar: wording, card logos and policy links must stay intact. */}
				<div className="flex flex-col items-center justify-between gap-4 border-t border-relay-line py-6 text-sm text-relay-faint md:flex-row">
					<div className="flex items-center gap-4">
						<span>
							© {new Date().getFullYear()} Granite Marketing. All rights
							reserved.
						</span>
						<div className="flex items-center gap-2">
							<Image
								src="/images/logos/visa.svg"
								alt="Visa accepted"
								width={40}
								height={26}
								className="h-6 w-auto"
							/>
							<Image
								src="/images/logos/mastercard.svg"
								alt="Mastercard accepted"
								width={40}
								height={26}
								className="h-6 w-auto"
							/>
						</div>
					</div>
					<ul className="flex flex-wrap gap-6">
						{complianceLinks.map((link) => (
							<li key={link.label}>
								<Link
									href={link.href}
									className="transition-colors hover:text-relay-cyan"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</footer>
	);
}

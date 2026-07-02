import Link from "next/link";
import Image from "next/image";
import { CalButton } from "./cal-button";
import { WorkflowDiagram } from "./workflow-diagram";
import { urlFor } from "@/lib/sanity/client";

type ClientLogo = {
	_id: string;
	clientName: string;
	logo: { asset: any; alt?: string } | null;
	website?: string;
};

type RelayHeroProps = {
	clientLogos?: ClientLogo[];
};

export function RelayHero({ clientLogos = [] }: RelayHeroProps) {
	return (
		<section aria-labelledby="hero-heading" className="overflow-hidden">
			<div className="mx-auto grid container items-center gap-14 px-6 pb-20 pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:pt-40">
				<div className="animate-relay-rise" style={{ animationDelay: "0.1s" }}>
					<p className="mb-5 font-mono text-[13px] text-relay-cyan">
						{"// workflow automation, done for you"}
					</p>
					<h1
						id="hero-heading"
						className="text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-relay-ink sm:text-5xl lg:text-[3.4rem]"
					>
						We connect your tools into workflows that run themselves.
					</h1>
					<p className="mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-relay-body">
						Custom AI automations built on n8n and wired into the stack you
						already use. They qualify leads, move projects, draft content and
						brief you while you sleep.
					</p>

					<div className="mt-9 flex flex-wrap items-center gap-5">
						<CalButton size="lg">Book an intro call</CalButton>
						<Link
							href="/#services"
							className="rounded border border-relay-line px-5 py-3 font-mono text-[13px] text-relay-faint transition-colors hover:border-relay-cyan hover:text-relay-ink"
						>
							See what we build ↓
						</Link>
					</div>

					{clientLogos.length > 0 && (
						<div className="mt-12 flex flex-wrap items-center gap-6">
							<span className="font-mono text-[11px] uppercase tracking-[0.16em] text-relay-faint">
								Trusted by
							</span>
							<ul className="flex flex-wrap items-center gap-6" aria-label="Clients we work with">
								{clientLogos.map((client) => (
									<li key={client._id} className="opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0">
										{client.logo?.asset && (
											<Image
												src={urlFor(client.logo.asset)}
												alt={client.logo.alt || client.clientName}
												width={100}
												height={28}
												className="h-5 w-auto"
											/>
										)}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>

				<div className="animate-relay-rise" style={{ animationDelay: "0.3s" }}>
					<figure className="overflow-hidden rounded-lg border border-relay-line bg-relay-panel">
						<figcaption className="flex items-center justify-between border-b border-relay-line px-4 py-3 font-mono text-xs text-relay-faint">
							<span>lead-qualification.n8n</span>
							<span className="flex items-center gap-2 text-relay-cyan">
								<span
									aria-hidden="true"
									className="size-[7px] animate-relay-blink rounded-full bg-relay-cyan"
								/>
								live
							</span>
						</figcaption>
						<WorkflowDiagram />
						<p className="border-t border-relay-line px-4 py-3 font-mono text-[11px] text-relay-faint">
							last run 12s ago · 4,183 executions this month · 0 failures
						</p>
					</figure>
				</div>
			</div>
		</section>
	);
}

"use client";

import { CalButton } from "./cal-button";

const inputClass =
	"w-full rounded border border-relay-line bg-relay-bg px-3.5 py-2.5 text-sm text-relay-ink transition-colors placeholder:text-relay-faint/60 focus:border-relay-cyan focus:outline-none";

const labelClass = "mb-2 block font-mono text-xs text-relay-faint";

const inquiryOptions = [
	"Workflow optimization",
	"New automation build",
	"Integration support",
	"Technical consultation",
	"General inquiry",
	"Other",
];

export function RelayContact() {
	return (
		<section aria-labelledby="contact-heading" className="pt-32 pb-24">
			<div className="container mx-auto px-6">
				<header className="max-w-2xl">
					<p className="mb-4 font-mono text-[13px] text-relay-cyan">
						{"// contact"}
					</p>
					<h1
						id="contact-heading"
						className="text-balance text-4xl font-semibold tracking-tight text-relay-ink sm:text-5xl"
					>
						Let's start a conversation.
					</h1>
					<p className="mt-4 max-w-xl text-pretty leading-relaxed text-relay-body">
						Reach out to discuss your automation needs and discover how we
						can help streamline your operations.
					</p>
				</header>

				<div className="relative mt-13 overflow-hidden rounded-xl border border-relay-line bg-relay-panel">
					<p className="flex items-center justify-between border-b border-relay-line px-5 py-3 font-mono text-xs text-relay-faint">
						<span>contact-form.n8n</span>
						<span className="flex items-center gap-2 text-relay-cyan">
							<span
								aria-hidden="true"
								className="size-1.5 animate-relay-blink rounded-full bg-relay-cyan"
							/>
							trigger: you
						</span>
					</p>

					<div
						aria-hidden="true"
						className="pointer-events-none absolute -bottom-56 left-1/2 h-96 w-[40rem] -translate-x-1/2 animate-relay-breathe rounded-full bg-[radial-gradient(closest-side,rgba(63,198,220,0.14),transparent_72%)]"
					/>

					<form
						className="relative mx-auto max-w-2xl px-6 py-14 sm:py-16"
						// TODO: wire to an n8n webhook before launch; submissions
						// currently stay on the page.
						onSubmit={(event) => event.preventDefault()}
					>
						<div className="grid gap-5 sm:grid-cols-2">
							<div>
								<label htmlFor="contact-first-name" className={labelClass}>
									first name
								</label>
								<input
									id="contact-first-name"
									name="firstName"
									autoComplete="given-name"
									required
									className={inputClass}
								/>
							</div>
							<div>
								<label htmlFor="contact-last-name" className={labelClass}>
									last name
								</label>
								<input
									id="contact-last-name"
									name="lastName"
									autoComplete="family-name"
									className={inputClass}
								/>
							</div>
							<div>
								<label htmlFor="contact-email" className={labelClass}>
									email
								</label>
								<input
									id="contact-email"
									name="email"
									type="email"
									autoComplete="email"
									required
									className={inputClass}
								/>
							</div>
							<div>
								<label htmlFor="contact-phone" className={labelClass}>
									phone (optional)
								</label>
								<input
									id="contact-phone"
									name="phone"
									type="tel"
									autoComplete="tel"
									className={inputClass}
								/>
							</div>
							<div className="sm:col-span-2">
								<label htmlFor="contact-inquiry" className={labelClass}>
									what's your inquiry about
								</label>
								<select
									id="contact-inquiry"
									name="inquiry"
									defaultValue=""
									className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%237c8da0%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[position:right_0.875rem_center] bg-no-repeat pr-10`}
								>
									<option value="" disabled>
										Select one...
									</option>
									{inquiryOptions.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
							</div>
							<div className="sm:col-span-2">
								<label htmlFor="contact-message" className={labelClass}>
									message
								</label>
								<textarea
									id="contact-message"
									name="message"
									rows={5}
									required
									placeholder="Tell us about your project..."
									className={`${inputClass} resize-none`}
								/>
							</div>
						</div>

						<label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-relay-body">
							<input
								type="checkbox"
								name="terms"
								required
								className="mt-0.5 size-4 shrink-0 cursor-pointer accent-relay-cyan"
							/>
							<span>
								I agree to the{" "}
								<a
									href="/terms"
									target="_blank"
									rel="noopener noreferrer"
									className="underline underline-offset-2 transition-colors hover:text-relay-ink"
								>
									Terms of Service
								</a>{" "}
								and{" "}
								<a
									href="/refund-policy"
									target="_blank"
									rel="noopener noreferrer"
									className="underline underline-offset-2 transition-colors hover:text-relay-ink"
								>
									Refund Policy
								</a>
							</span>
						</label>

						<div className="mt-9 flex flex-wrap items-center gap-5">
							<button
								type="submit"
								className="cursor-pointer rounded bg-relay-cyan px-6 py-3.5 font-mono text-[13px] font-semibold text-relay-bg transition-all hover:bg-relay-bright hover:shadow-[0_0_28px_rgba(63,198,220,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-relay-cyan"
							>
								Send message
							</button>
							<CalButton className="border border-relay-line bg-transparent font-normal text-relay-faint hover:border-relay-cyan hover:bg-transparent hover:text-relay-ink hover:shadow-none px-5 py-3 text-[13px]">
								or book an intro call
							</CalButton>
						</div>

						<p className="mt-8 font-mono text-[11px] text-relay-faint">
							avg. response time: same day · first build live in ~3 weeks
						</p>
					</form>
				</div>
			</div>
		</section>
	);
}

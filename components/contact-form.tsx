"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function ContactForm() {
	return (
		<section
			id="contact"
			className="py-24 bg-gradient-to-b from-background via-muted/5 to-background relative overflow-hidden"
		>
			<div className="absolute inset-0 opacity-[0.015]">
				<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern
							id="contact-grid"
							x="0"
							y="0"
							width="60"
							height="60"
							patternUnits="userSpaceOnUse"
						>
							<path
								d="M 60 0 L 0 0 0 60"
								fill="none"
								stroke="currentColor"
								strokeWidth="1"
							/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#contact-grid)" />
				</svg>
			</div>

			<div className="container mx-auto px-4 relative">
				<div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
					<div className="relative">
						<div className="absolute -inset-4 bg-gradient-to-br from-primary/5 to-tertiary/5 rounded-3xl blur-3xl" />
						<div className="relative backdrop-blur-sm bg-card/30 border border-border/30 rounded-2xl p-8">
							<p className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
								Send
							</p>
							<h2 className="text-4xl md:text-5xl font-normal mb-6 text-balance">
								Your message
							</h2>
							<p className="text-lg text-muted-foreground mb-8 leading-relaxed">
								Fill in the details below and we'll respond quickly
							</p>

							<div className="space-y-6">
								<div className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors duration-300">
									<div className="text-muted-foreground">✉</div>
									<div>
										<div className="font-medium">
											hello@granitemarketing.co.uk
										</div>
									</div>
								</div>
								<div className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors duration-300">
									<div className="text-muted-foreground">📞</div>
									<div>
										<div className="font-medium">+44 (0) 20 1234</div>
									</div>
								</div>
								<div className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors duration-300">
									<div className="text-muted-foreground">📍</div>
									<div>
										<div className="font-medium">
											Unit 5, 42 Brick Lane, London E1 6RF
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-6">
						<div className="grid md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor="firstName" className="text-sm mb-2 block">
									First name
								</Label>
								<Input
									id="firstName"
									className="bg-background focus:ring-2 focus:ring-primary/50"
								/>
							</div>
							<div>
								<Label htmlFor="lastName" className="text-sm mb-2 block">
									Last name
								</Label>
								<Input
									id="lastName"
									className="bg-background focus:ring-2 focus:ring-primary/50"
								/>
							</div>
						</div>

						<div className="grid md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor="email" className="text-sm mb-2 block">
									Email
								</Label>
								<Input
									id="email"
									type="email"
									className="bg-background focus:ring-2 focus:ring-primary/50"
								/>
							</div>
							<div>
								<Label htmlFor="phone" className="text-sm mb-2 block">
									Phone number
								</Label>
								<Input
									id="phone"
									type="tel"
									className="bg-background focus:ring-2 focus:ring-primary/50"
								/>
							</div>
						</div>

						<div>
							<Label htmlFor="inquiry" className="text-sm mb-2 block">
								What's your inquiry about
							</Label>
							<Select>
								<SelectTrigger
									id="inquiry"
									className="bg-background focus:ring-2 focus:ring-primary/50"
								>
									<SelectValue placeholder="Select one..." />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="workflow">
										Workflow optimization
									</SelectItem>
									<SelectItem value="integration">
										Integration support
									</SelectItem>
									<SelectItem value="consultation">
										Technical consultation
									</SelectItem>
									<SelectItem value="general">General inquiry</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label className="text-sm mb-3 block">
								What describes your situation
							</Label>
							<div className="grid md:grid-cols-2 gap-3">
								<div className="flex items-center space-x-2">
									<Checkbox
										id="workflow"
										className="focus:ring-2 focus:ring-primary/50"
									/>
									<label htmlFor="workflow" className="text-sm cursor-pointer">
										Workflow optimization
									</label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										id="automation"
										className="focus:ring-2 focus:ring-primary/50"
									/>
									<label
										htmlFor="automation"
										className="text-sm cursor-pointer"
									>
										New automation build
									</label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										id="support"
										className="focus:ring-2 focus:ring-primary/50"
									/>
									<label htmlFor="support" className="text-sm cursor-pointer">
										Integration support
									</label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										id="consultation"
										className="focus:ring-2 focus:ring-primary/50"
									/>
									<label
										htmlFor="consultation"
										className="text-sm cursor-pointer"
									>
										Technical consultation
									</label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										id="inquiry"
										className="focus:ring-2 focus:ring-primary/50"
									/>
									<label htmlFor="inquiry" className="text-sm cursor-pointer">
										General inquiry
									</label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										id="other"
										className="focus:ring-2 focus:ring-primary/50"
									/>
									<label htmlFor="other" className="text-sm cursor-pointer">
										Other
									</label>
								</div>
							</div>
						</div>

						<div>
							<Label htmlFor="message" className="text-sm mb-2 block">
								Message
							</Label>
							<Textarea
								id="message"
								placeholder="Tell us about your project..."
								rows={5}
								className="bg-background resize-none focus:ring-2 focus:ring-primary/50"
							/>
						</div>

						<div className="flex items-center space-x-2">
							<Checkbox
								id="terms"
								className="focus:ring-2 focus:ring-primary/50"
							/>
							<label htmlFor="terms" className="text-sm cursor-pointer">
								I agree to the terms
							</label>
						</div>

						<Button
							type="submit"
							size="lg"
							className="rounded-full px-8 bg-primary text-white hover:bg-primary/80"
						>
							Send
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}

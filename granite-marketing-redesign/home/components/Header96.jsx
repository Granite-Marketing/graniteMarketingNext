"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";

export function Header96() {
	return (
		<section id="relume" className="px-[5%] py-12 md:py-16 lg:py-20">
			<div className="container">
				<div className="relative flex min-h-[32rem] flex-col items-center justify-center border border-border-primary p-8 text-center md:min-h-[40rem] md:p-16">
					<div className="w-full max-w-lg">
						<h1 className="mb-5 text-6xl font-bold md:mb-6 text-red-500">
							Automate your workflows with AI
						</h1>
						<p className="md:text-md">
							Build custom automations that work the way you do. No code
							required, just results that matter.
						</p>
					</div>
					<div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
						<Button title="Start" variant="primary">
							Start
						</Button>
						<Button title="Learn" variant="secondary">
							Learn
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}

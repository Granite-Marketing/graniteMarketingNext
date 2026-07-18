"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type WireTool = {
	id: string;
	name: string;
	logoUrl: string | null;
};

const SLOT_COUNT = 6;
const SWAP_EVERY_MS = 2600;
const FADE_MS = 320;

/** Visibility per slot so the wire never wraps on small screens. */
const SLOT_VISIBILITY = [
	"flex",
	"flex",
	"flex",
	"hidden sm:flex",
	"hidden lg:flex",
	"hidden lg:flex",
];

/**
 * A fixed row of nodes on a wire. At random intervals one node
 * fades out, a different tool from the pool fades in, and the
 * node flashes cyan like a workflow step re-executing.
 */
export function ToolWire({ tools }: { tools: WireTool[] }) {
	const [slots, setSlots] = useState<number[]>(() =>
		Array.from({ length: Math.min(SLOT_COUNT, tools.length) }, (_, i) => i),
	);
	const [fadingSlot, setFadingSlot] = useState<number | null>(null);

	useEffect(() => {
		if (tools.length <= SLOT_COUNT) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const timeouts: ReturnType<typeof setTimeout>[] = [];
		const interval = setInterval(() => {
			const slot = Math.floor(Math.random() * SLOT_COUNT);
			setFadingSlot(slot);
			timeouts.push(
				setTimeout(() => {
					setSlots((prev) => {
						const used = new Set(prev);
						const candidates = tools
							.map((_, i) => i)
							.filter((i) => !used.has(i));
						if (candidates.length === 0) return prev;
						const next =
							candidates[Math.floor(Math.random() * candidates.length)];
						const copy = [...prev];
						copy[slot] = next;
						return copy;
					});
					setFadingSlot(null);
				}, FADE_MS),
			);
		}, SWAP_EVERY_MS);

		return () => {
			clearInterval(interval);
			timeouts.forEach(clearTimeout);
		};
	}, [tools]);

	return (
		<div className="relative">
			<div
				aria-hidden="true"
				className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-relay-line"
			/>
			<div
				aria-hidden="true"
				className="absolute top-1/2 h-px w-24 -translate-y-1/2 animate-relay-rail bg-gradient-to-r from-transparent via-relay-cyan to-transparent"
			/>
			<ul className="relative flex items-center justify-between gap-6">
				{slots.map((toolIndex, slot) => {
					const tool = tools[toolIndex];
					return (
						<li
							key={slot}
							className={`${SLOT_VISIBILITY[slot] ?? "flex"} min-h-12 w-36 items-center justify-center gap-3 rounded-md border border-relay-line bg-relay-panel px-3 py-3 transition-[opacity,transform] duration-300 lg:w-44 ${
								fadingSlot === slot
									? "translate-y-1.5 opacity-0"
									: "translate-y-0 opacity-100"
							}`}
						>
							{tool.logoUrl && (
								<Image
									src={tool.logoUrl}
									alt=""
									width={24}
									height={24}
									className="size-6 shrink-0 object-contain"
								/>
							)}
							<span className="truncate font-mono text-xs text-relay-body">
								{tool.name}
							</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

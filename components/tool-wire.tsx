"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useIsPresentationTool } from "next-sanity/hooks";

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

	// Only six of the tool pool are on the wire at once, and rotating one
	// swaps which tool documents exist in the DOM. Presentation builds its
	// "Documents on this page" panel by scanning stega-encoded content, so on
	// the live site that rotation is the effect — inside Presentation it is a
	// panel that flashes every 2.6s while an editor is trying to read it.
	//
	// Freezing the rotation here rather than rendering every tool and hiding
	// the extras: the hidden-extras version would change the homepage's
	// server-rendered HTML, which the U6 baseline pins byte-for-byte, and it
	// would put duplicate tool names in the accessibility tree. Visitors keep
	// the animation; only the editing surface goes still.
	const isPresentationTool = useIsPresentationTool();

	// Live edits in Presentation can shrink `tools` (an editor removes a tool
	// from the block, or `resolveDataBlockItems`'s `compact()` drops a
	// reference that no longer resolves). `slots` holds indices into `tools`
	// seeded at mount and otherwise only touched by the rotation swap below,
	// which itself is frozen inside Presentation — so a shrink can leave
	// stale indices pointing past the end of the array forever. Reclamp
	// whenever the pool shrinks below the highest index currently held.
	useEffect(() => {
		if (tools.length === 0) return;
		setSlots((prev) => {
			const maxIndex = tools.length - 1;
			if (prev.every((i) => i <= maxIndex)) return prev;
			return prev.map((i) => Math.min(i, maxIndex));
		});
	}, [tools.length]);

	useEffect(() => {
		if (tools.length <= SLOT_COUNT) return;
		// `null` means "still resolving". Treating that as false would let one
		// swap through before it settles — a single flash instead of a
		// continuous one, which is harder to spot and no more correct.
		if (isPresentationTool !== false) return;
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
		// isPresentationTool resolves from null after mount, so it has to be a
		// dependency: without it the effect keeps its first (null) reading and
		// rotation never starts for real visitors.
	}, [tools, isPresentationTool]);

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
					if (!tool) return null;
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

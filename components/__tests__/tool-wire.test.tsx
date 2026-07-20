import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, act } from "@testing-library/react";

// jsdom ships no matchMedia. The component reads it to honour
// prefers-reduced-motion, so without this every test here fails on a missing
// function rather than on the behaviour being tested. Defaults to "motion is
// fine" so rotation is enabled unless a test says otherwise.
beforeEach(() => {
	vi.stubGlobal(
		"matchMedia",
		vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn() })
	);
});

// The bug this covers: the wire shows 6 tools at a time out of a larger pool
// and rotates one every 2.6s. Presentation builds its "Documents on this
// page" list by scanning stega-encoded content in the DOM, so a rotating
// slot makes tool documents genuinely enter and leave that list — the panel
// flashes continuously while an editor is trying to work.
//
// The fix freezes rotation inside Presentation only. It is NOT "render every
// tool and hide the extras": that would change the homepage's server-rendered
// HTML, which the U6 baseline pins byte-for-byte.
const useIsPresentationTool = vi.fn<() => boolean | null>();
vi.mock("next-sanity/hooks", () => ({
	useIsPresentationTool: () => useIsPresentationTool(),
}));

import { ToolWire, type WireTool } from "../tool-wire";

// Nine tools against six slots — rotation only runs when the pool is larger
// than the slot count, so a smaller fixture would pass for the wrong reason.
const TOOLS: WireTool[] = Array.from({ length: 9 }, (_, i) => ({
	id: `tool-${i}`,
	name: `Tool ${i}`,
	logoUrl: null,
}));

function renderedToolNames(): string[] {
	return screen
		.getAllByRole("listitem")
		.map((li) => li.textContent?.trim() ?? "");
}

afterEach(() => {
	cleanup();
	vi.useRealTimers();
	vi.clearAllMocks();
});

describe("ToolWire", () => {
	it("holds the tool set steady inside Presentation", () => {
		vi.useFakeTimers();
		useIsPresentationTool.mockReturnValue(true);

		render(<ToolWire tools={TOOLS} />);
		const before = renderedToolNames();

		// Well past several rotation intervals.
		act(() => {
			vi.advanceTimersByTime(30_000);
		});

		expect(renderedToolNames()).toEqual(before);
	});

	it("rotates tools when the hook reports it is not in Presentation", () => {
		vi.useFakeTimers();
		useIsPresentationTool.mockReturnValue(false);

		render(<ToolWire tools={TOOLS} />);
		const before = renderedToolNames();

		act(() => {
			vi.advanceTimersByTime(30_000);
		});

		// The animation is the point of this component for real visitors, so a
		// fix that quietly froze it everywhere would be a regression, not a fix.
		expect(renderedToolNames()).not.toEqual(before);
	});

	it("rotates tools when the environment never resolves (the live site)", () => {
		vi.useFakeTimers();
		// This is the case that matters, and the one the suite previously got
		// backwards. `null` is not a brief resolving window on the public site
		// — it is permanent. useIsPresentationTool reads a store written only
		// by <SanityLive />, and app/layout.tsx mounts that behind
		// `isDraftMode`, so an ordinary visitor never leaves 'checking'.
		//
		// The old test mocked `null` and asserted stillness, on the assumption
		// that null was transient. It passed, and it pinned the bug: the
		// homepage tool wire was frozen in production for every visitor while
		// the suite stayed green.
		useIsPresentationTool.mockReturnValue(null);

		render(<ToolWire tools={TOOLS} />);
		const before = renderedToolNames();

		act(() => {
			vi.advanceTimersByTime(30_000);
		});

		expect(renderedToolNames()).not.toEqual(before);
	});

	it("stops rotating once the environment resolves to Presentation", () => {
		vi.useFakeTimers();
		// The bounded window the fix deliberately accepts: rotation runs while
		// the comlink handshake is outstanding, then must stop for good once
		// the hook reports `true`. This is what keeps the Documents panel from
		// flashing continuously while an editor works.
		useIsPresentationTool.mockReturnValue(null);

		const { rerender } = render(<ToolWire tools={TOOLS} />);

		useIsPresentationTool.mockReturnValue(true);
		rerender(<ToolWire tools={TOOLS} />);

		const afterResolve = renderedToolNames();
		act(() => {
			vi.advanceTimersByTime(30_000);
		});

		expect(renderedToolNames()).toEqual(afterResolve);
	});

	it("renders one node per slot, not one per tool", () => {
		useIsPresentationTool.mockReturnValue(false);

		render(<ToolWire tools={TOOLS} />);

		// Guards the rejected fix: rendering all nine would change the
		// homepage's server HTML and break the byte-comparison baseline.
		expect(screen.getAllByRole("listitem")).toHaveLength(6);
	});

	// The bug: `slots` is seeded once at mount from the initial `tools.length`
	// and only otherwise written by the rotation swap, which early-returns
	// whenever `tools.length <= SLOT_COUNT`. A live edit in Sanity Presentation
	// that removes a tool document shrinks `tools` via `compact()` in
	// resolve-data-block.ts, leaving a stale out-of-range index in `slots`.
	// `tools[toolIndex]` is then `undefined` and `tool.logoUrl` throws.
	it("does not throw when a live edit shrinks the tools array below the mounted slot indices", () => {
		useIsPresentationTool.mockReturnValue(false);

		const { rerender } = render(<ToolWire tools={TOOLS} />);

		// Shrink well below SLOT_COUNT (6) so every slot index from the initial
		// mount is now out of range.
		const shrunk = TOOLS.slice(0, 2);

		expect(() => {
			rerender(<ToolWire tools={shrunk} />);
		}).not.toThrow();
	});

	it("clamps stale slots to valid tools after a shrink, leaving no blank slot", () => {
		useIsPresentationTool.mockReturnValue(false);

		const { rerender } = render(<ToolWire tools={TOOLS} />);

		const shrunk = TOOLS.slice(0, 2);
		rerender(<ToolWire tools={shrunk} />);

		const names = renderedToolNames();
		// Every rendered slot must show one of the surviving tool names — no
		// slot should render blank because it still points past the end of
		// the shrunk array.
		expect(names.length).toBeGreaterThan(0);
		for (const name of names) {
			expect(name.length).toBeGreaterThan(0);
			expect(shrunk.some((tool) => tool.name === name)).toBe(true);
		}
	});

	it("keeps the Presentation freeze intact after a shrink", () => {
		vi.useFakeTimers();
		useIsPresentationTool.mockReturnValue(true);

		const { rerender } = render(<ToolWire tools={TOOLS} />);

		const shrunk = TOOLS.slice(0, 2);
		rerender(<ToolWire tools={shrunk} />);
		const before = renderedToolNames();

		act(() => {
			vi.advanceTimersByTime(30_000);
		});

		expect(renderedToolNames()).toEqual(before);
	});
});

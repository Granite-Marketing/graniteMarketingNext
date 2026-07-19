// granite-convention-exception: paired-test-file
// reason: this is a thin Sanity-hooks wiring layer (useClient/useFormValue/
// onChange) with no logic of its own to unit test — U11's own spec (per the
// Sanity page builder plan) is to test the pure option-deriving logic
// directly and NOT attempt to render the Studio, since rendering this would
// require mocking Sanity's form context and client rather than proving
// anything. That logic lives in ./anchor-options.ts and is fully covered by
// __tests__/anchor-options.test.ts. route-field.tsx (the established
// precedent for a Studio input in this repo) is a rare exception that
// renders cleanly because it has zero hooks and zero external state — this
// component isn't in that shape.
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";
import { set, unset, useClient, useFormValue } from "sanity";
import type { Path, StringInputProps } from "sanity";
import { apiVersion } from "../env";
import {
	ANCHOR_SECTIONS_QUERY,
	deriveAnchorOptions,
	withStoredValue,
	type AnchorSectionDoc,
} from "./anchor-options";

// Custom input for `link.anchorId` (U11 of the Sanity page builder plan).
// Free text on this field means an editor linking to a homepage section has
// to type the anchor id from memory — the plan calls this the single most
// likely way a client breaks their own site, because a typo here produces
// no error anywhere: not in Studio, not on publish, just a link that
// scrolls nowhere. This swaps the input for a dropdown of the anchor ids
// that actually exist on the referenced page. It does NOT change what gets
// stored: `link.ts` still declares `anchorId` as a plain `string`, and a
// value written before this component existed keeps working unchanged —
// see `deriveAnchorOptions`/`withStoredValue` in ./anchor-options.ts for
// the pure logic this file wires up to Sanity's form/client APIs.
//
// No `@sanity/ui`: confirmed earlier this session (2026-07-19) that it
// resolves only inside `sanity`'s own nested node_modules, not hoisted to
// this repo's root — importing it here breaks both `tsc` and `vitest` the
// same way it would in route-field.tsx. Plain elements with inline styles
// instead, matching that file's established pattern.
//
// `useFormValue` reads paths from the DOCUMENT root, but this input can sit
// at different depths depending on which `link` value it belongs to — a
// top-level nav link, a block's CTA, a labelled link nested inside a block
// field. Rather than hardcoding a document-rooted path, `props.path` (this
// FIELD's own absolute path, always ending in [..., "anchorId"]) is used to
// derive the sibling `anchorPage` path relative to wherever this instance
// happens to live: swap the last path segment. That resolves correctly at
// any nesting depth without this file needing to know what kind of link
// it's rendering inside.
function siblingAnchorPagePath(fieldPath: Path): Path {
	return [...fieldPath.slice(0, -1), "anchorPage"];
}

type AnchorPageRefValue = { _ref?: string } | undefined;

export function AnchorIdInput(props: StringInputProps) {
	const { path, value, onChange, readOnly } = props;

	const anchorPageRef = useFormValue(
		siblingAnchorPagePath(path)
	) as AnchorPageRefValue;
	const pageId = anchorPageRef?._ref;

	const client = useClient({ apiVersion });
	// `.withConfig()` returns a NEW client object on every render — a
	// documented trap (U11's plan entry). Memoised on `client`, which
	// `useClient()` itself keeps stable, so this doesn't re-trigger the
	// fetch effect below on every keystroke.
	//
	// `perspective: "drafts"` is what makes a section added in the SAME
	// editing session as the link (the common case — an editor adding both
	// together) show up immediately, rather than only after the referenced
	// page is published. `anchorPage._ref` always holds the published
	// document id; this perspective transparently prefers that document's
	// draft when one exists.
	const draftClient = useMemo(
		() => client.withConfig({ perspective: "drafts" }),
		[client]
	);

	const [sections, setSections] = useState<AnchorSectionDoc[] | null>(null);
	const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

	useEffect(() => {
		if (!pageId) {
			setSections(null);
			setStatus("idle");
			return;
		}

		let cancelled = false;
		setStatus("loading");

		draftClient
			.fetch<{ sections: AnchorSectionDoc[] } | null>(ANCHOR_SECTIONS_QUERY, {
				id: pageId,
			})
			.then((result) => {
				if (cancelled) return;
				setSections(result?.sections ?? []);
				setStatus("idle");
			})
			.catch(() => {
				// A draft page, a revoked token, a network blip — none of these
				// should trap the editor. Fall through to the empty-list state,
				// which still leaves the free-text input below fully usable.
				if (cancelled) return;
				setSections([]);
				setStatus("error");
			});

		return () => {
			cancelled = true;
		};
	}, [draftClient, pageId]);

	const options = useMemo(
		() => withStoredValue(deriveAnchorOptions(sections), value),
		[sections, value]
	);

	const patchValue = useCallback(
		(next: string) => {
			onChange(next ? set(next) : unset());
		},
		[onChange]
	);

	const handleSelectChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => patchValue(event.target.value),
		[patchValue]
	);

	const handleTextChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => patchValue(event.target.value),
		[patchValue]
	);

	// No page selected: `anchorPage` means "an anchor on the current page"
	// (see that field's own description on link.ts) — there is no document
	// to query sections from, so there is nothing to build a dropdown out
	// of. A permanently-empty, disabled <select> would explain nothing to
	// the editor; free text is the honest input here, unchanged from
	// pre-U11 behaviour.
	if (!pageId) {
		return (
			<div>
				<input
					type="text"
					value={value ?? ""}
					readOnly={readOnly}
					onChange={handleTextChange}
					placeholder="e.g. our-services"
					style={inputStyle}
				/>
				<p style={hintStyle}>
					No page selected above, so this anchor is looked up on the
					current page at render time — type its id directly.
				</p>
			</div>
		);
	}

	// The escape hatch is not a mode you switch into — it's always the
	// second control on screen. A page may be a draft the query can't see
	// yet, the fetch may fail, or the editor may be linking ahead of
	// creating the section; a dropdown that can only offer what it already
	// knows about would trap them. Picking from the <select> just writes
	// into the same field the text input edits directly, so nothing here
	// can produce a value the free-text input couldn't also produce.
	return (
		<div>
			<select
				value={options.some((option) => option.value === value) ? value : ""}
				disabled={readOnly}
				onChange={handleSelectChange}
				style={inputStyle}
			>
				<option value="">
					{status === "loading"
						? "Loading this page's anchors…"
						: options.length === 0
							? "This page has no anchored sections yet"
							: "— choose an anchor —"}
				</option>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.title}
					</option>
				))}
			</select>
			<input
				type="text"
				value={value ?? ""}
				readOnly={readOnly}
				onChange={handleTextChange}
				placeholder="or type an anchor id directly"
				style={{ ...inputStyle, marginTop: "0.5em" }}
			/>
			{status === "error" && (
				<p style={hintStyle}>
					Could not load this page's sections — type the anchor id
					directly instead.
				</p>
			)}
		</div>
	);
}

const inputStyle: CSSProperties = {
	width: "100%",
	padding: "0.5em 0.75em",
	border: "1px solid var(--card-border-color, #d4d4d4)",
	borderRadius: 4,
	fontSize: "0.8125em",
	boxSizing: "border-box",
};

const hintStyle: CSSProperties = {
	margin: "0.5em 0 0",
	fontSize: "0.75em",
	color: "var(--card-muted-fg-color, #6f6f76)",
};

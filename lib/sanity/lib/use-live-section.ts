"use client";

import { usePresentationQuery } from "next-sanity/hooks";

// The per-block half of U13's "each block resolves its own data in
// Presentation rather than the whole page refetching" (confirmed present as
// `usePresentationQuery` in next-sanity@11.6.10). Centralised here rather
// than duplicated across eight block adapters: every adapter runs the same
// "query my one section by _id + _key, fall back to the server-fetched
// initial value while inactive" shape, and only the query STRING differs
// per block.
//
// `usePresentationQuery` returns `{ data: null, ... }` whenever it isn't
// running inside Presentation Tool's comlink connection (verified by
// reading next-sanity's source — it reads a module-level snapshot rather
// than requiring a React Context Provider, so this is also safe to call in
// a plain render/test with no Presentation set up at all: `data` just stays
// `null` and this hook returns `initial`).
export function useLiveSection<T>(
	query: string,
	params: { id: string; key: string },
	initial: T
): T {
	const { data } = usePresentationQuery({ query, params });
	return (data as T | null) ?? initial;
}

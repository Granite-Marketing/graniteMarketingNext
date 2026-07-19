import type { PAGE_QUERYResult } from "@/sanity.types";

// Shared section types for U13's renderer (components/page-builder.tsx and
// components/blocks/*.tsx). Split out of page-builder.tsx itself only so
// every block adapter can import `BlockOf<T>` without reaching back into
// the client component that owns the exhaustiveness switch.
//
// KTD2 says narrow with `Extract<>`, not `Get<>`/`FilterByType<>` (both
// v5-era, absent from @sanity/codegen@4.21.1) — the exact pattern
// lib/sanity/__tests__/generated-types.test.ts already establishes over
// the bare schema union (`PageBuilder` from sanity.types.ts). This file
// applies the identical `Extract<>` pattern one level up, over
// `PAGE_QUERYResult["sections"]` instead of the bare `PageBuilder` schema
// union — both are typegen-generated discriminated unions on `_type`, but
// only the query-result one carries the dereferenced `autoItems`/
// `manualItems` data blocks need to render (a `manualTestimonials`
// reference array vs. the actual `client` documents behind it). The
// exhaustiveness guarantee is unaffected: PAGE_QUERY has one
// `_type == "…" =>` branch per schema block (U12), so this union grows and
// shrinks in lockstep with the schema union `generated-types.test.ts`
// checks reachability against.
export type PageQueryResult = NonNullable<PAGE_QUERYResult>;
export type Section = NonNullable<PageQueryResult["sections"]>[number];
export type BlockOf<T extends Section["_type"]> = Extract<Section, { _type: T }>;

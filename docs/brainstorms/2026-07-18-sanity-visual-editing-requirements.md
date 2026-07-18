# Sanity Visual Editing — Requirements

**Date:** 2026-07-18
**Status:** Ready for planning
**Source:** https://www.sanity.io/docs/visual-editing

## Problem frame

The Granite Marketing site runs a clean but entirely "classic" Sanity integration: one
unauthenticated published-perspective client, one hand-rolled `fetchQuery` wrapper, ISR
with hardcoded revalidate numbers. Editors write in the Studio at `/studio` and have no
way to see their changes before publishing. There is no draft preview of any kind.

The strategic goal is stated plainly: **make this competitive with Webflow.** Clients
should be able to see what they are editing as they edit it. Today they edit blind into
form fields and hope.

A second, longer-horizon goal shapes the architecture: component builders are planned, so
more of the page will become Sanity-driven over time. Whatever gets built now must not
need re-doing when the page-builder work lands.

## Actors

| Actor | Need |
|---|---|
| Stephen (agency owner) | Edit copy and see it rendered before publishing |
| Client editors (future) | Webflow-grade "see what you're editing" experience |
| Site visitors | Must be entirely unaffected — no stega characters, no perf regression, no draft leakage |
| Build pipeline (Vercel) | Static generation must keep working; draft mode is request-time only |

## Requirements

### R1 — Draft preview (must have)
Editors can see unpublished draft content rendered by the real site, inside the Studio,
updating live as they type. This is the Presentation tool: document form on the left,
site preview on the right.

### R2 — Coverage: everything Sanity-driven
Not just blog. The homepage, templates, case studies, FAQs, clients, logos, locations and
authors all need to be previewable wherever they surface. Confirmed explicitly by the user.

### R3 — Click-to-edit is desirable but unproven
The user is undecided between plain side-by-side preview and full click-to-edit overlays,
and wants to **evaluate both after the foundation exists**. The build must therefore make
the overlays a flag-flip, not a re-architecture.

### R4 — Zero production impact
Published output must be byte-identical for anonymous visitors. Specifically: no stega
zero-width characters in `<title>`, meta tags, canonical URLs, or JSON-LD. The site
shipped an SEO fix recently (`eff852f`); that work must not be silently corrupted.

### R5 — No dependency upgrades
Verified: `next-sanity@11.6.10` already exports `defineLive`, `defineEnableDraftMode`,
`VisualEditing`, `useIsPresentationTool`, `createDataAttribute` and `stegaClean`.
`sanity@4.21.1` exports `presentationTool`, `defineLocations`, `defineDocuments` with the
current `initial`/`previewMode` option shape. **Nothing needs installing or upgrading.**

Upgrading to `next-sanity@13` would require `sanity` 4→6 (two majors), `@sanity/vision`
and `@sanity/code-input` bumps, and a React patch bump to ≥19.2.3. That is a separate
project with its own risk, and it is not needed here.

## Blockers found in the current codebase

| # | Blocker | Location |
|---|---|---|
| B1 | 17 queries hardcode `&& !(_id in path("drafts.**"))`, making drafts structurally unreachable regardless of perspective | `lib/sanity/queries.ts` |
| B2 | Two queries interpolate the slug into the GROQ string instead of using `$slug` params — breaks Presentation's document mapping, and is a GROQ-injection smell | `getBlogPost` L40/44, `getWorkflowTemplate` L182/186 |
| B3 | No read token. `.env.local` has only a write `SANITY_TOKEN` | `.env.local` |
| B4 | Client hardcodes `perspective: "published"` and `stega.enabled: false` | `lib/sanity/client.ts:11-15` |
| B5 | No `app/api` directory at all — draft-mode routes are greenfield | `app/` |
| B6 | Studio route segment is `[[...index]]`, not the canonical `[[...tool]]` | `app/studio/` |

## Security finding (out of band)

`scripts/sanityClient.ts` hardcodes a live `sk...` **write** token as a fallback constant.
`scripts/` is gitignored and `git ls-files scripts` returns nothing, so it never reached
GitHub — but the token sits in plaintext on disk and the `if (!token)` guard beneath it is
dead code, since the fallback string is always truthy. Recommend rotating the token and
removing the fallback regardless of whether this project proceeds.

## Scope boundaries

**In scope**
- Draft mode enable/disable routes
- Draft-aware fetch layer (single chokepoint already exists)
- Presentation tool with `locations` resolver for all 11 document types
- Live updates via `SanityLive`
- Stega + overlays behind a flag, ready to evaluate

**Out of scope**
- Upgrading `next-sanity` / `sanity` majors
- Building the component/page builder itself
- Migrating the Studio out of the Next.js app to a standalone deployment
- GROQ typegen / `defineQuery` adoption
- Fixing the unused `lib/config/revalidate.ts` constants

## Open questions

None blocking. The stega-vs-no-stega decision is deliberately deferred to after Phase 1,
by design.

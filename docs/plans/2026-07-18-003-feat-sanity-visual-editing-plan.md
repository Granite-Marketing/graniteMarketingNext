# Sanity Visual Editing — Implementation Plan

**Date:** 2026-07-18
**Requirements:** `docs/brainstorms/2026-07-18-sanity-visual-editing-requirements.md`
**Type:** feat
**Status:** U1–U9 implemented. Build green, published output verified unchanged.

## Status

| Unit | State | Note |
|---|---|---|
| U1 read token + CORS | ✅ | CORS was already configured with credentials on all 3 origins |
| U2 unblock drafts in GROQ | ✅ | 17 filters removed; 3 interpolations parameterised (found one more than planned: `getFAQs`) |
| U3 draft-aware fetch | ✅ | Published path preserved byte-for-byte; draft path uses Live Content API |
| U4 draft mode routes | ✅ | enable returns 401 without a valid secret; disable 307s to `/` |
| U5 layout wiring | ✅ | `/` stayed static — `draftMode()` did not force the tree dynamic |
| U6 presentation tool | ✅ | locations for all 11 doc types; `mainDocuments` for the 2 routed types |
| U7 static gen guards | ✅ | `forcePublished` applied at the query-function level, not per-page |
| U8 overlays | ✅ gated | Behind `NEXT_PUBLIC_SANITY_VISUAL_EDITING`, defaults off |
| U9 stega audit | ✅ | Done ahead of schedule so the flag is safe to flip |
| U10 createDataAttribute | ⬜ | Deferred — belongs with the component-builder work |

**Remaining manual step:** click through the Presentation tool in a browser. The
side-by-side render cannot be verified from the shell because enabling draft mode
requires a Sanity-issued preview secret from an authenticated Studio session.

### Switching on click-to-edit

Add to `.env.local` (and Vercel, when you want it in preview/production):

```bash
NEXT_PUBLIC_SANITY_VISUAL_EDITING=true
```

Absent or any other value = plain side-by-side preview. This is the "test both"
toggle; no code change is needed either way.

## Context

Editors currently write into Sanity form fields with no way to see the result before
publishing. The goal is a Webflow-competitive editing experience: Studio form on the left,
live site preview on the right, drafts rendering as you type — across every Sanity-driven
surface, not just blog.

Verified up front: **no package installs or upgrades are needed.** `next-sanity@11.6.10`
and `sanity@4.21.1` already export everything required. This removes the single largest
risk from the build.

The work splits into two phases. Phase 1 delivers the live side-by-side preview and is a
strict prerequisite for Phase 2. Phase 2 flips on stega click-to-edit overlays, which is a
small diff on top of Phase 1 — deliberately deferred so the overlays can be evaluated
against real use rather than guessed at.

---

## Phase 1 — Draft preview foundation

### U1 — Read token and env

**Goal:** A Viewer-role token exists and is wired into local and Vercel environments.

- Create a **Viewer** (read-only) token in Sanity manage → API → Tokens.
- Add `SANITY_API_READ_TOKEN` to `.env.local` and to Vercel (all three environments).
- Do **not** reuse the existing write `SANITY_TOKEN`. The token reaches the browser when
  draft mode is active, so it must be read-only.
- Add both localhost and the production origin as CORS origins **with credentials**:
  `npx sanity cors add http://localhost:3000 --credentials`
  `npx sanity cors add https://www.granitemarketing.co.uk --credentials`

**Verify:** `npx sanity cors list` shows both entries with credentials allowed.

---

### U2 — Unblock drafts in GROQ

**Files:** `lib/sanity/queries.ts`

**Goal:** Drafts become reachable, and the two slug queries become parameterised.

- Remove all 17 `&& !(_id in path("drafts.**"))` filters. They are redundant once
  perspective is doing the work — `perspective: 'published'` already excludes drafts — and
  they make drafts unreachable no matter what perspective is set.
- Convert `getBlogPost` (L40, L44) and `getWorkflowTemplate` (L182, L186) from string
  interpolation to `$slug` params, matching the pattern `getCaseStudy` (L290) already uses
  correctly. Drop the `slug.replace(/"/g, '\\"')` hand-escaping.

**Test scenario:** With no draft-mode cookie, every page renders exactly the same content
as before the change. This is the critical regression check for U2 — removing draft filters
must be a no-op for anonymous visitors.

---

### U3 — Draft-aware fetch layer

**Files:** `lib/sanity/lib/fetch.ts` (rewrite), `lib/sanity/live.ts` (new),
`lib/sanity/client.ts` (edit)

**Goal:** One chokepoint decides published-vs-draft. Everything else inherits it.

The existing `fetchQuery` wrapper is the single point every one of the 25 query functions
already flows through. This is the piece of luck that makes the whole build tractable —
`queries.ts` needs no signature changes at all.

- `lib/sanity/client.ts`: remove the hardcoded `perspective: "published"` and set
  `stega: { studioUrl: "/studio" }` without `enabled: false` (stega then activates only
  when draft mode is on, which is the desired behaviour).
- `lib/sanity/live.ts` (new): `defineLive` from `next-sanity/live`, passing
  `serverToken` and `browserToken` from `SANITY_API_READ_TOKEN`. Export `sanityFetch`
  and `SanityLive`.
- `lib/sanity/lib/fetch.ts`: keep the exported `fetchQuery<T>(query, params, options)`
  signature so no caller changes, but branch internally on `(await draftMode()).isEnabled`:
  - draft: `perspective: 'drafts'`, token attached, `useCdn: false`, `revalidate: 0`
  - published: current behaviour exactly — `perspective: 'published'`, revalidate from
    `options.revalidateSeconds ?? 3600`

**Patterns to reuse:** `lib/sanity/env.ts` for config resolution; the existing
`FetchOptions` type and revalidate defaulting logic.

**Test scenario:** Same query function returns published content without the cookie and
draft content with it.

---

### U4 — Draft mode routes

**Files:** `app/api/draft-mode/enable/route.ts` (new),
`app/api/draft-mode/disable/route.ts` (new)

- Enable: `export const { GET } = defineEnableDraftMode({ client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }) })` from `next-sanity/draft-mode`. This validates
  the preview secret against the Sanity API before enabling — it is not a bare toggle.
- Disable: hand-rolled. There is no `defineDisableDraftMode` helper, and
  `previewMode.disable` is marked deprecated/not-implemented in the installed types.
  `(await draftMode()).disable()` then redirect to `/`.

**Verify:** Hitting `/api/draft-mode/enable` without a valid secret must be rejected.

---

### U5 — Layout wiring

**Files:** `app/layout.tsx`, `components/disable-draft-mode.tsx` (new)

- `<SanityLive />` renders **always**, not only in draft mode — it is what lets published
  content update without a redeploy.
- `<DisableDraftMode />` gated behind `(await draftMode()).isEnabled`. Uses
  `useIsPresentationTool()` from `next-sanity/hooks` to hide itself inside the Studio
  iframe, where it would be redundant.
- `<VisualEditing />` is **not** added in Phase 1 — that is Phase 2.
- Note: `RootLayout` must become `async` to await `draftMode()`.

---

### U6 — Presentation tool

**Files:** `sanity.config.ts`, `lib/sanity/presentation/resolve.ts` (new)

```ts
presentationTool({
  resolve,
  previewUrl: {
    initial: process.env.SANITY_STUDIO_PREVIEW_URL || "/",
    previewMode: { enable: "/api/draft-mode/enable" },
  },
})
```

Use `initial` and `previewMode` — **not** `origin` and `draftMode`, both of which are
marked `@deprecated` in the installed `sanity@4.21.1` types even though the published docs
still show them.

`resolve.ts` needs two halves, covering R2's "everything Sanity-driven":

- **`locations`** (document → where it appears). Per type:
  - `blogPost` → `/blog/{slug}` + `/blog`
  - `workflowTemplate` → `/templates/{slug}` + `/templates`
  - `caseStudy` → `/` (homepage cards only; there is no case-study route)
  - `author`, `category`, `client`, `faq`, `logoList`, `location`, `tool`,
    `workflowCategory` → these have no dedicated route. Use `defineLocations({ message: ... , tone: 'caution' })` to say where they surface, rather than
    inventing hrefs that 404.
- **`mainDocuments`** (URL → document) via `defineDocuments`, for `/blog/:slug` and
  `/templates/:slug`. Order specific routes before general — first match wins.

Since the Studio is embedded at `/studio` on the same origin, `previewUrl.initial` can be
relative and `allowOrigins` can be left to default.

---

### U7 — Static generation guards

**Files:** `app/blog/[slug]/page.tsx`, `app/templates/[slug]/page.tsx`

`generateStaticParams` must pin `perspective: 'published'` and `stega: false`. Without
this you generate routes for draft-only documents, and in Phase 2 stega characters land
inside URL segments. This is non-optional, and it is the single easiest thing to forget.

Draft mode forces dynamic rendering at request time; static builds still emit published
HTML. The `revalidate` exports on each page stay as they are.

---

## Phase 2 — Click-to-edit overlays (evaluate after Phase 1)

Small diff, gated deliberately. All of Phase 1 is a prerequisite; nothing gets rewritten.

### U8 — Enable overlays
Add `<VisualEditing />` to `app/layout.tsx` inside the existing draft-mode conditional
from U5. Stega is already configured on the client from U3, so it activates automatically.

### U9 — Stega safety audit
The blast radius was measured and is small:

| Risk | Sites | Fix |
|---|---|---|
| Stega in `<title>`/meta | `app/blog/[slug]/page.tsx`, `app/templates/[slug]/page.tsx` | `stega: false` in `generateMetadata` |
| Stega in JSON-LD | `lib/seo/structured-data.ts` | `stegaClean()` each field |
| Broken string equality | `components/blog-filter.tsx:19`, `components/content-filter.tsx:24` (`category === "All"`) | `stegaClean()` before comparing |

`lib/utils/read-time.ts:35` (`block._type === "block"`) is **safe** — the client
auto-excludes paths whose last segment starts with `_`.

Golden rule: clean for comparisons, object keys, HTML IDs and third-party inputs. Do
**not** clean rendered text, `<PortableText />` input, or image-helper input — cleaning
those kills the click-to-edit behaviour you just enabled.

### U10 — Non-string targeting (only if wanted)
Stega encodes strings only. Images, numbers, booleans and array containers need explicit
`createDataAttribute` markup. This is the piece that will matter most for the future
component builder, but it is not needed to evaluate the experience.

---

## Verification

1. `npm run dev`, open `http://localhost:3000/studio`, confirm a **Presentation** tool
   appears in the Studio toolbar.
2. Open Presentation, pick a blog post. Confirm the site renders in the right-hand pane.
3. Edit the title **without publishing**. Confirm the preview updates live.
4. Confirm the "used on" list in the document pane shows correct links for each of the 11
   document types, with no 404 hrefs.
5. In a normal browser tab (no draft cookie), confirm published content renders and
   `view-source` contains **no** zero-width characters — grep the HTML for `​`.
6. Confirm `generateStaticParams` still emits only published slugs — draft-only posts must
   not appear in the build output.
7. `npm run build` succeeds and page count matches the pre-change build.
8. After deploying: repeat 1–5 against the Vercel preview URL, and confirm the CORS origin
   with credentials is present for that origin.

## Rollback

Every change is additive except U2 (draft filters) and U3 (client perspective). If preview
misbehaves, removing `presentationTool()` from `sanity.config.ts` and `<SanityLive />` from
the layout returns the site to current behaviour without touching the query layer.

## Out of scope

Package upgrades, the component builder itself, standalone Studio deployment, GROQ typegen,
and the unused `lib/config/revalidate.ts` constants.

## Follow-up (unrelated to this work)

Rotate the write token hardcoded in `scripts/sanityClient.ts` and delete the fallback
constant. Gitignored, never committed, but plaintext on disk.

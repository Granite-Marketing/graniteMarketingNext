---
title: Sanity Visual Editing and Draft Mode gotchas in Next.js App Router
date: 2026-07-18
category: best-practices
module: sanity-preview
problem_type: best_practice
component: service_object
severity: high
applies_when:
  - Wiring Sanity Draft Mode or the Presentation tool into a Next.js App Router site
  - "Any code that measures a CMS string: word counts, lengths, or truncation"
  - Configuring defineLive and deciding whether to pass browserToken
  - Setting perspective on a Sanity client or GROQ query
  - Rendering UI conditionally on useIsPresentationTool()
symptoms:
  - "Blog read times inflated roughly 9.3x in draft mode: 65/85/149 min instead of 7/8 min"
  - '"Unable to connect to visual editing" with an empty "Documents on this page" panel'
  - A button intended to be hidden flashes briefly inside the Presentation tool
root_cause: wrong_api
resolution_type: code_fix
related_components:
  - frontend_stimulus
  - tooling
tags:
  - sanity
  - stega
  - visual-editing
  - draft-mode
  - presentation-tool
  - next-sanity
  - groq-perspective
  - next-js
---

# Sanity Visual Editing and Draft Mode gotchas in Next.js App Router

## Context

The site is Next.js 16 App Router on ISR, Sanity CMS, Studio embedded at `/studio`.
Editors had no way to see unpublished changes — every content check meant publishing
to production and hoping. The work added Draft Mode plus the Presentation tool so
editors get an in-Studio preview, without changing how anonymous published traffic
is served.

Versions: `next-sanity@11.6.10`, `sanity@4.21.1`, `next@16.0.10`, `react@19.2.0`.
No package upgrades were required — v11 already exports `defineLive`,
`defineEnableDraftMode`, `VisualEditing`, `useIsPresentationTool`,
`createDataAttribute` and `stegaClean`.

The gotchas below are individually small and collectively expensive. They produce
wrong numbers on screen, tooling that reports itself broken with clean logs, and a
token with permanent draft-read scope shipped to the browser.

## Guidance

### 1. Stega breaks MEASUREMENT, not just comparison

Everyone knows stega breaks `===`. The under-documented half: the encoded payload
contains **U+FEFF**, which JavaScript's `\s` character class matches. Any word count
that splits on whitespace counts the payload as words.

Measured in this repo: **9 words became 84** — a 9.33x inflation. Blog read times
displayed as 65/85/149 min instead of 7/8 min.

Before (`lib/utils/read-time.ts`):

```ts
const wordCount = text.trim().split(/\s+/).length;
```

After:

```ts
import { stegaClean } from "next-sanity";

const cleanText = stegaClean(text) ?? "";
const wordCount = cleanText.trim().split(/\s+/).filter(Boolean).length;
```

**Audit three classes when enabling stega, not one:**

| Class | Example | Breaks? |
|---|---|---|
| Equality / comparison | `category === "guides"` | Yes — well known |
| Deduplication / keys | `new Set(tags)` | Yes |
| **Measurement** | `split(/\s+/).length`, `.length`, `slice(0, 120)` | **Yes — the forgotten one** |

Clean at the **utility**, not at each call site. Cleaning inside `calculateReadTime`
protects every caller and cannot be forgotten by the next one.

**Why front-indexing is safe:** the payload is appended at the *end* of the string
(`encoded.startsWith(plain)` is `true`). So `name.split(" ").map(n => n[0])` for
avatar initials never touches it. Trailing-sensitive and total-length operations are
what break.

**Also check clipboard writes.** `navigator.clipboard.writeText(code)` on a raw CMS
string copies invisible characters into the editor's terminal or IDE:

```ts
await navigator.clipboard.writeText(stegaClean(code) ?? code);
```

### 2. `<VisualEditing />` is the bridge; stega is the click targets — gate them separately

`<VisualEditing />` is the comlink bridge to the Studio: connection, refresh, and the
"Documents on this page" panel. Stega only decides whether rendered strings carry
click-to-edit targets. They are separate concerns.

```tsx
// WRONG — bridge gated on the stega flag
{isDraftMode && overlaysEnabled && <VisualEditing />}

// RIGHT — bridge on draft mode; stega decided independently in the fetch layer
{isDraftMode && (
  <>
    <SanityLive />
    <VisualEditing />
    <DisableDraftMode />
  </>
)}
```

**Symptom of conflating them:** Presentation reports "Unable to connect to visual
editing" and "Documents on this page" comes up empty, with nothing in the logs —
because nothing errored. The page simply never opened the bridge.

### 3. `browserToken` ships to the browser — prefer `browserToken: false`

`serverToken` stays server-side. `browserToken` is genuinely sent to the client when
Draft Mode is active. A leaked one can read every draft **and** read
`sanity.previewUrlSecret` to mint unlimited preview links — access that survives
cookie expiry and redeploys, revocable only by rotating the token.

```ts
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: false,
});
```

next-sanity's own warning, verbatim from `dist/live.js`:

> No `browserToken` provided to `defineLive`. This means that live previewing drafts
> will only work when using the Presentation Tool in your Sanity Studio. To support
> live previewing drafts stand-alone, provide a `browserToken`. It is shared with the
> browser so it should only have Viewer rights or lower. You can silence this warning
> by setting `browserToken: false`.

The warning fires only when the value is `undefined` — passing `false` is the
documented "I considered this" signal, not a workaround. Inside Presentation nothing
is lost; the Studio pushes edits over comlink. The only casualty is auto-refresh for a
standalone preview link opened outside the Studio.

If you *do* need one, it must be a **Viewer** token. An Editor token there hands
dataset write access to anyone who can read a network tab.

### 4. `perspective: "published"` makes hand-rolled draft filters redundant and worse

`!(_id in path("drafts.**"))` predates perspectives. The `published` perspective:

- propagates into nested subqueries and joins (verified: a nested `count()` returns 9
  under `published` and 17 under `drafts`) — a hand-rolled filter only applies where
  you remembered to type it
- also excludes `versions.*` documents (content releases), which the path filter misses
- is set once per request, so it cannot drift between queries

```diff
- *[_type == "blogPost" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
+ *[_type == "blogPost"] | order(publishedAt desc) {
```

Once Draft Mode exists these are actively harmful: they defeat the drafts perspective,
so previews silently show published content. 17 were removed here.

On the draft path, **omit** perspective so the Studio's own switcher is honoured:

```ts
// Omitted so next-sanity resolves it from the `sanity-preview-perspective`
// cookie. Pinning it here would silently ignore the Studio's Drafts/Published
// switcher.
const { data } = await sanityFetch({ query, params, stega: overlaysEnabled });
```

### 5. `useIsPresentationTool()` returns `null` while checking — guard with `!== false`

Three states, not two: `true`, `false`, and `null` for "handshake in flight" (the
server snapshot; comlink can take up to 3s, per its fallback timeout).

```tsx
// WRONG — renders during the null window
if (isPresentationTool) return null;

// RIGHT
if (isPresentationTool !== false) return null;
```

### 6. `draftMode()` does not throw during prerender in Next 16

A common pattern wraps `draftMode()` in try/catch with a comment claiming it throws
during static generation. It does not — verified in `next@16.0.10`
`dist/server/request/draft-mode.js`: Next returns a *disabled* instance for every
prerender store type, and only `.enable()` / `.disable()` opt a route into dynamic
rendering.

Keep the try/catch, but document what it actually catches: `fetchQuery` called with no
request or prerender context at all (a script, a module-init side effect). Log it
rather than swallowing it. A wrong comment is worse than none — it stops the next
person investigating the real failure.

Corollary: calling `draftMode()` in the root layout does **not** force the tree
dynamic. Build output confirmed `/` stayed `○ (Static)` with its 30m revalidate.

### 7. `generateStaticParams` must force published + `stega: false`

Otherwise draft-only documents emit build-time routes for pages that do not publicly
exist, and once stega is on, zero-width characters leak into URL segments. Thread an
explicit override through the fetch layer rather than relying on ambient state:

```ts
const slugs = await fetchQuery<string[]>(
  `*[_type == "blogPost"].slug.current`,
  {},
  { forcePublished: true }
);
```

### 8. A single fetch chokepoint is what makes all of this tractable

Every rule above landed in one file because all Sanity reads already flowed through
`lib/sanity/lib/fetch.ts`. Correspondingly, `lib/sanity/client.ts` must **not** pin
`perspective` or `stega` — those are per-request decisions.

Missing config should degrade previews, never the site. Do not throw at module load
for a missing read token: the module is imported by the shared fetch layer that every
published page depends on, so a missing env var would take the whole site down rather
than just previews.

## Why This Matters

- **Wrong numbers that look like content bugs.** A 9-minute post showing "84 min read"
  sends the investigation to the wrong place. Same failure mode hits excerpt
  truncation, character counters and SEO length checks — silently wrong, never throws.
- **Tooling that reports itself broken with clean logs.** The bridge/stega conflation
  points the symptom at Sanity's infrastructure rather than at your gating condition.
- **Permanent draft-read access from a leaked token**, not revocable by cookie expiry
  or redeploy.
- **GROQ that looks careful and behaves incorrectly.** The path filter misses
  subqueries and `versions.*`, and defeats the drafts perspective once previews exist.
- **Comments that lie** cost more than missing comments.

## When to Apply

Any Sanity + Next.js App Router visual editing or Draft Mode integration: adding
`defineLive` to an existing ISR site, enabling stega on a codebase that already renders
CMS strings, setting up Presentation with an embedded Studio, or reviewing GROQ written
before perspectives existed.

The measurement rule generalises beyond Sanity to **any** system that appends invisible
annotation characters to strings you later measure.

## Examples

### Verify stega impact empirically — do not reason about invisible characters

Encode a known string, run your actual production function over both, print both:

```bash
node -e "
const { vercelStegaCombine } = require('@vercel/stega');
const plain = 'The quick brown fox jumps over the lazy dog';
const encoded = vercelStegaCombine(plain, { origin:'sanity.io', href:'/studio/x', data:{id:'abc123',type:'blogPost',path:'content[0].children[0].text'} });
const wc = s => s.trim().split(/\s+/).length;
console.log(wc(plain), wc(encoded));  // 9 vs 84
"
```

Swap `wc` for whatever you suspect: `s => s.slice(0, 120)`, `s => s.length`,
`s => new Set(s.split(',')).size`. If the two values differ, that call site needs
`stegaClean`.

### Prove published output is uncontaminated before shipping

```bash
# zero-width characters across all prerendered HTML — must be 0
find .next/server/app -name "*.html" -exec \
  perl -ne '$c += () = /[\x{200B}\x{200C}\x{200D}\x{FEFF}]/g; END{print "$c\n"}' {} \;

# the read token must never appear in a client bundle — must be 0
grep -rl "$SANITY_API_READ_TOKEN" .next/static | wc -l
```

## Related

- `docs/brainstorms/2026-07-18-sanity-visual-editing-requirements.md` — requirements
- `docs/plans/2026-07-18-003-feat-sanity-visual-editing-plan.md` — implementation plan
- `docs/solutions/architecture-patterns/sanity-code-block-shiki-portable-text.md` —
  **now partially stale.** Its safety argument assumes "the string I render is the
  string the author typed", which no longer holds in draft mode. Its `CodeBlock`
  clipboard example lacked the `stegaClean` guard added in item 1.

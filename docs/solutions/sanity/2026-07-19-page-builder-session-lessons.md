---
module: sanity
tags: [sanity, page-builder, typegen, presentation, visual-editing, regression-testing, studio]
problem_type: [bug, best-practice, workflow-learning]
---

# Sanity page builder — lessons from the build session

Captured 2026-07-19, at the end of the Phase 6 build. These are the things that
actually went wrong, not a summary of what was built. They are the raw input for
the `granite-sanity-page-builder` skill and the checkable conventions that were
deliberately deferred until after the build so they would carry real evidence.

Each entry states what happened, why it was hard to see, and what would have
caught it.

---

## 1. Typegen fails silently by emitting zero queries

**Happened twice.**

`sanity typegen` can only statically analyse a **literal** passed to
`defineQuery`, or a constant defined in the **same file**. Give it anything else
and it aborts for the entire file:

- a helper function -> `Unsupported expression type: BlockStatement`
- an imported constant -> same class of failure
- a member expression (`${SINGLETON_TYPES.blogListing}`) -> same

It does not fail the build. `npm run build`, `tsc --noEmit` and the whole test
suite keep passing, because they all read the **checked-in** `sanity.types.ts`.
The only way to see it is to re-run typegen and read the query count.

The first occurrence shipped in a commit and survived a full verification pass.
It was found days later only because an unrelated schema change forced a
regeneration.

**Catch it with:** a typegen no-diff check in CI. Nothing else works. Locally,
always run `npm run typegen` (not `sanity schema extract`) and read the query
count aloud — it should only ever go up.

**Convention candidate:** every GROQ query is a literal template assigned to a
uniquely named top-level const in the same file. Duplication across files is
accepted; a shared constant is not.

## 2. `sanity schema extract` is not typegen

Briefing an agent to run `sanity schema extract` leaves `sanity.types.ts` stale
against the schema. `npm run typegen` runs extract **and** generate. This bit
twice in one session — once leaving stale types, once hiding lesson 1.

## 3. A baseline capture script must not write by default

`capture-baseline.ts` overwrote its fixtures on every invocation and silently
ignored unknown arguments. Running it as `--check` — expecting a comparison —
destroyed the nine fixtures it was meant to verify against, and reported
success. Caught only via `git status`.

These fixtures are irreplaceable: once a route renders from the CMS, its
pre-migration output cannot be regenerated, only restored from git.

**Convention candidate:** a tool whose default action is destructive and whose
artifact is unreproducible must (a) default to the safe path and (b) treat
unknown arguments as a hard error.

## 4. Fields that look editable and do nothing

The single most repeated defect of the session. **Five** instances:

| Field | Why it was inert |
|---|---|
| `logo` | header renders an inline SVG wordmark; nothing read the field |
| `siteTitle` / `siteDescription` / `ogImage` / `favicon` | `lib/seo/config.ts` stayed hardcoded |
| `blogPostTemplate` / `templateDetail` sections | detail routes never read them |
| `calLink` on block CTAs | absent from the server-side GROQ projection |
| `logoLink` | `resolve-site-settings.ts` was written and tested, then never imported; nav and footer hardcoded `href="/"` |

Every one was added as schema, seeded, and shown in the Studio without a
consumer. An editor fills it in, publishes, and nothing happens — with no error
to explain why. The client found the first one; the rest were found by asking
"what else did I do this to?" rather than by any test.

The fifth was found by code review, and it escaped that sweep — which is the
point. The sweep looked for a *field* with no consumer. `logoLink` had one: a
fully implemented, fully tested `resolveLogoLink`. What it lacked was a *call
site*. Asking "which fields are unread?" does not find "which resolvers are
uncalled?", and both produce the identical symptom for the editor.

**Convention candidate:** a schema field is not done until something renders it.
Adding a field and its renderer in the same unit makes this structural. Where
they must be split, the field's description should say it is not wired yet.

## 5. Presentation's document panel reacts to rendered content

The tools strip rotates 6 of N tools on a 2.6s timer. Presentation builds
"Documents on this page" by scanning stega-encoded content, so tool documents
genuinely entered and left the list every 2.6s and the panel flashed
continuously while editing.

Fix: `useIsPresentationTool()` from `next-sanity/hooks` to freeze the animation
**inside Presentation only**. The naive fix — render everything and hide the
extras — would have changed the server HTML and duplicated names in the
accessibility tree.

**Generalises to:** any component that cycles, paginates, or randomises
CMS-driven content is a Presentation hazard, not just an aesthetic choice.

## 6. Singletons render as "Untitled", and `preview` is the wrong lever

A singleton has no title field, and until the document exists there is no stored
value to preview, so the pane header falls through to "Untitled".

`preview.prepare()` does NOT fix this. Adding `select: {}` does NOT fix it — I
asserted it did, documented that claim in five files and a test, and was wrong.
`siteSettings` disproves it by having no `select` at all and previewing fine.

The fix is `DocumentBuilder.title()` in the structure — the pane title, set
independently of document state.

Keep `preview` as well: it names the document in search results and reference
pickers, which is a different surface.

## 7. The desk teaches vocabulary, or it confuses

Iterated three times with the client:

- one title reused for a section, its panel and its first row rendered as
  "Blog Listing > Blog Listing > Blog Listing" and read as a rendering bug
- "Blog Posts Detail" was subtly wrong: the detail page is not the posts
- flat sibling rows for Listing/Detail/Records did not show they belonged together

Landed on: section named for the topic (`Blogs`), entries named for the concept
(`Listing`, `Detail`), records plain. A gear icon marks page-settings documents
and content carries none, so the desk itself teaches the distinction.

The document's own title stays contextual ("Blog Post Detail") even where the
row is short ("Detail") — browser tabs and search results have no tree to supply
the topic.

## 8. Emoji in a schema title is a workaround, `icon` is the mechanism

Emoji live inside the title **string**, so they leak into search results,
breadcrumbs, tab titles and reference pickers, and render differently per
platform. `@sanity/icons` plus `icon:` on the type, and `ListItemBuilder.icon()`
on desk rows, is the real mechanism.

Preview precedence is `media` -> type `icon` -> default glyph, so a real logo
still wins over an icon. Adding a plain-English `subtitle` naming the type
(`Blog post`, `Tool`) did more for legibility than the icons did.

## 9. The homepage is reachable at two paths and only one is canonical

The homepage's document has a slug but renders at `/`. Resolving a link to it
from its slug produced `/home`, putting a permanent redirect behind every nav
click.

Which page is the homepage is **data** (`siteSettings.homePage`), so the fix is
a flag computed in GROQ (`_id == *[_id == "siteSettings"][0].homePage._ref`),
not a hardcoded slug comparison — that would be correct until someone repoints
the reference or renames the slug.

## 10. Link projections duplicate, and one copy will be missed

Four hand-rolled copies of the same link projection existed: two read by typegen
(which forces the duplication, per lesson 1) and three inlined in block
components for the live-preview path. Adding `isHomePage` to the first two and
missing the block copies would have shown `/home#services` in the Studio and
`/#services` in production — a divergence visible only while editing.

Where duplication is forced, a test that pins the copies together is the only
defence. That test also surfaced a pre-existing bug: `calLink` was missing from
the server projection entirely.

## 11. Anchor links are the client's likeliest self-inflicted break

Four of five nav links are anchors into homepage sections. As raw strings they
break silently when a section is reordered or renamed — no error, just a link
that scrolls nowhere.

Seeding them as `anchor` link references makes the dependency visible, and a
dropdown of real anchor ids (including auto-derived ones) removes the typo path.
The dropdown must keep a free-text escape hatch: pages can be drafts, and
editors link ahead of creating sections.

## 12. Draft Mode looks like a content leak

Drafts appearing on `/blog` was reported as a bug. It was Draft Mode working
correctly — the "Exit preview" button was on screen. Verified by checking the
built HTML for draft-only titles: zero present, all published ones present, no
draft slugs prerendered.

**Reflex to build:** check the built output, not the browser, when asked whether
something leaks.

## 13. Content published mid-build invalidates a briefing premise

Three times a unit was briefed on "this is draft-only, so output must be
byte-identical", and the client had published it in the meantime. The
consequences were real: `/contact` shipped a hero the moment it was wired, and a
test CTA labelled "My new button" became the primary call-to-action on all 26
pages.

The agents were right both times to stop and report the contradiction rather
than force byte-identical output to satisfy a stale premise.

**Reflex to build:** query the published perspective before asserting what is
live. Never infer it from what a seed script wrote.

## 14. Verification that reads the tree beats verification that reads reports

Every significant defect this session was found by building and diffing, not by
reading a diff or trusting a summary:

- the `$undefined` RSC leak, the React separator comment, the silent `<title>`
  regression (earlier phases)
- the duplicated contact header
- the sitewide CTA replacement
- the missing `calLink`

Two false alarms also came from diffing, and both were resolved by looking at
data rather than code: Radix `useId` values shift when a component tree gains a
boundary (harmless), and a "regression" in the header CTA turned out to be
published content.

**Normalisation classes needed for a Next.js App Router baseline:** build id,
volatile chunk hash, React `useId`, and the inlined RSC flight payload. Report
markup-only separately from strict, so bundler churn never reads as a content
regression.

## 15. Subagents that contradict the brief are the ones worth having

Agents caught, unprompted: `Rule.skip()` does not exist in this Sanity version;
`@sanity/ui` is not resolvable from this repo; `ContentCtaBanner` *is* faithfully
reproducible as a `ctaBlock` (contradicting a brief that said leave it empty);
the block components' link projections were missed; the SEO fields were already
published; and that `select: {}` was not load-bearing — which corrected a false
claim already written into five files and a test.

Briefs should say explicitly: *if this contradicts what you find, stop and report
with evidence rather than working around it.* It worked every time.

---

# Added after the code review (2026-07-19)

The multi-persona review found 12 defects, all now fixed. Two of them are new
lesson classes, not repeats of anything above.

## 16. A guard that cannot fail is worse than no guard

Two of the branch's safety mechanisms were structurally incapable of failing,
and both were protecting something the earlier lessons above identify as
high-risk.

**The link-projection pin** (lesson 10's answer to forced duplication) asserted
field names with `toContain` against *entire file contents*. Deleting `anchorId`
from `PAGE_BUILDER_LINK_FIELDS` left it green, because `anchorId` appears three
more times elsewhere in `queries.ts`. The guard against the duplication drifting
did not detect drift.

**The typegen assertion** (lesson 1's answer to silent zero-query failure) was
`BLOG_POST_QUERYResult extends unknown ? true : never`. Every type extends
`unknown`, including `any` and `never`. So the guard against typegen emitting
nothing could not fail when typegen emitted nothing.

Both passed every run. Both were written in good faith by someone who believed
they were adding protection.

**The test for a guard is not "does it pass" — it is "can I make it fail".**
Break the thing it protects and watch it go red. Both fixes here were verified
that way: delete the field, confirm the old test still passes, fix, delete
again, confirm the new test fails.

**Second-order trap:** the obvious replacement can be vacuous too. A `Has<>`
key-presence check still passes against `any`, because `keyof any` includes
every key. Verify the new assertion rejects `any`, `unknown` and `never`
explicitly rather than assuming a stricter-looking helper is stricter.

**Convention candidate:** any test whose purpose is to catch drift in a
duplicated or generated artifact must carry a comment recording the specific
mutation that was observed to make it fail.

## 17. `fetchQuery<T>` gives T no inference site

`fetchQuery<T>(query: string, ...): Promise<T>` cannot infer `T` — a plain
`string` parameter carries no type information. Every call written without an
explicit type argument returned `Promise<unknown>`: 22 of 23 getters.

The casts written to work around that (`as Promise<X | null>`, and two
`as unknown as ClientLogo[]`) deleted exactly the safety the typegen adoption
was meant to buy, and were hiding a real defect — a nullable `clientName`
reaching `next/image`'s `alt`.

This is the same shape as lesson 4's dead fields: machinery adopted for a
guarantee, wired up in a way that does not deliver it, with nothing failing to
say so. Adopting a type-safety tool is not the same as being covered by it.
Prove the coverage with a probe: assign a getter's result to an incompatible
type and confirm the error names a *shape* mismatch, not `unknown`.

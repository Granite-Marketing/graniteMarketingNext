# Sanity Page Builder — Requirements

**Date:** 2026-07-18
**Status:** Ready for planning
**Iteration:** 2 — builds directly on `docs/brainstorms/2026-07-18-sanity-visual-editing-requirements.md`
and `docs/plans/2026-07-18-003-feat-sanity-visual-editing-plan.md` (U1–U9 shipped, U10 deferred here)
**Scope tier:** Deep — feature

## Problem frame

Presentation mode now works: editors see draft content render live beside the form. But
there is nothing to compose. Every section on the homepage is a hardcoded React component,
and its editorial copy is either a JSX literal or an entry in `components/relay/data.ts`.
An editor can change a blog post. They cannot change the homepage headline, reorder a
section, or create a new page, without a developer and a deploy.

The prior round anticipated exactly this and built for it — "component builders are planned,
so whatever gets built now must not need re-doing." This is that work, and the foundation
holds: no re-architecture is required.

The strategic goal is unchanged and worth restating precisely, because it constrains scope.
The aim is **not** to rebuild Webflow. It is to reach the point where Granite's own site can
be edited without writing code, so the pattern can be extracted and reused on future Next.js
builds. Granite is the proving ground. The transferable asset is a documented method, not a
component library.

## Actors

| Actor | Need |
|---|---|
| Stephen (sole editor today) | Change any copy, reorder sections, add pages, without a deploy |
| Client editors (future projects) | Same, with guardrails that stop them breaking their own site |
| Site visitors | Byte-identical published output. No stega leakage, no perf regression |
| Future Granite projects | A repeatable method, delivered as a skill plus enforceable conventions |

## What "drag and drop" means here

Resolved explicitly during grilling, because the gap between expectation and reality would
otherwise have shaped the whole build wrongly.

**In scope:** Sanity array reordering. Sections are items in a `sections` array. The editor
drags a labelled row up or down in the form pane; the preview re-renders beside it. Clicking
a section in the preview focuses its array item in the form.

**Not in scope:** Webflow-style canvas drag-and-drop, where you drag a rendered section
across the page itself. Sanity does not do this reliably, and the components most affected
are the ones already using CSS entrance animations, sticky positioning and an Embla carousel.

## Requirements

### R1 — Page composition (must have)
A `page` document holds an ordered array of section blocks. Editors add, remove and reorder
blocks. The rendered page reflects the array order.

### R2 — Route ownership
The builder owns the homepage and a new `/[slug]` catch-all for marketing pages. Blog and
templates keep their bespoke document-driven routes — a blog post is a document, not an
arbitrary composition, and letting an editor delete a post body would be a defect not a
feature. Their **page headers** become editable.

Policy pages become a reusable `legalPage` Portable Text document type, so future policy
pages need no code. The contact form stays hardcoded: form-builder-in-CMS is a known tar
pit, forms change rarely, and the Zod schema belongs in code.

### R3 — All editorial chrome editable
Every heading, eyebrow, body paragraph, button label and button destination becomes a block
field. The test is: if a client would ever ask to change it, it is a field.

This includes nested child arrays — capabilities (`tag`, `title`, `description`, `featured`,
`snippet[]`) and process steps. These were initially assumed expensive. They are not:
`components/relay/data.ts` already contains the typed content model, so the schema is close
to a transcription. Excluding them would leave the two sections most worth A/B testing as
the two still requiring a deploy.

### R4 — Data blocks keep references, with a source toggle
Testimonials, case studies, FAQs and tools stay as document references, never duplicated
copy. Each data block carries a mode:

| Mode | Behaviour |
|---|---|
| `auto` | Query the collection — matches today's behaviour, zero-migration default |
| `manual` | Editor picks specific documents in a specific order |

Manual mode is what makes builder-created pages worth having. Without it every new landing
page shows identical data.

### R5 — Editable navigation via a site singleton
A `siteSettings` singleton holds nav and footer. Links use a reusable `link` object modelled
as a discriminated union:

| Type | Resolves to |
|---|---|
| `internal` | reference → `page` \| `blogPost` \| `workflowTemplate` \| `legalPage` |
| `anchor` | reference → `page`, plus `anchorId` |
| `external` | url, with `openInNewTab` |

This buys three things a bare `{label, href}` string cannot: referential integrity (deleting
a linked page is blocked, not silently 404'd), builder pages that are linkable by
construction with no typed URLs, and slug renames that propagate automatically.

The singleton also holds site-wide chrome beyond navigation: the **logo** (with real alt text,
not filename-derived), the **logo link**, the **header CTA**, and **global CTA defaults**.

The global CTA is a default, not a fixed value. The contact CTA repeats across pages, so its
copy lives in the singleton and the CTA block's fields are optional, falling back to it. A
block dropped on a new page with no configuration renders the house CTA; a landing page
needing a different ask overrides only what it cares about. Singleton-only would make every
page ask identically; block-only would mean editing the same copy on ten pages until they
drift.

### R6 — Anchor integrity
Every section block carries an `anchorId`, auto-generated with manual override, rendered as
the section's `id`. A custom Studio input offers a dropdown of the referenced page's
available anchors rather than a free-text field.

This exists because of a specific live fragility: four of five nav links point at
`#services`, `#process`, `#results` — IDs currently hardcoded inside section components. Once
sections are reorderable and removable, those links break silently. No build error, no 404,
just a link that scrolls nowhere. This is the single most likely way an editor breaks their
own site.

### R7 — Compliance content stays hardcoded
The Wise compliance strip — copyright line, card logos, five policy links — is a payment
provider requirement and gets no editing affordance. Where the cost of a careless edit is a
banking relationship, the correct affordance is none. Editable footer columns, locked
compliance strip.

### R8 — Page-level SEO editable
Meta title and description become editable via a named `seo` object, promoted from the three
inline duplicates currently on `blogPost`, `caseStudy` and `workflowTemplate`.

### R9 — Typed block union
The sections array is a polymorphic union of roughly twelve block types. The renderer
switches on `_type`. Without generated types that switch is unchecked: add a block, forget a
case, and the page ships a silent blank gap.

GROQ typegen makes this a compile error. This is the specific justification — it is not
general good practice, it is the failure mode a page builder introduces. CI must verify that
regenerating produces no diff.

### R10 — Overlays on by default
`NEXT_PUBLIC_SANITY_VISUAL_EDITING` flips to default-on, retained as a kill switch, active in
production draft mode. A page builder without overlays is a list of grey rows; clicking the
rendered section is the primary interaction.

This requires the `createDataAttribute` pass deferred as U10. Stega encodes strings only, so
headings get click-to-edit free, but block containers, images and the array itself need
explicit data attributes for section-level selection.

### R11 — Content-neutral cutover via a seeding script
A script reads the existing `data.ts` exports and JSX literals and creates the `page`
document via the Sanity client — following the established `scripts/migrate-*.ts` + `npx tsx`
convention already in `package.json`.

It doubles as the regression test: seed, render, byte-compare the HTML against the
pre-migration build. Identical output proves the migration is content-neutral. This is the
same technique that de-risked the stega work last round. Hand-entry offers no such check and
produces a document nobody can recreate.

### R12 — Promote relay to primary, delete the rest
`relay` was the name of one of three design directions explored during the homepage
redesign. It won. The namespace is therefore vestigial — it describes a bake-off that
concluded, not a meaningful grouping — and keeping it implies alternatives that no longer
exist.

`components/relay/*` is promoted to `components/*`, so imports read `components/hero` not
`components/relay/hero`. Roughly eighteen dead legacy section files with zero imports are
deleted, along with the unreferenced `navigation-client.tsx` / `footer-client.tsx` and the
pass-through shims `navigation.tsx` / `footer.tsx` / `cta-section.tsx` that exist only to
spare the losing directions an import rewrite.

This is not tidiness for its own sake. Modelling schemas against components nothing renders
is how a block library acquires blocks no editor should ever pick — and the surviving
components are the ones the whole builder is built from.

## Constraints

### C1 — Single Sanity dataset
There is no dev/production split. Every write touches production. Short downtime is
acceptable, but two mitigations are cheap enough to be non-negotiable:

- Export the dataset before seeding, giving a restore point
- Seed as a **draft** first, verify through Presentation, then publish — draft documents are
  invisible to anonymous visitors, so this reduces the exposed window to the publish action

### C2 — No dependency upgrades
`sanity@4.21.1`, `next-sanity@11.6.10`, `next@16.0.10` pinned, `react@19.2.0` pinned. The
prior round verified everything needed is already exported. Keep it that way.

### C3 — No test framework exists
There is no vitest, no playwright, no test script. Test-first work requires standing one up
first.

**Decision: Vitest + @testing-library/react in scope. Playwright deferred.** The granite
canon (`test-framework`) already ratifies Vitest for unit and integration, so the choice was
settled before this project.

Playwright is deferred on reasoning, not cost. Driving the Studio in a browser would test
Sanity's drag-and-drop — their code, their product. What needs proving is our side: that a
given `sections` order renders in that order, that a missing renderer case fails to compile,
that the seeded page produces byte-identical HTML. All of that is Vitest. A Playwright suite
here would be slow, flaky against an embedded Studio, and asserting someone else's feature.

### C3b — Conventions enforcement is now live
`granite-conventions init` ran against this repo on 2026-07-18: session hook and pre-commit
tier enforced, CI tier disabled (no `.github/workflows/`, and the generated workflow clones a
granite URL with no remote — same call sightline made). Audit is clean at 0 violations.

Landed a fix to the shared checker in the process: `check_component_exports` had no App
Router carve-out, so it flagged all 18 `page.tsx` / `layout.tsx` / `loading.tsx` files in this
repo. Next.js requires default exports for those filenames, so the convention as written
asked for code that does not build. Checker and canon both updated; the bug affected every
Next.js repo in the estate.

### C4 — Layout robustness under editor input
Two components break when their arrays change length:

| Component | Failure | Guard |
|---|---|---|
| `process.tsx` | `md:grid-cols-3` and `index * 2.25s` rail delays assume exactly 3 | `Rule.min(2).max(4)`, derive grid from length |
| `capabilities.tsx` | `featured` item has bespoke styling; zero or two look wrong | `Rule.custom()` asserting exactly one featured |

### C5 — Slug collisions
`/[slug]` must not shadow `/blog`, `/templates`, `/contact` or the policy routes. Next
resolves static segments before dynamic, so this works by default — but a page created with
slug `blog` is a live footgun. Needs a schema-level slug blocklist.

## Scope boundaries

**In scope**
- `page` document with a sections array; `/[slug]` catch-all
- ~12 block object types derived from the existing relay sections
- `siteSettings` singleton; `link` union; `seo` and other named object types
- `legalPage` document type; editable headers on blog and template listing pages
- `anchorId` on every block, plus the custom anchor-picker Studio input
- GROQ typegen; schema split into `documents/`, `objects/`, `blocks/`
- Overlays default-on; `createDataAttribute` targeting
- Seeding script and HTML byte-comparison regression harness
- Test framework setup
- Components flattened, dead files deleted
- Rotating the live write token hardcoded in `scripts/sanityClient.ts`

**Deferred, deliberately**
- The skill and conventions (see below) — written after the build, so they carry real lessons
- Canvas drag-and-drop
- Generic theme layer, block-library package, design-token abstraction. These would be
  designed against one data point. Seven Webflow client sites have seven section
  vocabularies; a hero generic enough for all of them is unusable for any.
- Editable contact form
- Standalone Studio deployment; dependency upgrades

**Outside this project's identity**
This is not a CMS product. It is one agency site made editable well enough that the method
is worth extracting.

## Systemization (after build and test)

Deferred on purpose. The value is in lessons the build actually produces, not lessons guessed
at beforehand. Three containers, split by what each is good at:

| Container | Carries |
|---|---|
| `granite-sanity-page-builder` skill | The ordered procedure — audit components for prop-readiness, separate chrome from data, derive schemas from typed data files, wire the block union, `createDataAttribute` targeting, singleton and link union, regression-test against pre-migration HTML — plus the traps found |
| Granite conventions | Only what is checkable: block schemas one-per-file; every block has `anchorId`; links use the union never raw hrefs; `defineQuery` plus typegen no-diff in CI; legal and compliance content stays hardcoded |
| `docs/solutions/` | Project-local learnings, in the existing `architecture-patterns` / `best-practices` structure |

## Success criteria

1. Every homepage heading, body paragraph and button label is editable in the Studio
2. Sections reorder in the form pane and the preview follows
3. A new page can be created and published at `/{slug}` with no deploy
4. Nav and footer links are editable, and deleting a linked page is blocked
5. Post-seed homepage HTML is byte-identical to the pre-migration build
6. Anonymous visitors see no stega characters and no perf regression
7. Adding a block type without a renderer case is a compile error
8. `npm run build` succeeds and page count matches, plus the new routes

## Open questions

**Q1 — `workflowTemplate.content` lacks the `code` block member that `blogPost.content` has.**
Templates are the type most likely to need embedded n8n JSON or shell snippets, so this looks
unintentional. Confirm before treating it as a decision. Not blocking.

## Notes

- No GSAP or Lenis in any active section component. Animation is pure CSS keyframes via
  Tailwind and re-mounts cleanly, so dynamic ordering is safe. The only consumer of
  `lib/animations/` is `hero-border-animation.tsx`, which is itself dead.
- `case-study-slider.tsx` (Embla) and `tool-wire.tsx` (randomised timer) are the only
  stateful client components in the section set. Watch both under live refresh.
- `resultStats` in `data.ts` is sourced to real n8n dashboards dated 2026-07-02. Making the
  numbers editable is correct; the field needs a `description` naming the source. Editable
  and undocumented is how a real metric quietly becomes an invented one.
- Today's schema is a single 1,099-line file with eleven document types, zero named object
  types, no singletons and bare `structureTool()`. Every structural pattern this project needs
  is greenfield.

# Pre-migration HTML baseline

Committed by Unit U6 of `docs/plans/2026-07-18-004-feat-sanity-page-builder-plan.md`.

## What this is

A byte-level snapshot of the **production** rendered HTML for every statically-generated
route, captured from `.next/server/app/*.html` after `next build` — not from a dev server
(dev output differs from what actually ships). It exists to prove, later in the plan, that
migrating the homepage from hardcoded components to a Sanity `page` document (Unit U16)
does not change what visitors see.

This is the one unrecoverable step in the plan: once U16 lands, this baseline can only be
reproduced via a `git checkout` of the pre-migration tree.

## Routes captured

| Route | Fixture |
|---|---|
| `/` | `index.html` |
| `/blog` | `blog.html` |
| `/templates` | `templates.html` |
| `/contact` | `contact.html` |
| `/privacy` | `privacy.html` |
| `/terms` | `terms.html` |
| `/cookies` | `cookies.html` |
| `/refund-policy` | `refund-policy.html` |
| `/delivery-policy` | `delivery-policy.html` |

`/blog/[slug]` and `/templates/[slug]` are SSG per-post pages and are out of scope for this
unit.

## How to regenerate

```
npm run baseline:capture
```

This runs `next build` and then `test/regression/capture-baseline.ts`, which reads the
build output, normalises it (see below), and overwrites these fixtures.

## Normalisation — what, and the evidence it was necessary

The capture script does **not** guess at what might be nondeterministic. The method was:
run two independent clean `next build` runs (`rm -rf .next && npm run build`) on an
otherwise unchanged tree, then diff the raw `.next/server/app/*.html` output for all 9
routes above, byte-for-byte. Whatever differed is normalised; nothing else is touched.

Two, and only two, sources of nondeterminism were found:

### 1. The Next.js build id

Every document embeds the same per-build random identifier twice, in two different
character encodings:

- `<!DOCTYPE html><!--<id>-->` — an underscore-safe form, in the very first bytes of the
  document. (A literal `-` here risks producing `--` inside an HTML comment, which is
  invalid, hence the substitution.)
- `\"b\":\"<id>\"` — the dash form, inside the inlined RSC/flight payload
  (`self.__next_f.push(...)`).

Observed example (two clean builds on the same commit):

```
build 1: <!DOCTYPE html><!--WBlDzFY5oNR_j7n7bwwfL-->  ...  \"b\":\"WBlDzFY5oNR-j7n7bwwfL\"
build 2: <!DOCTYPE html><!--7rAi5dtjlcNffsyxB4UMR-->  ...  \"b\":\"7rAi5dtjlcNffsyxB4UMR\"
```

Both literal strings are extracted directly out of the document being normalised (not
assumed via a hardcoded transform) and every occurrence of each is replaced with
`__BUILD_ID__`.

### 2. One specific hashed script chunk

Of the ~18 script/css chunks referenced by these 9 routes, exactly one changed filename
between the two clean builds:

```
build 1: /_next/static/chunks/7e8b9826b86d1168.js
build 2: /_next/static/chunks/ded6b6f3259492ae.js
```

Diffing the two chunk files directly (not just their names) showed the only difference was
a single embedded literal — Next's internal `revalidateSyncTags` server-action reference id,
e.g. `createServerReference("7fa840b5b346951df8ea76ed83363e5343bee43454", ...)` in build 1
vs a different id in build 2. That id is derived from a per-build action-encryption secret,
so the chunk's content — and therefore its content-hashed filename — differs build-to-build
even though nothing in the source changed.

The filename hash segment under `/_next/static/chunks/` is replaced with `__CHUNK_HASH__`,
keeping the path prefix and extension intact, so a genuinely different *set* of chunks
(one added, removed, or reordered) still shows up as a diff — only the volatile hash text
is stripped.

### Confirmed to have caused zero diffs across two clean builds — NOT normalised

- Every other script/css chunk hash (~17 of ~18)
- Font and image hashes under `/_next/static/media/**`
- All `self.__next_f.push(...)` module ids and streaming/ordering
- All visible text, markup structure, attributes, and meta tags

### Checked and confirmed absent from this output — nothing to strip

- `nonce="..."` attributes: this app emits no CSP nonces.
- Pages-router-style `__NEXT_DATA__` script blocks: this app is App Router only; these
  routes stream RSC/flight data instead.

## If a future capture run doesn't reproduce byte-identically

That is a signal that something **new** became nondeterministic in the build output — not
a reason to add broader, speculative normalisation rules. Re-run the two-clean-builds diff
method above, identify the exact new source, and extend `normalizeHtml()` in
`test/regression/capture-baseline.ts` as narrowly as the two rules above, updating this
file with the new evidence. `capture-baseline.ts` itself refuses to write a fixture that
doesn't contain both placeholders, as a guard against silently under-normalising.

The `test/regression/capture-baseline.test.ts` "fails loudly on a single-character content
change" test exists specifically to catch the opposite failure mode — a normaliser broad
enough to hide a real content regression. Keep it passing.

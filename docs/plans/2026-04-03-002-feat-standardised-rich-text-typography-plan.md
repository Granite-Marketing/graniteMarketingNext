---
title: "feat: Standardised rich text typography with .typo utility class"
type: feat
status: active
date: 2026-04-03
---

# feat: Standardised rich text typography with .typo utility class

## Overview

The legal/policy pages (delivery-policy, refund-policy, cookies, privacy, terms) have unstyled rich text content. They apply `prose prose-lg dark:prose-invert` classes, but `@tailwindcss/typography` is **not installed**, so those classes are completely inert. The result is headings that inherit the oversized global `@layer base` styles (h2 = `text-4xl md:text-5xl`), no list bullet/number styling, no paragraph spacing, and no link styling.

The blog pages work fine because the `PortableTextRenderer` applies explicit Tailwind classes to every element via custom Portable Text components — but this creates a parallel styling system that's hard to reuse.

## Problem Statement

1. **Legal pages look terrible** — headings are hero-sized, lists have no bullets, paragraphs have no spacing, links are unstyled
2. **`prose` classes are dead code** — `@tailwindcss/typography` is not in `package.json`
3. **Two parallel systems** — the blog applies styles per-element in JSX, legal pages rely on (broken) CSS classes. No single source of truth.
4. **Global heading styles conflict** — `@layer base` h1-h6 are sized for page heroes (h2 = `text-4xl md:text-5xl`), which is way too large for content headings inside a policy page body

## Proposed Solution: `.typo` as single source of truth

Create a `.typo` scoped utility class in `app/globals.css` that styles nested HTML elements for rich text content. Then:
1. Apply it to legal pages (replacing dead `prose` classes)
2. **Simplify `PortableTextRenderer`** to use `.typo` instead of per-element Tailwind classes — keeping only behavioral components (link target logic, Next.js Image rendering)

This gives us **one system** instead of two.

### Why `.typo` over installing `@tailwindcss/typography`?

- Full control over styles that match the existing design system (color tokens, spacing, font sizes)
- No new dependency
- The `prose` plugin's defaults would clash with the global `@layer base` heading styles and need heavy customisation anyway

## Technical Approach

### Phase 1: Create the `.typo` class

**File: `app/globals.css`**

Add a `.typo` class inside `@layer base` (after the existing heading styles) that scopes typography rules to its descendants. The styles mirror what `PortableTextRenderer.tsx` currently applies per-element.

```css
/* Rich text typography — apply to any container with raw HTML content */
.typo h1 {
  @apply text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6;
}

.typo h2 {
  @apply text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-4 mt-8;
}

.typo h3 {
  @apply text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-3 mt-6;
}

.typo h4 {
  @apply text-lg md:text-xl font-medium text-foreground mb-2 mt-4;
}

.typo p {
  @apply mb-4 leading-relaxed text-muted-foreground;
}

.typo ul {
  @apply mb-6 ml-6 list-disc space-y-2 text-muted-foreground;
}

.typo ol {
  @apply mb-6 ml-6 list-decimal space-y-2 text-muted-foreground;
}

.typo li {
  @apply leading-relaxed;
}

.typo blockquote {
  @apply border-l-4 border-primary/60 pl-4 italic my-6 text-muted-foreground;
}

.typo a {
  @apply text-primary underline-offset-2 hover:underline;
}

.typo strong {
  @apply font-semibold text-foreground;
}

.typo em {
  @apply italic text-foreground;
}

.typo table {
  @apply w-full mb-6 text-muted-foreground;
}

.typo th {
  @apply text-left font-semibold text-foreground pb-2 border-b border-border;
}

.typo td {
  @apply py-2 border-b border-border;
}

.typo hr {
  @apply my-8 border-border;
}
```

Key design decisions:
- Heading sizes match current `PortableTextRenderer` (h2 = `text-2xl md:text-3xl`), NOT the global base styles (h2 = `text-4xl md:text-5xl`)
- Body text uses `text-muted-foreground` (lighter) while headings use `text-foreground` — same as blog
- Table styles added since legal pages (cookies, privacy) use `<table>` elements

### Phase 2: Simplify `PortableTextRenderer`

**File: `lib/sanity/components/PortableTextRenderer.tsx`**

Strip out all purely-styling custom components and let `.typo` handle them via CSS. Keep only components that add **behaviour** CSS can't replicate:

**Remove** (let `.typo` handle via plain HTML):
- `block.h1`, `block.h2`, `block.h3` — just render as `<h1>`, `<h2>`, `<h3>`
- `block.normal` — just render as `<p>`
- `block.blockquote` — just render as `<blockquote>`
- `list.bullet`, `list.number` — just render as `<ul>`, `<ol>`
- `listItem.bullet`, `listItem.number` — just render as `<li>`
- `marks.strong`, `marks.em` — just render as `<strong>`, `<em>`

**Keep** (behavioural, CSS can't do this):
- `marks.link` — needs `target="_blank"` / `rel="noopener noreferrer"` logic for external links
- `types.image` — needs Next.js `<Image>` component, Sanity URL builder, aspect ratio logic

**Result:**

```tsx
const components: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href = (value as any)?.href || "";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          className="text-primary underline-offset-2 hover:underline"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: any }) => {
      // ... existing image logic unchanged ...
    },
  },
};

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  if (!value || value.length === 0) return null;
  return (
    <div className="typo">
      <PortableText value={value} components={components} />
    </div>
  );
}
```

### Phase 3: Update legal pages

Replace the inert `prose prose-lg dark:prose-invert max-w-none` with `typo` on all five legal pages:

| File | Change |
|------|--------|
| `app/delivery-policy/page.tsx:20` | `className="prose prose-lg dark:prose-invert max-w-none"` → `className="typo"` |
| `app/refund-policy/page.tsx` | Same replacement |
| `app/terms/page.tsx` | Same replacement |
| `app/privacy/page.tsx` | Same replacement |
| `app/cookies/page.tsx` | Same replacement |

### Phase 4: Clean up

- Delete stale `styles/globals.css` — not imported anywhere, contains outdated color values
- Delete `components/blog-post-content.tsx` if confirmed as dead code (duplicate of `post-content.tsx`)

### Phase 5: Visual verification

- Check legal pages render correctly (headings, lists, tables, links)
- Check blog posts render identically to before (no visual regression from PortableTextRenderer simplification)
- Check FAQ answers and testimonial quotes (also use PortableTextRenderer) still look correct

## Acceptance Criteria

- [ ] `.typo` class defined in `app/globals.css` with styles for h1-h4, p, ul, ol, li, blockquote, a, strong, em, table, th, td, hr
- [ ] `PortableTextRenderer` simplified to use `typo` wrapper, keeping only link and image components
- [ ] All five legal pages use `typo` class instead of inert `prose` classes
- [ ] Legal page headings render at content-appropriate sizes (not hero sizes)
- [ ] Lists show bullets/numbers with proper indentation
- [ ] Links are styled with primary color and hover underline
- [ ] Tables (cookies/privacy pages) have proper borders and spacing
- [ ] Blog content visually unchanged after PortableTextRenderer simplification
- [ ] FAQ and testimonial rich text visually unchanged
- [ ] Dead `prose` classes removed from codebase
- [ ] Stale `styles/globals.css` deleted

## Dependencies & Risks

- **Low risk**: `.typo` is scoped — only affects descendants of elements with that class
- **Specificity**: `.typo h2` has higher specificity than the bare `h2` in `@layer base`, so the override works naturally
- **Regression risk on blog**: Mitigated by keeping the exact same Tailwind values. Visual check required.
- **No new dependencies**: Pure CSS, no packages to install

## Sources & References

- Current blog styling: `lib/sanity/components/PortableTextRenderer.tsx` (lines 10-119)
- Active global styles: `app/globals.css` (lines 127-231)
- Example affected page: `app/delivery-policy/page.tsx:20`
- Other PortableTextRenderer consumers: `components/faq.tsx`, `components/testimonials.tsx`
- Stale unused file: `styles/globals.css`
- Duplicate dead code: `components/blog-post-content.tsx`

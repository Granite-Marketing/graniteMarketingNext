---
title: Rich code blocks in Sanity blog posts with Shiki syntax highlighting
date: 2026-06-01
category: architecture-patterns
module: blog-rich-content
problem_type: architecture_pattern
component: frontend_stimulus
severity: medium
applies_when:
  - Adding a new rich content block type to the Sanity blog content field
  - Needing server-side syntax-highlighted code in Next.js blog posts
  - Extending the PortableText serializer with a new custom block type
related_components:
  - tooling
  - documentation
tags:
  - sanity
  - portable-text
  - shiki
  - syntax-highlighting
  - code-input
  - next-js
---

# Rich code blocks in Sanity blog posts with Shiki syntax highlighting

## Context

Sanity's default Portable Text schema for blog posts only supports inline `code` marks (backtick-style single-line spans). Authors working around this limitation entered multi-line code with inline marks and `<br/>` tags, producing no syntax highlighting, no language labels, and no copy button. This was insufficient for code tutorial blog posts on a Next.js + Sanity marketing site.

## Guidance

Use `@sanity/code-input` in the Studio and `shiki` on the frontend to add first-class code block support.

### Studio side

Install the version compatible with your Sanity Studio version. Sanity v4 requires `@sanity/code-input@6.x` (v7 requires Sanity v5+).

```bash
npm install @sanity/code-input@6.0.4 shiki
```

Register the plugin and add the `code` array member to the content field:

```ts
// sanity.config.ts
import { codeInput } from "@sanity/code-input";

export default defineConfig({
  plugins: [codeInput()],
});

// blogPost schema content field
defineArrayMember({ type: "code" })
```

### Frontend side

Create an async Server Component that renders Shiki HTML, with a language alias map and a fallback for unrecognised languages:

```tsx
const LANG_ALIASES: Record<string, string> = {
  golang: "go",
  batchfile: "bat",
  mysql: "sql",
  groq: "text",
};

async function HighlightedCode({ value }) {
  if (!value.code) return null;
  const lang = LANG_ALIASES[value.language ?? ""] ?? value.language ?? "text";
  let html;
  try {
    html = await codeToHtml(value.code, { lang, theme: "github-dark" });
  } catch {
    html = await codeToHtml(value.code, { lang: "text", theme: "github-dark" });
  }
  return (
    <CodeBlock
      html={html}
      language={value.language}
      filename={value.filename}
      code={value.code}
    />
  );
}
```

Create a `"use client"` CodeBlock component for the copy button. Override Shiki's inline styles so your wrapper controls the background:

```tsx
"use client";

export function CodeBlock({ html, language, filename, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (non-HTTPS, permission denied)
    }
  };

  return (
    <div className="rounded-xl border border-border bg-zinc-950 overflow-hidden my-8">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <span className="text-xs text-muted-foreground font-mono">
          {filename || language || "code"}
        </span>
        <button type="button" aria-label={copied ? "Copied" : "Copy code"}
          onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div
        className="p-4 overflow-x-auto [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
```

Wire it up in the PortableText components:

```tsx
types: {
  code: ({ value }) => <HighlightedCode value={value} />,
}
```

## Why This Matters

- **Author experience**: `@sanity/code-input` provides a real code editor with syntax highlighting and language picker inside Sanity Studio.
- **Reader experience**: Shiki produces VSCode-quality highlighted HTML server-side. No client JS bundle needed for highlighting; only the copy button ships as a client component.
- **RSC fit**: Shiki's `codeToHtml` is async with no DOM dependency, making it a natural fit for an async Server Component. The RSC/client split (HighlightedCode server + CodeBlock client) is the correct pattern.
- **`dangerouslySetInnerHTML` safety**: Shiki HTML-encodes all `<` to `&#x3C;`. Combined with content authored by trusted Studio users, there is no XSS vector.

## When to Apply

- A Sanity blog or content schema needs multi-line code blocks (tutorials, changelogs, documentation posts).
- **Sanity v4**: use `@sanity/code-input@6.x`. For Sanity v5+, use v7+.
- **Next.js App Router** (RSC available). For Pages Router, use Shiki's synchronous API or move highlighting to `getStaticProps`/`getServerSideProps`.
- Always maintain the `LANG_ALIASES` map: `@sanity/code-input`'s default picker exposes languages that Shiki doesn't recognise by that name (golang, mysql, groq, batchfile).

## Examples

**Before** (inline code marks with `<br/>` hacks):

```html
<code>const x = 1;<br/>const y = 2;</code>
```

No highlighting, no language label, no copy button.

**After** (with `@sanity/code-input` + Shiki):

Studio presents a code editor with language dropdown. Frontend renders a styled block with language label, copy button, and VSCode-quality syntax highlighting — all server-rendered with zero client JS for the highlighting itself.

## Related

- `docs/brainstorms/rich-code-blocks-requirements.md` — upstream requirements document for this feature
- `docs/plans/2026-04-03-002-feat-standardised-rich-text-typography-plan.md` — `.typo` CSS class plan (shares `PortableTextRenderer.tsx`)

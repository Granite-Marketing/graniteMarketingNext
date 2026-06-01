# Rich Code Blocks & SEO Field Reorder

**Date**: 2026-06-01
**Status**: Ready for planning
**Scope**: Standard

## Problem

Blog post code tutorials use Sanity's inline `code` mark for multi-line code, which renders as `<code>` tags with `<br/>` line breaks. There is no syntax highlighting, language labelling, or copy-to-clipboard functionality. This degrades the reading experience for technical content.

Separately, the SEO meta title and description fields in the blog post and workflow template schemas are positioned at the bottom of the editor, making them easy to miss during content creation.

## Goals

1. Authors can insert multi-line code blocks in blog posts with a proper code editor and language selector in the Sanity Studio
2. Code blocks render on the frontend with syntax highlighting, a visible language label, and a copy-to-clipboard button
3. SEO fields appear directly below the title and featured image in both blog post and workflow template schemas

## Success Criteria

- Code blocks in the Studio provide a code editor with language selection (at minimum: JavaScript, TypeScript, Python, YAML, JSON, Bash/Shell)
- Frontend code blocks render with accurate syntax highlighting matching the selected language
- A copy button lets readers copy the code content in one click
- The language is displayed as a label on the code block
- Both short snippets and longer multi-file examples render well
- SEO fields are visible without scrolling past all content fields

## Scope Boundaries

### In scope

- `@sanity/code-input` plugin integration in Sanity Studio
- Code block array member added to the blog post `content` field schema
- Custom Portable Text serializer for the `code` type in `PortableTextRenderer`
- Server-side syntax highlighting with Shiki (zero client-side JS flash)
- Copy-to-clipboard client component
- Language label display on rendered code blocks
- Reordering SEO fields in `blogPost` and `workflowTemplate` schemas

### Out of scope

- Code blocks in workflow template content (blog posts only)
- Changes to inline code mark rendering
- Migration of existing inline-code-as-multiline content to the new code block type
- Line number display (can be added later if needed)
- Code block themes beyond a sensible default for dark mode

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Sanity code input | `@sanity/code-input` | Standard Sanity plugin; provides language selection, filename field, and Studio-side highlighting |
| Syntax highlighting | Shiki | Server-side rendering (RSC compatible), VSCode-quality TextMate grammars, excellent multi-language coverage |
| Code block scope | Blog posts only | Templates don't contain code tutorials |

## Constraints

- Existing blog posts using inline code marks for multi-line code will need manual re-entry using the new code block type; there is no automated migration path
- The `PortableTextRenderer` is shared across blog posts and templates; the code serializer will be present but only blog post schemas will include the code block type

## Dependencies

- `@sanity/code-input` package (Sanity plugin)
- `shiki` package (syntax highlighting)

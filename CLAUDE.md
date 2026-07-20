# Claude Instructions — Granite Marketing Website

## Project Context
This is the Granite Marketing agency website.
- For agency context and team info:
  READ ~/granite/CLAUDE.md
- For approved tech stack and libraries:
  READ ~/granite/knowledge/tech-conventions.md

## Stack
Next.js 16 (App Router), Tailwind CSS 4.0, GSAP + Lenis smooth scroll, Sanity CMS, Cal.com embed, Radix UI primitives.

## Project Knowledge
- `docs/solutions/` — documented solutions to past problems (bugs, best practices, workflow patterns), organized by category with YAML frontmatter (`module`, `tags`, `problem_type`). Relevant when implementing or debugging in documented areas.
- `CONCEPTS.md` — shared domain vocabulary (entities, named processes, status concepts). Relevant when orienting to the codebase or discussing domain concepts.

<!-- granite-conventions:start -->
# granite-marketing

## About
Granite Marketing agency website — Next.js 16, Tailwind 4, Sanity CMS

## Conventions

This project follows the granite **nextjs** convention canon. Before editing
code in this repo, read the relevant canonical doc:

- Stack canon: `~/granite/knowledge/conventions/nextjs.md`
- Handbook (human-readable): `~/granite/knowledge/conventions/handbook.md`

- Client context: `~/granite/clients/granite/CLAUDE.md`


Inline exception markers (when a convention legitimately doesn't apply):

```ts
// granite-convention-exception: <convention-name>
// reason: <one-line justification>
```

(Use `#` for Python/Ruby/shell; `<!-- ... -->` for HTML/Vue templates.)

## Project-specific overrides

<!-- granite-conventions: per-project exception block. Add convention names
     and the rationale here when an entire convention should be relaxed
     project-wide. The audit tier reads this section. -->

_No project-wide overrides yet._
<!-- granite-conventions:end -->


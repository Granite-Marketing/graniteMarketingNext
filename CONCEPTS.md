# Concepts

Shared domain vocabulary for this project — entities, named processes, and status
concepts with project-specific meaning. Seeded with core domain vocabulary, then
accretes as ce-compound and ce-compound-refresh process learnings; direct edits are
fine. Glossary only, not a spec or catch-all.

## Content model

### Blog Post
An editorial article with rich body content, an author, and one or more categories.
Distinct from a Workflow Template: a Blog Post teaches or comments, and carries no
downloadable artifact.

### Workflow Template
A ready-to-use automation published for readers to download and run in their own
tooling. Shares the article shape of a Blog Post (title, body, author, categories)
but additionally carries the runnable artifact and its deployment links, which is
what makes it a Template rather than a post about one.

### Case Study
A written account of client work, with a challenge/solution narrative and measured
results.

Case Studies surface only as cards on the homepage — there is no per-Case-Study
page. A Case Study is flagged for homepage inclusion explicitly; being published is
not sufficient to make it appear.

### Client
A company the agency has worked with, and the source of a testimonial and headshot.
Distinct from Logo List and Tool: a Client is a relationship with an attributed human
quote behind it.

### Logo List
An entry in the client logo strip — a company mark shown for credibility, with no
testimonial or narrative attached. A company may exist as both a Client and a Logo
List entry; these are separate records and neither implies the other.

### Tool
A third-party product the agency integrates with, shown in the tools/integrations
strip. Distinct from Client and Logo List: a Tool is software the agency connects to,
not a company it has worked for.

### Portable Text
The block-based representation of rich body content — an ordered list of typed
blocks rather than a string of markup. Both Blog Posts and Workflow Templates carry
their body as Portable Text.

Because it is structured rather than a markup string, rendering it means mapping
each block type to a component, and adding a new kind of content (a code block, an
embed) means adding both a block type and its renderer. Plain-text operations such
as word counting must first walk the blocks to extract their text.

## Preview and publishing

### Perspective
The rule deciding which version of each document a query returns — published only,
drafts, or unfiltered. Set per request rather than per query.

Perspective propagates into nested subqueries and joins, and also governs release
documents. This is why filtering drafts out by hand inside a query is both redundant
and unreliable: a hand-written filter applies only where it was typed, and defeats
draft previews wherever it was.

### Draft Mode
The state in which a visitor is shown unpublished content instead of published
content. Entered only by presenting a valid, server-validated preview secret, and
carried thereafter by a cookie.

Draft Mode is the switch that changes which Perspective a request resolves to. It
never applies to anonymous traffic, and published rendering is unaffected by its
existence.

### Stega
Invisible characters embedded into content strings that encode which document and
field each string came from, so the rendered page can offer click-to-edit.

Stega is active only in Draft Mode. Because the encoding lives inside the string,
any code that measures, truncates, deduplicates, or compares a content string will
misbehave while it is active, and must strip the encoding first. Rendered text,
Portable Text rendering, and image helpers must *not* strip it — doing so removes
the click-to-edit targets.

### Presentation tool
The editing surface pairing the document form with a live preview of the real site,
so an editor sees rendered changes before publishing.

The preview communicates with the editing surface over a separate bridge from the
Stega encoding. The bridge governs connection, refresh, and which documents report
themselves as present on the page; Stega governs only whether individual fields are
clickable. Either can be present without the other.

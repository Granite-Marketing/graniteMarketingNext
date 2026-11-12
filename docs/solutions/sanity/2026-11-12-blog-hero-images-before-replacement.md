---
module: blog
tags: [sanity, blog, images, restore]
problem_type: content-change
---

# Blog hero images before the 2026-11-12 replacement

On 2026-11-12 every live blog post got a new `featuredImage` (1600x1000, made with the
granite-visuals skill) and a new `socialImage` (1200x630, used only for link previews).
This records each post's previous `featuredImage` so it can be put back. The old assets
were not deleted from Sanity.

To restore one post:

```js
client.patch("<document id>").set({ featuredImage: { _type: "image", asset: { _type: "reference", _ref: "<old asset id>" }, alt: "<old alt text>" } }).commit()
```

| Slug | Document id | Old asset id | Old alt text |
| --- | --- | --- | --- |
| advanced-ocr-with-llamaindex-extraction-and-n8n | `blogPost-advanced-ocr-with-llamaindex-extraction-and-n8n` | `image-c5edfa685af37a62af45de0e79446117a9d1b0c0-1200x896-jpg` | Advanced OCR with Llamaindex Extraction and n8n |
| browser-automation-for-ai-agents-why-vercel-agent-browser-actually-works-better | `c3db5fef-3e35-405d-a89e-b930f1015fe1` | `image-2a6f0f29f2a90c19500170ee13a9f0957e46ea7c-1200x896-jpg` | A retro-themed image of the Vercel agent browser analysing the various components of a web page. |
| claude-desktop-ios-simulator | `blog-claude-desktop-ios-simulator` | `image-9ef686b0970b0969b3472a27edf14e3e99cec5fd-2000x1125-png` | Claude Desktop with the iOS Simulator pane showing a website open in Mobile Safari on an iPhone 16 Pro |
| how-to-build-a-smart-github-to-n8n-workflow-importer-without-recursion-chaos | `05a9557f-6b5e-4f3f-aaea-f8d1490813f0` | `image-421fea58f1e55bb5a49a5f6010cff969762d40b0-1200x896-jpg` | An image representing loading a GitHub repository, traversing through the directory structure, and then selecting the final output to put inside of n8n, in a retro colourful theme. |
| how-to-build-reliable-claude-workflows-without-becoming-an-ai-engineering-expert | `048995e7-3dc9-49e5-960f-c0fb4ac3c69e` | `image-361a939da6ab264c2886d4f60f06908e03fbb487-1200x896-jpg` | (none) |
| making-railway-serverless-actually-work-5-patterns-for-90-cost-savings | `bc917d0c-a207-450b-9b0f-f373b7ec6b5e` | `image-c3480263e414bb33c2b13f66ff101a86b5c99344-1200x896-jpg` | (none) |
| n8n-webhook-web-page | `blog-n8n-webhook-web-page` | `image-498a86a3e66d66570f12f559aee02e20f4e6ebad-2880x1800-png` | The AI sales agent scorecard demo report, served as a web page from an n8n webhook |
| selective-workflow-migration-between-n8n-instances-static-vs-dynamic-modes | `b33546b7-1b5c-47a4-8055-f741ff342be2` | `image-04d6abf1b8e898b8cc9ee07ac860413c9b8dac55-1200x896-jpg` | (none) |
| the-ai-pricing-pivot-is-here-and-it-s-not-going-away | `461296d1-3f71-469a-8d2a-3035ab711322` | `image-d6f0755be8160d09aa6b73cdb1daa9ca6d36a658-1200x896-jpg` | Automation workflow showing local vs cloud system |
| we-ve-just-launched-our-free-n8n-template-library | `1e399a92-5ad5-4b6b-92e5-369f20b2b9ec` | `image-00b790a5245d11e864222e5c6b444a0b0d1da00d-1200x896-jpg` | (none) |
| what-apple-v-openai-reveals-about-the-ai-talent-war | `a11a6e40-a33d-40e6-ba83-abf418dbf032` | `image-726fadb292b24905029f53ddbcda81cb89c88dfa-1200x896-jpg` | (none) |

## Later the same day

- `used-thinkpad-claude-code-server` (`blog-used-thinkpad-claude-code-server`) was published with the
  new hero already set (`image-d360015d598903d719daa31e021c7fa7d827c618-1600x1000-png`, the same file
  as `hero.png`), so its hero was not replaced. Only its social share image was added.
- The social share image moved from a top-level `socialImage` field into `seo.socialImage`, so it sits
  with Meta Title and Meta Description in Studio.

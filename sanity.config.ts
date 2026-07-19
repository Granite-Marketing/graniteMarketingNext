import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { schemaTypes } from "./lib/sanity/studio-schemas";
import { projectId, dataset } from "./lib/sanity/env";
import { resolve } from "./lib/sanity/presentation/resolve";
import {
  structure,
  filterSingletonDocumentActions,
  filterSingletonsFromNewDocumentMenu,
} from "./lib/sanity/structure";

export default defineConfig({
  name: "granite-marketing",
  title: "Granite Marketing",

  projectId,
  dataset,

  basePath: "/studio",

  plugins: [
    presentationTool({
      resolve,
      previewUrl: {
        // The Studio is embedded in this same Next.js app, so the preview
        // origin is implicit and a relative path is correct here.
        initial: "/",
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    structureTool({ structure }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
    codeInput(),
  ],

  // Singleton enforcement, mechanism (3) of 3 (U9 of the Sanity page builder
  // plan, generalised to the full registry in U19a) — mechanisms (1) and
  // (2) live in lib/sanity/structure.ts's `structure` resolver, wired into
  // `structureTool()` above. These two are deliberately on `document`, NOT
  // on the structure tool: `document.actions` and `document.newDocumentOptions`
  // are unrelated to `structureTool()`'s own options, and there is no
  // `singleton: true` schema option or `__experimental_actions` in
  // sanity@4.21.1 (the latter was removed in 4.x). Both now apply to every
  // type in lib/sanity/singletons.ts's SINGLETON_TYPE_LIST, not just
  // siteSettings.
  document: {
    actions: filterSingletonDocumentActions,
    newDocumentOptions: filterSingletonsFromNewDocumentMenu,
  },

  schema: {
    types: schemaTypes,
  },
});


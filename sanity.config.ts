import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { schemaTypes } from "./lib/sanity/studio-schemas";
import { projectId, dataset } from "./lib/sanity/env";
import { resolve } from "./lib/sanity/presentation/resolve";

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
    structureTool(),
    visionTool({ defaultApiVersion: "2024-01-01" }),
    codeInput(),
  ],

  schema: {
    types: schemaTypes,
  },
});


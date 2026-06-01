import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { schemaTypes } from "./lib/sanity/studio-schemas";
import { projectId, dataset } from "./lib/sanity/env";

export default defineConfig({
  name: "granite-marketing",
  title: "Granite Marketing",

  projectId,
  dataset,

  basePath: "/studio",

  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: "2024-01-01" }),
    codeInput(),
  ],

  schema: {
    types: schemaTypes,
  },
});


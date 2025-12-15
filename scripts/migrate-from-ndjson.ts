import { runMigration } from "./migrationRunner";

type GenericDoc = {
  _id?: string;
  _type?: string;
} & Record<string, unknown>;

async function main() {
  await runMigration<GenericDoc>({
    label: "generic NDJSON docs",
    sourceFile: "scripts/migration-output/sanity-import.ndjson",
    isArrayFile: false,
    mapRecord: (raw) => {
      if (typeof raw._id !== "string" || typeof raw._type !== "string") {
        return null;
      }
      return raw as GenericDoc;
    },
    getId: (doc) => doc._id as string,
  });
}

void main();



import { runMigration } from "./migrationRunner";
import type { LocationInput } from "./migrationTypes";

async function main() {
  await runMigration<LocationInput>({
    label: "locations",
    sourceFile: "scripts/migration-output/locations.json",
    isArrayFile: true,
    mapRecord: (raw) => {
      if (raw._type !== "location" || typeof raw._id !== "string") {
        return null;
      }
      return raw as unknown as LocationInput;
    },
    getId: (doc) => doc._id,
  });
}

void main();



import { runMigration } from "./migrationRunner";
import type { LogoListInput } from "./migrationTypes";

async function main() {
  await runMigration<LogoListInput>({
    label: "logo list",
    sourceFile: "scripts/migration-output/logo-list.json",
    isArrayFile: true,
    mapRecord: (raw) => {
      if (raw._type !== "logoList" || typeof raw._id !== "string") {
        return null;
      }
      return raw as unknown as LogoListInput;
    },
    getId: (doc) => doc._id,
  });
}

void main();



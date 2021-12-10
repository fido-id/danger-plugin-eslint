import { ESLint, Linter } from "eslint";
import { DangerDSLType } from "../node_modules/danger/distribution/dsl/DangerDSL";

/* eslint-disable */
declare const danger: DangerDSLType;
export declare function message(): void;
export declare function warn(): void;
export declare function fail(message: string): void;
export declare function markdown(): void;
/* eslint-enable */

async function lintFile(linter: ESLint, path: string) {
  const contents = await danger.github.utils.fileContents(path);
  const results = await linter.lintText(contents, { filePath: path });
  const formatter = await linter.loadFormatter("json");
  const resultText: Linter.FixReport[] = JSON.parse(formatter.format(results));

  resultText[0]?.messages?.map((msg) => {
    if (msg.fatal) {
      fail(`Fatal error linting ${path} with eslint.`);
      return;
    }

    const fn = { 1: warn, 2: fail }[msg.severity];

    fn(`${path} line ${msg.line} – ${msg.message} (${msg.ruleId})`);
  });
}

/**
 * Eslint your code with Danger
 */
export default async function eslint(
  config?: Linter.Config,
  override?: Linter.Config
) {
  const filesToLint = danger.git.created_files.concat(
    danger.git.modified_files
  );
  const cli = new ESLint({ baseConfig: config, overrideConfig: override });
  return Promise.all(filesToLint.map((f) => lintFile(cli, f)));
}

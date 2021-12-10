// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { DangerDSLType } from "../node_modules/danger/distribution/dsl/DangerDSL"
declare var danger: DangerDSLType
export declare function message(message: string): void
export declare function warn(message: string): void
export declare function fail(message: string): void
export declare function markdown(message: string): void

import { ESLint, Linter } from "eslint"

/**
 * Eslint your code with Danger
 */
export default async function eslint(config: any) {
  const filesToLint = danger.git.created_files.concat(
    danger.git.modified_files,
  )
  const cli = new ESLint({ baseConfig: config })
  return Promise.all(filesToLint.map((f) => lintFile(cli, config, f)))
}

async function lintFile(linter: ESLint, config: Linter.Config, path: string) {
  const contents = await danger.github.utils.fileContents(path)
  const results = await linter.lintText(contents, { filePath: path })
  const formatter = await linter.loadFormatter("json")
  const resultText: Linter.FixReport[] = JSON.parse(formatter.format(results))

  resultText[0].messages.map((msg) => {
    if (msg.fatal) {
      fail(`Fatal error linting ${path} with eslint.`)
      return
    }

    const fn = { 1: warn, 2: fail }[msg.severity]

    fn(`${path} line ${msg.line} – ${msg.message} (${msg.ruleId})`)
  })
}

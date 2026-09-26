/**
 * Validates the reference catalog. With --python, also checks every syntax
 * example parses with the local python3 (via ast.parse).
 */
import { spawnSync } from "node:child_process";
import { entries } from "../src/content";
import { validateContent } from "../src/lib/validate-content";

const problems = validateContent(entries);

if (process.argv.includes("--python")) {
  const code = `
import ast, json, sys
bad = []
for e in json.load(sys.stdin):
    try:
        ast.parse(e["syntax"])
    except SyntaxError as err:
        bad.append(f"[{e['id']}] python syntax error: {err.msg} (line {err.lineno})")
print("\\n".join(bad))
`;
  const run = spawnSync("python3", ["-c", code], {
    input: JSON.stringify(entries.map(({ id, syntax }) => ({ id, syntax }))),
    encoding: "utf8",
  });
  if (run.error) problems.push(`could not run python3: ${run.error.message}`);
  else if (run.status !== 0) problems.push(run.stderr.trim());
  else problems.push(...run.stdout.split("\n").filter(Boolean));
}

if (problems.length) {
  console.error(`✗ ${problems.length} content problem(s):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`✓ ${entries.length} cards valid`);

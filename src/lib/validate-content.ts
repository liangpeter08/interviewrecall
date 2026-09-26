import { CATEGORIES, type ReferenceEntry } from "@/types/reference";

const REQUIRED: (keyof ReferenceEntry)[] = ["id", "title", "summary", "category", "syntax", "warning"];

/** Returns human-readable problems; an empty array means the catalog is valid. */
export function validateContent(entries: ReferenceEntry[]): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const titles = new Map<string, string>();
  const categories = new Set<string>(CATEGORIES.map((c) => c.id));

  for (const e of entries) {
    const where = `[${e.id || "<no id>"}]`;
    if (ids.has(e.id)) problems.push(`${where} duplicate id`);
    ids.add(e.id);

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.id)) problems.push(`${where} id must be kebab-case`);
    for (const field of REQUIRED) {
      const value = e[field];
      if (typeof value !== "string" || !value.trim()) problems.push(`${where} missing ${field}`);
    }
    if (!categories.has(e.category)) problems.push(`${where} invalid category "${e.category}"`);
    if (!e.keywords.length) problems.push(`${where} needs at least one keyword`);
    if (e.documentationUrl && !e.documentationUrl.startsWith("https://"))
      problems.push(`${where} documentationUrl must be HTTPS`);
    if (/\t/.test(e.syntax)) problems.push(`${where} syntax contains tabs`);

    const titleKey = e.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    const clash = titles.get(titleKey);
    if (clash) problems.push(`${where} title duplicates [${clash}]`);
    titles.set(titleKey, e.id);
  }

  for (const e of entries) {
    for (const r of e.related) {
      if (!ids.has(r)) problems.push(`[${e.id}] related id "${r}" does not exist`);
      if (r === e.id) problems.push(`[${e.id}] relates to itself`);
    }
  }
  return problems;
}

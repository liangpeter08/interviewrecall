import Fuse from "fuse.js";
import { CATEGORIES, type ReferenceEntry } from "@/types/reference";
import { aliases } from "./aliases";

export interface SearchResult {
  entry: ReferenceEntry;
  score: number;
}

/** Below this, the top result is shown as a suggestion rather than a confident answer. */
export const STRONG_MATCH = 35;

// Signal weights. Each tier outranks the next so a passing mention never beats a canonical card.
const W = {
  exactTitle: 100,
  exactKeyword: 90,
  prefix: 60,
  category: 50,
  coverage: 40,
  fuzzy: 30,
  fullText: 12,
} as const;
const ALIAS_FACTOR = 0.85;

/** Lowercase, trim, collapse whitespace, and treat hyphens as spaces. Keeps `_`, `.`, `>=` etc. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/(?<=\w)-(?=\w)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Space-insensitive form so `max heap`, `max-heap`, and `maxheap` compare equal. */
function compact(text: string): string {
  return text.replace(/\s+/g, "");
}

function tokens(text: string): string[] {
  return text.split(" ").filter(Boolean);
}

/** The query plus alias rewrites, e.g. `priority queue` → `heap`, `heapq`. */
export function expandQuery(q: string): string[] {
  const variants = new Set<string>();
  for (const [key, values] of Object.entries(aliases)) {
    const k = normalize(key);
    const re = new RegExp(`(^| )${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}( |$)`);
    if (!re.test(q)) continue;
    for (const v of values) variants.add(normalize(q.replace(re, `$1${v}$2`)));
  }
  variants.delete(q);
  return [...variants];
}

interface IndexedEntry {
  entry: ReferenceEntry;
  title: string;
  titleCompact: string;
  names: string[]; // title + keywords, normalized
  namesCompact: Set<string>;
  words: Set<string>;
  category: string[];
  fullText: string;
}

function indexEntry(entry: ReferenceEntry): IndexedEntry {
  const title = normalize(entry.title);
  const keywords = entry.keywords.map(normalize);
  const names = [title, ...keywords];
  const label = CATEGORIES.find((c) => c.id === entry.category)?.label ?? "";
  return {
    entry,
    title,
    titleCompact: compact(title),
    names,
    namesCompact: new Set(keywords.map(compact)),
    words: new Set(names.flatMap(tokens)),
    category: [normalize(entry.category), normalize(label)],
    fullText: normalize(`${entry.summary} ${entry.explanation ?? ""}`),
  };
}

function lexicalScore(ix: IndexedEntry, q: string): number {
  const qc = compact(q);
  if (ix.titleCompact === qc) return W.exactTitle;
  if (ix.namesCompact.has(qc)) return W.exactKeyword;
  if (q.length >= 2 && ix.names.some((n) => n.startsWith(q) || compact(n).startsWith(qc))) return W.prefix;
  if (ix.category.some((c) => c === q || compact(c) === qc)) return W.category;

  const qt = tokens(q);
  const hits = qt.filter(
    (t) => ix.words.has(t) || (t.length >= 3 && [...ix.words].some((w) => w.startsWith(t))),
  ).length;
  const coverage = qt.length ? hits / qt.length : 0;
  if (coverage >= 0.5) return W.coverage * coverage;

  if (q.length >= 3 && ix.fullText.includes(q)) return W.fullText;
  return 0;
}

export function createSearch(entries: ReferenceEntry[]) {
  const indexed = entries.map(indexEntry);
  const fuse = new Fuse(indexed, {
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.35,
    keys: [
      { name: "title", weight: 0.45 },
      { name: "names", weight: 0.35 },
      { name: "fullText", weight: 0.15 },
      { name: "category", weight: 0.05 },
    ],
  });

  return function search(rawQuery: string, limit = 12): SearchResult[] {
    const q = normalize(rawQuery);
    if (!q) return [];
    const variants = expandQuery(q);
    const scores = new Map<string, number>();

    for (const ix of indexed) {
      let s = lexicalScore(ix, q);
      for (const v of variants) s = Math.max(s, lexicalScore(ix, v) * ALIAS_FACTOR);
      if (s > 0) scores.set(ix.entry.id, s);
    }

    // Fuzzy matching fills in typos and adds a small tie-breaker to lexical matches.
    for (const r of fuse.search(q.slice(0, 32))) {
      const fuzzy = W.fuzzy * (1 - (r.score ?? 1));
      const id = r.item.entry.id;
      const prev = scores.get(id);
      scores.set(id, prev === undefined ? fuzzy : prev + fuzzy / 100);
    }

    return indexed
      .filter((ix) => scores.has(ix.entry.id))
      .map((ix) => ({ entry: ix.entry, score: scores.get(ix.entry.id)! }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  };
}

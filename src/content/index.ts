import type { ReferenceCategory, ReferenceEntry } from "@/types/reference";
import { algorithmTemplates } from "./algorithm-templates";
import { classes, functions } from "./classes-functions";
import { collections } from "./collections";
import { dataStructures } from "./data-structures";
import { language } from "./language";
import { sortingSearching } from "./sorting-searching";
import { stringsRegex } from "./strings-regex";

export const entries: ReferenceEntry[] = [
  ...language,
  ...functions,
  ...classes,
  ...collections,
  ...sortingSearching,
  ...stringsRegex,
  ...dataStructures,
  ...algorithmTemplates,
];

const byId = new Map(entries.map((e) => [e.id, e]));

export function getEntry(id: string): ReferenceEntry | undefined {
  return byId.get(id);
}

export function entriesInCategory(category: ReferenceCategory): ReferenceEntry[] {
  return entries.filter((e) => e.category === category);
}

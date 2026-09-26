export const CATEGORIES = [
  { id: "language", label: "Language" },
  { id: "functions", label: "Functions" },
  { id: "classes", label: "Classes" },
  { id: "collections", label: "Collections" },
  { id: "sorting-searching", label: "Sorting and searching" },
  { id: "strings-regex", label: "Strings and regex" },
  { id: "data-structures", label: "Data structures" },
  { id: "algorithm-templates", label: "Algorithm templates" },
] as const;

export type ReferenceCategory = (typeof CATEGORIES)[number]["id"];

export interface ReferenceEntry {
  id: string;
  title: string;
  summary: string;
  category: ReferenceCategory;
  keywords: string[];
  syntax: string;
  complexity?: string[];
  warning: string;
  explanation?: string;
  related: string[];
  pythonVersion?: string;
  documentationUrl?: string;
  /** Prompt shown in recall mode before the card is revealed. */
  recallPrompt?: string;
}

export function categoryLabel(id: ReferenceCategory): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

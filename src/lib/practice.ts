import type { ReferenceEntry } from "@/types/reference";
import type { RecallRecord } from "./storage";

const PRIORITY: Record<RecallRecord["outcome"], number> = { missed: 0, almost: 1, remembered: 2 };

/**
 * Due cards first (weakest outcome first, then oldest due date), then never-reviewed cards,
 * then cards not yet due. Never-reviewed cards are shuffled so sessions vary.
 */
export function buildQueue(
  pool: ReferenceEntry[],
  recall: Record<string, RecallRecord>,
  now: number,
  random: () => number = Math.random,
): ReferenceEntry[] {
  const due: ReferenceEntry[] = [];
  const fresh: ReferenceEntry[] = [];
  const later: ReferenceEntry[] = [];
  for (const e of pool) {
    const r = recall[e.id];
    if (!r) fresh.push(e);
    else if (r.due <= now) due.push(e);
    else later.push(e);
  }
  due.sort((a, b) => {
    const ra = recall[a.id], rb = recall[b.id];
    return PRIORITY[ra.outcome] - PRIORITY[rb.outcome] || ra.due - rb.due;
  });
  for (let i = fresh.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [fresh[i], fresh[j]] = [fresh[j], fresh[i]];
  }
  later.sort((a, b) => recall[a.id].due - recall[b.id].due);
  return [...due, ...fresh, ...later];
}

export function recallPromptFor(entry: ReferenceEntry): string {
  return entry.recallPrompt ?? `Write the syntax for: ${entry.title}`;
}

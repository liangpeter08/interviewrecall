import { describe, expect, it } from "vitest";
import { entries } from "@/content";
import { buildQueue } from "@/lib/practice";
import { highlightPython } from "@/lib/highlight";
import { DEFAULT_STATE, nextDue, parseState, type RecallRecord } from "@/lib/storage";

const DAY = 24 * 60 * 60 * 1000;
const NOW = 1_000 * DAY;

describe("nextDue", () => {
  it("schedules by outcome", () => {
    expect(nextDue("remembered", NOW)).toBe(NOW + 7 * DAY);
    expect(nextDue("almost", NOW)).toBe(NOW + DAY);
    expect(nextDue("missed", NOW)).toBe(NOW);
  });
});

describe("buildQueue", () => {
  const [a, b, c, d] = entries;
  const rec = (outcome: RecallRecord["outcome"], due: number): RecallRecord => ({ outcome, due, reviewedAt: 0 });

  it("puts due cards first, weakest first, and future cards last", () => {
    const recall = {
      [a.id]: rec("remembered", NOW + 5 * DAY),
      [b.id]: rec("almost", NOW - DAY),
      [c.id]: rec("missed", NOW),
    };
    const q = buildQueue([a, b, c, d], recall, NOW, () => 0).map((e) => e.id);
    expect(q).toEqual([c.id, b.id, d.id, a.id]);
  });
});

describe("parseState", () => {
  it("falls back to defaults on bad input", () => {
    expect(parseState(null)).toEqual(DEFAULT_STATE);
    expect(parseState("{not json")).toEqual(DEFAULT_STATE);
    expect(parseState(JSON.stringify({ pins: ["x", 3], theme: "neon" }))).toMatchObject({
      pins: ["x"],
      theme: "system",
    });
  });
});

describe("highlightPython", () => {
  it("round-trips source text and tags tokens", () => {
    const src = 'import heapq  # note\nx = "hi" if 3 else None';
    const tokens = highlightPython(src);
    expect(tokens.map((t) => t.text).join("")).toBe(src);
    expect(tokens.find((t) => t.text === "import")?.kind).toBe("kw");
    expect(tokens.find((t) => t.text === "# note")?.kind).toBe("com");
    expect(tokens.find((t) => t.text === '"hi"')?.kind).toBe("str");
  });
});

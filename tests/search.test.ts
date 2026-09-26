import { describe, expect, it } from "vitest";
import { entries } from "@/content";
import { createSearch, expandQuery, normalize } from "@/lib/search";
import { validateContent } from "@/lib/validate-content";
import { searchExpectations } from "./search-expectations";

const search = createSearch(entries);

describe("normalize", () => {
  it("lowercases, trims and collapses whitespace", () => {
    expect(normalize("  Max   HEAP ")).toBe("max heap");
  });
  it("treats hyphens as spaces but keeps API punctuation", () => {
    expect(normalize("max-heap")).toBe("max heap");
    expect(normalize("__init__")).toBe("__init__");
    expect(normalize("first >= target")).toBe("first >= target");
  });
});

describe("expandQuery", () => {
  it("expands curated aliases", () => {
    expect(expandQuery("priority queue")).toEqual(expect.arrayContaining(["heap", "heapq"]));
    expect(expandQuery("lower bound")).toContain("bisect_left");
  });
});

describe("search quality", () => {
  it.each(searchExpectations)("'$query' ranks $expectedFirst first", ({ query, expectedFirst }) => {
    expect(search(query)[0]?.entry.id).toBe(expectedFirst);
  });

  it("ranks canonical heap cards above passing mentions", () => {
    const top = search("heap").slice(0, 4).map((r) => r.entry.id);
    expect(top.every((id) => id.startsWith("heap-"))).toBe(true);
  });

  it("returns nothing for an empty query", () => {
    expect(search("   ")).toEqual([]);
  });
});

describe("content", () => {
  it("passes validation", () => {
    expect(validateContent(entries)).toEqual([]);
  });
  it("has at least 25 cards", () => {
    expect(entries.length).toBeGreaterThanOrEqual(25);
  });
});

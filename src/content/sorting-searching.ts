import type { ReferenceEntry } from "@/types/reference";

const docs = "https://docs.python.org/3/library";

export const sortingSearching: ReferenceEntry[] = [
  {
    id: "sort-vs-sorted",
    title: "list.sort() versus sorted()",
    summary: "list.sort() sorts in place and returns None; sorted() returns a new list.",
    category: "sorting-searching",
    keywords: ["sort", "sorted", "sort returns none", "in place", "new list", "sort list"],
    syntax: `nums.sort()             # in place, returns None
ordered = sorted(nums)  # new list, works on any iterable
ordered = sorted(d)     # sorted keys of a dict`,
    complexity: ["O(n log n) time", "Stable"],
    warning: "`nums = nums.sort()` sets nums to None.",
    related: ["sort-key-reverse", "sort-multi-key"],
    documentationUrl: "https://docs.python.org/3/howto/sorting.html",
    recallPrompt: "Sort a list in place, and separately produce a sorted copy of it.",
  },
  {
    id: "sort-key-reverse",
    title: "Sort with key and reverse",
    summary: "key= computes a sort value per item; reverse=True sorts descending.",
    category: "sorting-searching",
    keywords: ["sort key", "key function", "reverse", "descending", "sort by length", "custom sort", "lambda sort"],
    syntax: `words.sort(key=len)
words.sort(key=str.lower)
people.sort(key=lambda p: p.age, reverse=True)
best = max(items, key=lambda it: it.score)`,
    complexity: ["O(n log n); key is called once per item"],
    warning: "key receives one item and returns a value — it is not a two-argument comparator.",
    related: ["sort-multi-key", "itemgetter", "cmp-to-key"],
    documentationUrl: "https://docs.python.org/3/howto/sorting.html#key-functions",
  },
  {
    id: "sort-multi-key",
    title: "Multi-key sorting",
    summary: "Return a tuple from key; negate numeric fields to mix ascending and descending.",
    category: "sorting-searching",
    keywords: [
      "sort by two fields",
      "multi key sort",
      "sort second descending",
      "tuple key",
      "tie break",
      "score descending name ascending",
      "mixed order",
    ],
    syntax: `# score descending, then name ascending
rows.sort(key=lambda r: (-r.score, r.name))

# non-numeric descending field: use two stable passes
rows.sort(key=lambda r: r.name)                # secondary first
rows.sort(key=lambda r: r.city, reverse=True)  # primary last`,
    complexity: ["O(n log n) per pass"],
    warning: "Negation only works for numbers; for strings, rely on stability with multiple sorts.",
    explanation:
      "Python's sort is stable, so sorting by the secondary key first and then by the primary key keeps secondary order within ties.",
    related: ["sort-key-reverse", "cmp-to-key", "itemgetter"],
    documentationUrl: "https://docs.python.org/3/howto/sorting.html#sort-stability-and-complex-sorts",
    recallPrompt: "Sort records by score descending, breaking ties by name ascending.",
  },
  {
    id: "itemgetter",
    title: "itemgetter and attrgetter",
    summary: "Fast, readable key functions for indexes, keys, and attributes.",
    category: "sorting-searching",
    keywords: ["itemgetter", "attrgetter", "operator", "sort by index", "sort by attribute", "key function"],
    syntax: `from operator import attrgetter, itemgetter

pairs.sort(key=itemgetter(1))          # by second element
rows.sort(key=itemgetter("age", "name"))
people.sort(key=attrgetter("last", "first"))`,
    warning: "With several arguments these return tuples, so all fields sort in the same direction.",
    related: ["sort-key-reverse", "sort-multi-key"],
    documentationUrl: `${docs}/operator.html#operator.itemgetter`,
  },
  {
    id: "cmp-to-key",
    title: "Custom comparator with cmp_to_key",
    summary: "Adapt an old-style two-argument comparator into a key function.",
    category: "sorting-searching",
    keywords: ["cmp_to_key", "comparator", "custom comparator", "compare function", "functools", "custom sort"],
    syntax: `from functools import cmp_to_key

def compare(a: str, b: str) -> int:
    # negative: a first, positive: b first, zero: equal
    if len(a) != len(b):
        return len(a) - len(b)          # shorter first
    return (a < b) - (a > b)            # then reverse alphabetical

items.sort(key=cmp_to_key(compare))`,
    complexity: ["O(n log n) comparisons"],
    warning: "The comparator must return an int (negative/zero/positive), not a bool.",
    related: ["sort-key-reverse", "sort-multi-key"],
    documentationUrl: `${docs}/functools.html#functools.cmp_to_key`,
  },
  {
    id: "bisect-left",
    title: "bisect_left (lower bound)",
    summary: "Index of the first element >= x in a sorted list.",
    category: "sorting-searching",
    keywords: [
      "bisect",
      "bisect_left",
      "lower bound",
      "first greater equal",
      "first greater or equal",
      "first >= target",
      "binary search",
      "insertion point",
    ],
    syntax: `from bisect import bisect_left

i = bisect_left(nums, x)       # first index with nums[i] >= x
found = i < len(nums) and nums[i] == x
i = bisect_left(rows, k, key=lambda r: r.time)  # 3.10+`,
    complexity: ["O(log n)"],
    warning: "Returns an insertion point, not -1 — check i < len(nums) and nums[i] == x before trusting a match.",
    related: ["bisect-right", "binary-search-template"],
    pythonVersion: "key= requires 3.10+",
    documentationUrl: `${docs}/bisect.html#bisect.bisect_left`,
    recallPrompt: "Find the index of the first element greater than or equal to x in a sorted list.",
  },
  {
    id: "bisect-right",
    title: "bisect_right and insort",
    summary: "bisect_right finds the first element > x; insort inserts while keeping order.",
    category: "sorting-searching",
    keywords: ["bisect_right", "upper bound", "first greater", "insort", "sorted insert", "count less equal"],
    syntax: `from bisect import bisect_left, bisect_right, insort

j = bisect_right(nums, x)                   # first index with nums[j] > x
count_x = bisect_right(nums, x) - bisect_left(nums, x)
insort(nums, x)                             # insert, keep sorted`,
    complexity: ["bisect: O(log n)", "insort: O(n) because of list insertion"],
    warning: "insort finds the spot in O(log n) but inserting into a list is O(n).",
    related: ["bisect-left", "binary-search-template"],
    documentationUrl: `${docs}/bisect.html#bisect.bisect_right`,
  },
];

import type { ReferenceEntry } from "@/types/reference";

const docs = "https://docs.python.org/3/library";

export const collections: ReferenceEntry[] = [
  {
    id: "list-slicing",
    title: "List slicing",
    summary: "seq[start:stop:step] returns a new list; stop is exclusive.",
    category: "collections",
    keywords: ["slice", "slicing", "sublist", "reverse list", "copy list", "negative index", "[::-1]"],
    syntax: `nums[1:4]      # items 1, 2, 3
nums[:3]       # first three
nums[-2:]      # last two
nums[::-1]     # reversed copy
nums[:]        # shallow copy
nums[1:3] = [] # delete a range in place`,
    complexity: ["Slice of length k: O(k)"],
    warning: "Slicing copies — taking slices inside a loop can silently turn O(n) into O(n²).",
    related: ["shallow-deep-copy", "tuple-unpacking"],
    documentationUrl: "https://docs.python.org/3/tutorial/introduction.html#lists",
  },
  {
    id: "tuple-unpacking",
    title: "Tuple unpacking and swapping",
    summary: "Assign multiple names at once, including star-capture of the rest.",
    category: "collections",
    keywords: ["unpacking", "destructuring", "swap", "star", "tuple", "multiple assignment", "rest"],
    syntax: `a, b = b, a                  # swap
first, *rest = nums
*init, last = nums
x, (y, z) = 1, (2, 3)
for i, (key, val) in enumerate(pairs): ...`,
    warning: "The number of targets must match exactly unless one target is starred — otherwise ValueError.",
    related: ["list-slicing", "enumerate-zip"],
    documentationUrl: "https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences",
  },
  {
    id: "dict-get",
    title: "Dictionary access and .get()",
    summary: "Read keys safely with .get() or setdefault(); iterate with .items().",
    category: "collections",
    keywords: ["dict", "dictionary", "hash map", "hashmap", "get", "default value", "setdefault", "items", "key error"],
    syntax: `count = d.get(key, 0)
d[key] = d.get(key, 0) + 1
d.setdefault(key, []).append(x)
for key, val in d.items(): ...
removed = d.pop(key, None)`,
    complexity: ["Get / set / delete / `in`: O(1) average"],
    warning: "d[key] raises KeyError for a missing key; .get() returns None (or your default).",
    explanation: "Dictionaries preserve insertion order since Python 3.7.",
    related: ["defaultdict", "counter"],
    documentationUrl: `${docs}/stdtypes.html#mapping-types-dict`,
  },
  {
    id: "defaultdict",
    title: "defaultdict",
    summary: "A dict that creates a default value for missing keys on first access.",
    category: "collections",
    keywords: ["defaultdict", "default dict", "dict default list", "group by", "grouping", "hash map", "default value"],
    syntax: `from collections import defaultdict

groups: defaultdict[str, list[str]] = defaultdict(list)
groups[key].append(word)

counts: defaultdict[str, int] = defaultdict(int)
counts[ch] += 1`,
    complexity: ["Same as dict: O(1) average"],
    warning: "Pass the factory (list), not a value (list() or []).",
    related: ["dict-get", "counter", "graph-adjacency"],
    documentationUrl: `${docs}/collections.html#collections.defaultdict`,
    recallPrompt: "Group words into lists by a key without checking whether the key exists.",
  },
  {
    id: "counter",
    title: "Counter",
    summary: "Count hashable items; missing keys read as 0.",
    category: "collections",
    keywords: ["counter", "frequency", "count", "histogram", "most common", "multiset", "anagram"],
    syntax: `from collections import Counter

freq = Counter("banana")      # Counter({'a': 3, 'n': 2, 'b': 1})
freq["z"]                     # 0, no KeyError
freq.most_common(2)           # [('a', 3), ('n', 2)]
freq.update(["a", "b"])
Counter(a) == Counter(b)      # same multiset?`,
    complexity: ["Build: O(n)", "most_common(k): O(n log k)"],
    warning: "Reading a missing key returns 0 but does not insert it; `del` or subtraction removes zero counts.",
    related: ["defaultdict", "frequency-map"],
    documentationUrl: `${docs}/collections.html#collections.Counter`,
  },
  {
    id: "set-operations",
    title: "Sets and set algebra",
    summary: "Unordered unique items with O(1) membership and set operators.",
    category: "collections",
    keywords: ["set", "hash set", "union", "intersection", "difference", "symmetric difference", "unique", "dedupe"],
    syntax: `seen: set[int] = set()     # {} is an empty dict!
seen.add(x)
seen.discard(x)            # no error if missing
a | b    # union
a & b    # intersection
a - b    # difference
a ^ b    # symmetric difference`,
    complexity: ["add / discard / `in`: O(1) average", "a & b: O(min(len(a), len(b)))"],
    warning: "`{}` creates an empty dict, not a set. remove() raises KeyError if missing; discard() does not.",
    related: ["dict-get", "comprehensions"],
    documentationUrl: `${docs}/stdtypes.html#set-types-set-frozenset`,
  },
  {
    id: "comprehensions",
    title: "Comprehensions",
    summary: "Build lists, dicts, sets, and generators in a single expression.",
    category: "collections",
    keywords: ["list comprehension", "dict comprehension", "set comprehension", "generator expression", "filter map", "2d list", "grid"],
    syntax: `squares = [x * x for x in nums if x > 0]
index = {v: i for i, v in enumerate(nums)}
unique = {w.lower() for w in words}
total = sum(x * x for x in nums)
grid = [[0] * cols for _ in range(rows)]`,
    warning: "[[0] * cols] * rows repeats the same inner list — mutating one row mutates all of them.",
    related: ["set-operations", "shallow-deep-copy", "filter-map-iterators"],
    documentationUrl: "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions",
  },
  {
    id: "enumerate-zip",
    title: "enumerate and zip",
    summary: "Loop with an index, or over several iterables in lockstep.",
    category: "collections",
    keywords: ["enumerate", "zip", "index", "loop with index", "pairs", "parallel iteration", "strict"],
    syntax: `for i, x in enumerate(nums): ...
for i, x in enumerate(nums, start=1): ...
for a, b in zip(xs, ys): ...
for a, b in zip(xs, ys, strict=True): ...  # 3.10+
pairs = list(zip(nums, nums[1:]))           # adjacent pairs`,
    warning: "zip stops at the shortest input silently; use strict=True to get a ValueError on a length mismatch.",
    related: ["tuple-unpacking", "filter-map-iterators"],
    pythonVersion: "strict= requires 3.10+",
    documentationUrl: `${docs}/functions.html#zip`,
  },
  {
    id: "shallow-deep-copy",
    title: "Shallow versus deep copy",
    summary: "Shallow copies share nested objects; deepcopy duplicates them recursively.",
    category: "collections",
    keywords: ["copy", "deepcopy", "copy nested list", "clone", "shallow copy", "deep copy", "aliasing"],
    syntax: `import copy

shallow = nums[:]            # or list(nums), nums.copy()
grid2 = [row[:] for row in grid]   # copy a 2-D list
deep = copy.deepcopy(nested)`,
    complexity: ["Shallow: O(n)", "Deep: O(total nested size)"],
    warning: "`b = a` copies nothing — both names point to the same list.",
    related: ["list-slicing", "comprehensions"],
    documentationUrl: `${docs}/copy.html`,
  },
  {
    id: "filter-map-iterators",
    title: "map and filter return iterators",
    summary: "map() and filter() are lazy and can only be consumed once.",
    category: "collections",
    keywords: ["filter", "map", "filter iterator", "lazy", "iterator", "list of filter", "consume once"],
    syntax: `evens = filter(lambda x: x % 2 == 0, nums)   # iterator
evens = list(evens)                          # materialize

lengths = list(map(len, words))
lengths = [len(w) for w in words]            # usually clearer`,
    warning: "A second pass over the same map/filter object yields nothing — it's already exhausted.",
    related: ["comprehensions", "lambda", "generators"],
    documentationUrl: `${docs}/functions.html#filter`,
  },
];

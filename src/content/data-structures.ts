import type { ReferenceEntry } from "@/types/reference";

const docs = "https://docs.python.org/3/library";

export const dataStructures: ReferenceEntry[] = [
  {
    id: "heap-min",
    title: "Min heap with heapq",
    summary: "heapq keeps a plain list ordered so the smallest item is at index 0.",
    category: "data-structures",
    keywords: ["heap", "heapq", "min heap", "priority queue", "smallest first", "heappush", "heappop", "heapify"],
    syntax: `import heapq

heap: list[int] = []
heapq.heappush(heap, 5)
smallest = heap[0]            # peek
smallest = heapq.heappop(heap)

nums = [5, 1, 4]
heapq.heapify(nums)           # in place, returns None`,
    complexity: ["Peek heap[0]: O(1)", "Push / pop: O(log n)", "heapify: O(n)"],
    warning: "heapify() mutates the list and returns None — don't assign its result.",
    related: ["heap-max-negation", "heap-priority-payload", "heap-top-k"],
    documentationUrl: `${docs}/heapq.html`,
    recallPrompt: "Build a min heap from a list, then peek at and remove the smallest item.",
  },
  {
    id: "heap-max-negation",
    title: "Max heap with heapq",
    summary: "Use negated numeric values to represent a portable max heap.",
    category: "data-structures",
    keywords: ["heap", "heapq", "max heap", "maxheap", "priority queue", "largest first", "largest"],
    syntax: `import heapq

heap: list[int] = []
heapq.heappush(heap, -value)
largest = -heap[0]            # peek
largest = -heapq.heappop(heap)`,
    complexity: ["Peek: O(1)", "Push: O(log n)", "Pop: O(log n)"],
    warning: "Negate both when inserting and removing values.",
    explanation:
      "heapq only implements a min heap. Negating numbers flips the ordering. For non-numeric keys, push a tuple whose first element is a negated numeric priority. Python 3.14 adds heapq.heappush_max and friends, but negation works on every version.",
    related: ["heap-min", "heap-priority-payload", "heap-top-k"],
    documentationUrl: `${docs}/heapq.html`,
    recallPrompt: "Create a max heap and remove its largest value.",
  },
  {
    id: "heap-priority-payload",
    title: "Heap with priority and payload",
    summary: "Push (priority, tiebreaker, item) tuples so items never need to be comparable.",
    category: "data-structures",
    keywords: ["heap", "priority queue", "tuple heap", "payload", "tiebreak", "counter", "task queue"],
    syntax: `import heapq
from itertools import count

heap: list[tuple[int, int, object]] = []
tiebreak = count()
heapq.heappush(heap, (priority, next(tiebreak), item))
priority, _, item = heapq.heappop(heap)`,
    complexity: ["Push / pop: O(log n)"],
    warning:
      "Without a tiebreaker, equal priorities compare the payloads — which raises TypeError for dicts or custom objects.",
    related: ["heap-min", "heap-max-negation", "tuple-unpacking"],
    documentationUrl: `${docs}/heapq.html#priority-queue-implementation-notes`,
    recallPrompt: "Push arbitrary objects onto a heap keyed by an integer priority, safely handling ties.",
  },
  {
    id: "heap-top-k",
    title: "nlargest and nsmallest",
    summary: "Get the k largest or smallest items, optionally by key.",
    category: "data-structures",
    keywords: ["top k", "k largest", "k smallest", "nlargest", "nsmallest", "heap", "best k"],
    syntax: `import heapq

top3 = heapq.nlargest(3, nums)
low3 = heapq.nsmallest(3, words, key=len)`,
    complexity: ["O(n log k) time", "O(k) extra space"],
    warning: "Results come back as a new sorted list; for k close to n, sorted()[:k] is simpler and just as fast.",
    related: ["heap-min", "sort-key-reverse"],
    documentationUrl: `${docs}/heapq.html#heapq.nlargest`,
  },
  {
    id: "stack-list",
    title: "Stack using a list",
    summary: "A list is a LIFO stack: append to push, pop() to pop.",
    category: "data-structures",
    keywords: ["stack", "lifo", "push", "pop", "append", "peek"],
    syntax: `stack: list[int] = []
stack.append(x)       # push
top = stack[-1]       # peek
top = stack.pop()     # pop
if stack: ...         # non-empty check`,
    complexity: ["append / pop(): O(1) amortized", "pop(0): O(n)"],
    warning: "pop() on an empty list raises IndexError — check `if stack` first.",
    related: ["deque-queue", "monotonic-stack"],
    documentationUrl: "https://docs.python.org/3/tutorial/datastructures.html#using-lists-as-stacks",
  },
  {
    id: "deque-queue",
    title: "Queue with collections.deque",
    summary: "deque supports O(1) appends and pops at both ends.",
    category: "data-structures",
    keywords: ["queue", "deque", "fifo", "popleft", "pop left", "appendleft", "double ended queue", "bfs queue"],
    syntax: `from collections import deque

q = deque([start])
q.append(x)           # enqueue right
first = q.popleft()   # dequeue left
q.appendleft(y)
window = deque(maxlen=3)  # drops oldest automatically`,
    complexity: ["append / popleft / appendleft / pop: O(1)", "Index in the middle: O(n)"],
    warning: "list.pop(0) is O(n); use deque.popleft() for queues.",
    related: ["stack-list", "bfs-template"],
    documentationUrl: `${docs}/collections.html#collections.deque`,
    recallPrompt: "Create a FIFO queue, add an item, and remove the oldest item in O(1).",
  },
  {
    id: "linked-list-node",
    title: "Linked-list node",
    summary: "A minimal singly linked list node with a dummy-head traversal.",
    category: "data-structures",
    keywords: ["linked list", "listnode", "node", "next pointer", "dummy head", "sentinel"],
    syntax: `from __future__ import annotations
from dataclasses import dataclass

@dataclass
class ListNode:
    val: int
    next: ListNode | None = None

dummy = ListNode(0)
tail = dummy
for v in values:
    tail.next = ListNode(v)
    tail = tail.next
head = dummy.next`,
    warning: "Use `is None` / `is not None` to test pointers, not truthiness of a node that could define __len__.",
    related: ["tree-node", "dataclass-basics"],
  },
  {
    id: "tree-node",
    title: "Binary-tree node",
    summary: "A minimal binary tree node with optional children.",
    category: "data-structures",
    keywords: ["tree", "binary tree", "treenode", "node", "left right", "bst"],
    syntax: `from __future__ import annotations
from dataclasses import dataclass

@dataclass
class TreeNode:
    val: int
    left: TreeNode | None = None
    right: TreeNode | None = None

root = TreeNode(2, TreeNode(1), TreeNode(3))`,
    warning: "Recursive traversal of a very deep (skewed) tree can hit the ~1000 default recursion limit.",
    related: ["linked-list-node", "tree-traversal", "dfs-template"],
  },
  {
    id: "graph-adjacency",
    title: "Graph adjacency list",
    summary: "Build an adjacency list from an edge list with defaultdict(list).",
    category: "data-structures",
    keywords: ["graph", "adjacency list", "edges", "neighbors", "undirected", "directed"],
    syntax: `from collections import defaultdict

graph: defaultdict[int, list[int]] = defaultdict(list)
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)   # omit for a directed graph`,
    complexity: ["Build: O(V + E)", "Space: O(V + E)"],
    warning: "Reading graph[x] on a defaultdict inserts x — use `x in graph` or graph.get(x, []) to test.",
    related: ["defaultdict", "bfs-template", "dfs-template"],
    documentationUrl: `${docs}/collections.html#defaultdict-examples`,
  },
  {
    id: "union-find",
    title: "Union-find (disjoint set)",
    summary: "Track connected components with path compression and union by size.",
    category: "data-structures",
    keywords: ["union find", "disjoint set", "dsu", "connected components", "find parent", "union"],
    syntax: `parent = list(range(n))
size = [1] * n

def find(x: int) -> int:
    while parent[x] != x:
        parent[x] = parent[parent[x]]   # path halving
        x = parent[x]
    return x

def union(a: int, b: int) -> bool:
    ra, rb = find(a), find(b)
    if ra == rb:
        return False
    if size[ra] < size[rb]:
        ra, rb = rb, ra
    parent[rb] = ra
    size[ra] += size[rb]
    return True`,
    complexity: ["find / union: O(α(n)) amortized — effectively constant"],
    warning: "Compare roots (find(a) == find(b)), not parent[a] == parent[b].",
    related: ["graph-adjacency"],
  },
];

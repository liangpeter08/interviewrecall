import type { ReferenceEntry } from "@/types/reference";

// Templates show structure and syntax only — never a complete answer to a named problem.
export const algorithmTemplates: ReferenceEntry[] = [
  {
    id: "frequency-map",
    title: "Frequency map",
    summary: "Count occurrences with a dict, defaultdict, or Counter.",
    category: "algorithm-templates",
    keywords: ["frequency", "count occurrences", "histogram", "tally", "freq map", "hash map count"],
    syntax: `freq: dict[str, int] = {}
for x in items:
    freq[x] = freq.get(x, 0) + 1`,
    complexity: ["O(n) time", "O(k) space for k distinct items"],
    warning: "Iterating over a dict while adding keys raises RuntimeError — iterate over list(freq) instead.",
    related: ["counter", "defaultdict", "dict-get"],
  },
  {
    id: "two-pointers",
    title: "Two pointers",
    summary: "Move a left and right index toward each other over a sequence.",
    category: "algorithm-templates",
    keywords: ["two pointers", "left right", "converging pointers", "opposite ends", "in place"],
    syntax: `lo, hi = 0, len(arr) - 1
while lo < hi:
    if should_move_left(arr[lo], arr[hi]):
        lo += 1
    else:
        hi -= 1`,
    complexity: ["O(n) time", "O(1) space"],
    warning: "Decide whether the loop condition is lo < hi or lo <= hi — it controls whether the middle element is visited.",
    related: ["sliding-window", "binary-search-template"],
  },
  {
    id: "sliding-window",
    title: "Sliding window",
    summary: "Grow the right edge each step and shrink the left edge while the window is invalid.",
    category: "algorithm-templates",
    keywords: ["sliding window", "window", "substring window", "variable window", "expand shrink"],
    syntax: `from collections import Counter

window: Counter[str] = Counter()
left = 0
for right, x in enumerate(seq):
    window[x] += 1
    while window_invalid(window):
        window[seq[left]] -= 1
        left += 1
    # window is seq[left : right + 1]`,
    complexity: ["O(n) time — each index enters and leaves once"],
    warning: "Window length is right - left + 1, not right - left.",
    related: ["two-pointers", "counter", "prefix-sum"],
  },
  {
    id: "prefix-sum",
    title: "Prefix sum",
    summary: "Precompute running totals for O(1) range sums.",
    category: "algorithm-templates",
    keywords: ["prefix sum", "running sum", "cumulative sum", "range sum", "accumulate"],
    syntax: `from itertools import accumulate

prefix = [0, *accumulate(nums)]   # prefix[i] = sum(nums[:i])
range_sum = prefix[j + 1] - prefix[i]   # sum(nums[i : j + 1])`,
    complexity: ["Build: O(n)", "Query: O(1)"],
    warning: "The leading 0 shifts indexes by one — prefix has len(nums) + 1 entries.",
    related: ["sliding-window", "frequency-map"],
    documentationUrl: "https://docs.python.org/3/library/itertools.html#itertools.accumulate",
  },
  {
    id: "binary-search-template",
    title: "Binary search on a predicate",
    summary: "Find the first index where a monotonic condition becomes true.",
    category: "algorithm-templates",
    keywords: ["binary search", "lower bound", "first true", "search space", "monotonic predicate", "bisect"],
    syntax: `lo, hi = 0, len(arr)          # half-open [lo, hi)
while lo < hi:
    mid = (lo + hi) // 2
    if condition(arr[mid]):
        hi = mid
    else:
        lo = mid + 1
# lo == first index where condition is True (or len(arr))`,
    complexity: ["O(log n) iterations"],
    warning: "Mixing half-open [lo, hi) with `hi = mid - 1` causes skipped elements or infinite loops — pick one convention.",
    related: ["bisect-left", "bisect-right", "two-pointers"],
  },
  {
    id: "bfs-template",
    title: "BFS with a deque",
    summary: "Breadth-first traversal visiting nodes in order of distance.",
    category: "algorithm-templates",
    keywords: ["bfs", "graph bfs", "breadth first search", "shortest path unweighted", "level order", "queue"],
    syntax: `from collections import deque

seen = {start}
q = deque([(start, 0)])
while q:
    node, dist = q.popleft()
    for nxt in graph[node]:
        if nxt not in seen:
            seen.add(nxt)
            q.append((nxt, dist + 1))`,
    complexity: ["O(V + E) time", "O(V) space"],
    warning: "Mark nodes as seen when enqueuing, not when dequeuing, or they're added many times.",
    related: ["deque-queue", "dfs-template", "graph-adjacency"],
    recallPrompt: "Write the skeleton of a breadth-first traversal that tracks distance from the start.",
  },
  {
    id: "dfs-template",
    title: "DFS (recursive and iterative)",
    summary: "Depth-first traversal with recursion or an explicit stack.",
    category: "algorithm-templates",
    keywords: ["dfs", "depth first search", "graph dfs", "recursion", "explicit stack", "visited", "recursionlimit"],
    syntax: `import sys
sys.setrecursionlimit(10_000)

def dfs(node) -> None:
    seen.add(node)
    for nxt in graph[node]:
        if nxt not in seen:
            dfs(nxt)

stack = [start]
seen = {start}
while stack:
    node = stack.pop()
    for nxt in graph[node]:
        if nxt not in seen:
            seen.add(nxt)
            stack.append(nxt)`,
    complexity: ["O(V + E) time", "O(V) space"],
    warning: "Default recursion depth is about 1000; deep inputs need the iterative form or a higher limit.",
    related: ["bfs-template", "tree-traversal", "backtracking"],
  },
  {
    id: "tree-traversal",
    title: "Tree traversal orders",
    summary: "Preorder, inorder, and postorder recursion, plus level order with a deque.",
    category: "algorithm-templates",
    keywords: ["inorder", "preorder", "postorder", "level order", "tree traversal", "binary tree traversal"],
    syntax: `def inorder(node) -> list[int]:
    if node is None:
        return []
    return inorder(node.left) + [node.val] + inorder(node.right)

from collections import deque
q = deque([root] if root else [])
while q:
    level = [q.popleft() for _ in range(len(q))]
    q.extend(c for n in level for c in (n.left, n.right) if c)`,
    complexity: ["O(n) visits"],
    warning: "List concatenation in recursion is O(n²) on skewed trees; append to a shared list for large inputs.",
    related: ["tree-node", "dfs-template", "bfs-template"],
  },
  {
    id: "topological-sort",
    title: "Topological sort (Kahn's algorithm)",
    summary: "Order a DAG by repeatedly removing nodes with in-degree zero.",
    category: "algorithm-templates",
    keywords: ["topological sort", "topo sort", "kahn", "indegree", "dag", "dependency order", "graphlib"],
    syntax: `from collections import deque

indeg = {u: 0 for u in nodes}
for u in nodes:
    for v in graph[u]:
        indeg[v] += 1
q = deque(u for u in nodes if indeg[u] == 0)
order = []
while q:
    u = q.popleft()
    order.append(u)
    for v in graph[u]:
        indeg[v] -= 1
        if indeg[v] == 0:
            q.append(v)
has_cycle = len(order) < len(nodes)`,
    complexity: ["O(V + E)"],
    warning: "If the order is shorter than the node count, the graph has a cycle.",
    explanation: "The standard library also provides graphlib.TopologicalSorter (3.9+).",
    related: ["bfs-template", "graph-adjacency"],
    documentationUrl: "https://docs.python.org/3/library/graphlib.html",
  },
  {
    id: "dijkstra",
    title: "Dijkstra with heapq",
    summary: "Shortest paths with non-negative weights using a heap of (distance, node).",
    category: "algorithm-templates",
    keywords: ["dijkstra", "shortest path", "weighted graph", "heap graph", "min distance"],
    syntax: `import heapq

dist = {start: 0}
heap = [(0, start)]
while heap:
    d, u = heapq.heappop(heap)
    if d > dist.get(u, float("inf")):
        continue                       # stale entry
    for v, w in graph[u]:
        nd = d + w
        if nd < dist.get(v, float("inf")):
            dist[v] = nd
            heapq.heappush(heap, (nd, v))`,
    complexity: ["O((V + E) log V)"],
    warning: "Skip stale heap entries; without the check, nodes are relaxed many times. Negative weights break it.",
    related: ["heap-min", "bfs-template", "graph-adjacency"],
  },
  {
    id: "monotonic-stack",
    title: "Monotonic stack",
    summary: "Keep a stack of indexes whose values stay increasing or decreasing.",
    category: "algorithm-templates",
    keywords: ["monotonic stack", "next greater", "previous smaller", "stack of indexes", "decreasing stack"],
    syntax: `result = [-1] * len(nums)
stack: list[int] = []            # indexes, values decreasing
for i, x in enumerate(nums):
    while stack and nums[stack[-1]] < x:
        result[stack.pop()] = i
    stack.append(i)`,
    complexity: ["O(n) — each index is pushed and popped once"],
    warning: "Store indexes, not values, when you need positions or distances.",
    related: ["stack-list"],
  },
  {
    id: "backtracking",
    title: "Backtracking",
    summary: "Choose, recurse, then undo the choice.",
    category: "algorithm-templates",
    keywords: ["backtracking", "permutations", "combinations", "subsets", "choose explore unchoose", "itertools"],
    syntax: `path: list[int] = []
out: list[list[int]] = []

def backtrack(start: int) -> None:
    out.append(path[:])            # copy!
    for i in range(start, len(options)):
        path.append(options[i])     # choose
        backtrack(i + 1)            # explore
        path.pop()                  # unchoose`,
    complexity: ["Often exponential: O(2^n) subsets, O(n!) permutations"],
    warning: "Append a copy (path[:]) — appending path itself stores the same list, which ends empty.",
    explanation: "For plain enumeration, itertools.permutations, combinations, and product may be enough.",
    related: ["dfs-template", "memoization"],
    documentationUrl: "https://docs.python.org/3/library/itertools.html#itertools.combinations",
  },
  {
    id: "memoization",
    title: "Memoization with functools.cache",
    summary: "Cache results of a pure recursive function automatically.",
    category: "algorithm-templates",
    keywords: ["memoization", "memo", "cache", "lru_cache", "top down dp", "dynamic programming", "functools.cache"],
    syntax: `from functools import cache

@cache
def ways(i: int, j: int) -> int:
    if i == 0 or j == 0:
        return 1
    return ways(i - 1, j) + ways(i, j - 1)

ways.cache_clear()`,
    complexity: ["Time: states × work per state"],
    warning: "Arguments must be hashable — pass tuples, not lists.",
    related: ["bottom-up-dp", "closures-nonlocal", "decorators"],
    pythonVersion: "@cache requires 3.9+ (use @lru_cache(maxsize=None) before)",
    documentationUrl: "https://docs.python.org/3/library/functools.html#functools.cache",
  },
  {
    id: "bottom-up-dp",
    title: "Bottom-up dynamic programming table",
    summary: "Fill a 1-D or 2-D table iteratively from base cases.",
    category: "algorithm-templates",
    keywords: ["bottom up dp", "tabulation", "dp table", "2d dp", "dynamic programming", "rolling array"],
    syntax: `dp = [[0] * (cols + 1) for _ in range(rows + 1)]
for r in range(1, rows + 1):
    for c in range(1, cols + 1):
        dp[r][c] = combine(dp[r - 1][c], dp[r][c - 1])
answer = dp[rows][cols]`,
    complexity: ["O(rows × cols) time and space; often reducible to one row"],
    warning: "Never build the table with [[0] * cols] * rows — every row aliases the same list.",
    related: ["memoization", "comprehensions"],
  },
];

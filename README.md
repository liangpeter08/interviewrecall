# PyRecall

A fast, keyboard-first Python syntax reference for technical interview preparation.

PyRecall helps engineers retrieve a forgotten language construct—such as a custom sort key, heap operation, class method, regex match, or BFS queue—without generating a solution to the interview problem itself.

> The product answers “How does this Python feature work?” It does not answer “How do I solve this interview problem?”

## Why this exists

Experienced engineers often know the correct algorithm but lose time recalling exact Python syntax or standard-library behavior:

- Does `list.sort()` return the list?
- How do I represent a max heap with `heapq`?
- What does `bisect_left()` return?
- What is the difference between `@classmethod` and `@staticmethod`?
- How do I sort by score descending and name ascending?
- Does `filter()` return a list or an iterator?

General search engines and chat assistants return too much information. PyRecall returns a small, predictable reference card that is quick to scan and easy to remember.

## Intended use

PyRecall is designed for:

- Interview preparation and deliberate practice
- Timed exercises where documentation is permitted
- Refreshing Python syntax before an interview
- Learning standard-library APIs and their complexity
- Building a personal list of syntax weaknesses

During a real interview, use PyRecall only if reference material is explicitly permitted by the interviewer.

## Product principles

1. **Syntax, not solutions** — explain language features and APIs without solving the user's interview problem.
2. **Useful in five seconds** — the first visible result should contain the minimal canonical syntax.
3. **Keyboard first** — opening search, navigating results, copying code, and closing details must not require a mouse.
4. **Predictable answers** — every result uses the same small card structure.
5. **Offline by default** — all reference content ships with the application.
6. **No account required** — preferences and study history remain local unless synchronization is added later.
7. **Recall before lookup** — the product should help users become less dependent on it over time.

## Non-goals

PyRecall is not:

- A LeetCode solution generator
- A general-purpose chatbot
- A live interview copilot
- A code execution environment
- A replacement for the official Python documentation
- A system-design or behavioral-interview coach

## Core experience

The home screen contains a prominent search field and recently reviewed topics.

Example queries:

```text
max heap
sort by two fields
classmethod
filter iterator
regex full match
queue
lower bound
default mutable argument
graph bfs
dataclass list default
```

A query returns compact cards rather than a generated conversation.

Example result:

---

### Max heap with `heapq`

**Use when:** You need repeated access to the largest value.

```python
import heapq

heap: list[int] = []
heapq.heappush(heap, -value)
largest = -heapq.heappop(heap)
```

**Complexity:** `heappush` and `heappop` are `O(log n)`; peeking at `heap[0]` is `O(1)`.

**Watch out:** Negate values both when inserting and removing them.

**See also:** Min heap · Top K · Priority and payload

---

The interface should display the syntax immediately. Additional explanation remains collapsed until requested.

## Result-card contract

Every reference entry should contain:

| Field                  |      Required | Purpose                          |
| ---------------------- | ------------: | -------------------------------- |
| Title                  |           Yes | Human-readable feature name      |
| Summary                |           Yes | One-sentence description         |
| Syntax                 |           Yes | Minimal canonical Python example |
| Complexity             | When relevant | Time and space behavior          |
| Watch out              |           Yes | Most likely interview mistake    |
| Keywords               |           Yes | Search terms and common aliases  |
| Category               |           Yes | Navigation and filtering         |
| Related topics         |   Recommended | Nearby concepts                  |
| Explanation            |      Optional | Details hidden behind expansion  |
| Python version         | When relevant | Minimum or changed version       |
| Official documentation |   Recommended | Source for verification          |

Cards should not include a complete answer to a recognizable coding challenge.

## Search behavior

Search must tolerate interview-style language rather than requiring exact API names.

Examples:

| Query                    | Expected top result         |
| ------------------------ | --------------------------- |
| `priority queue`         | `heapq` min heap            |
| `largest first heap`     | Max heap pattern            |
| `sort second descending` | Multi-key custom sorting    |
| `dict default list`      | `defaultdict(list)`         |
| `queue pop left`         | `collections.deque`         |
| `first greater equal`    | `bisect_left` / lower bound |
| `static vs class`        | Static and class methods    |
| `list default class`     | Dataclass `default_factory` |
| `match whole string`     | `re.fullmatch`              |
| `copy nested list`       | Shallow versus deep copy    |

### Ranking

Rank matches using the following priority:

1. Exact title or API-name match
2. Exact keyword or alias match
3. Prefix match
4. Category match
5. Fuzzy match in title and keywords
6. Full-text match in summary and explanation

Titles and keywords should carry substantially more weight than long-form content. A query for `heap` should not rank a passing mention of heap above the canonical heap cards.

### Query normalization

Before matching:

- Convert text to lowercase.
- Trim and collapse whitespace.
- Preserve meaningful punctuation in API names such as `__init__`.
- Treat `max-heap`, `max heap`, and `maxheap` as aliases.
- Expand a small curated synonym map.
- Do not use an LLM for the initial release.

Suggested synonym groups:

```ts
const aliases = {
  "priority queue": ["heap", "heapq"],
  "hash map": ["dict", "dictionary"],
  "hash set": ["set"],
  queue: ["deque", "popleft"],
  "lower bound": ["bisect_left", "first greater or equal"],
  "upper bound": ["bisect_right", "first greater"],
  "custom comparator": ["cmp_to_key", "custom sort"],
  constructor: ["__init__", "init"],
  regex: ["re", "regular expression", "pattern match"],
};
```

### Empty and unsuccessful searches

An empty search should show:

- Recently reviewed cards
- Pinned cards
- Popular categories
- A “random recall” practice card

When no strong result exists:

- Show spelling-tolerant suggestions.
- Offer relevant categories.
- Provide an “add missing topic” action.
- Never invent an answer dynamically.

## Recall mode

Recall mode turns passive lookup into deliberate practice.

1. The user selects a topic or category.
2. PyRecall shows only a prompt, such as “Create a max heap and remove its largest value.”
3. The user attempts the syntax from memory.
4. The user reveals the reference card.
5. The user marks the attempt as `Remembered`, `Almost`, or `Missed`.
6. The application schedules weaker topics more frequently.

The first version can use a simple local score rather than a complete spaced-repetition algorithm:

```text
Remembered: next review in 7 days
Almost:     next review tomorrow
Missed:     repeat later in the current session
```

## Scope guardrails

The application should keep searches focused on Python syntax.

Allowed content:

- Standard-library signatures and examples
- Language constructs
- General data-structure templates
- Complexity of built-in operations
- Small generic usage examples
- Common mistakes and edge cases

Out-of-scope content:

- Full solutions for named interview problems
- Problem-specific algorithm derivation
- Answers copied from active assessments
- Hidden assistance during interviews that prohibit external tools

Because the initial product uses curated static content, enforcement primarily happens during content review rather than at query time.

## Initial content catalog

### Python language

- Variables, assignment, unpacking, and swapping
- Truthiness, equality, and identity
- Conditional expressions
- Loops and loop `else`
- Structural pattern matching
- Exceptions and context managers
- Imports and module-level variables

### Functions

- Defining and calling functions
- Positional-only and keyword-only parameters
- Default values
- `*args` and `**kwargs`
- Lambdas
- Closures, `global`, and `nonlocal`
- Decorators
- Generators and `yield`
- Mutable-default trap

### Classes

- Class declaration and `__init__`
- Instance and class attributes
- Instance, class, and static methods
- Inheritance and `super()`
- Properties and setters
- Dataclasses and `default_factory`
- Equality, ordering, and hashing
- Common dunder methods
- Abstract base classes

### Collections

- List operations and slicing
- Tuples and unpacking
- Dictionaries and `.get()`
- Sets and set algebra
- Comprehensions
- `Counter`
- `defaultdict`
- `deque`

### Sorting and searching

- `list.sort()` versus `sorted()`
- `key` and `reverse`
- Multi-key sorting
- Mixed ascending and descending fields
- Stability
- `itemgetter` and `attrgetter`
- `cmp_to_key`
- `bisect_left`, `bisect_right`, and `insort`

### Strings and regular expressions

- Indexing and slicing
- Splitting and joining
- String predicates
- Character codes
- Efficient string construction
- `re.match`, `search`, and `fullmatch`
- Capturing and named groups
- `findall`, `finditer`, `sub`, and `split`

### Interview data structures

- Stack using a list
- Queue using `deque`
- Min heap and max heap
- Heap with priority and payload
- Linked-list node
- Binary-tree node
- Graph adjacency list
- Trie
- Union-find

### Algorithm syntax templates

- Frequency map
- Two pointers
- Sliding window
- Prefix sum
- Binary search and lower bound
- BFS and DFS
- Tree traversal
- Topological sort
- Dijkstra
- Monotonic stack
- Backtracking
- Memoization and bottom-up dynamic programming

These templates should demonstrate syntax and structure without embedding a complete answer to a named challenge.

## Information architecture

```text
Home
├── Search
├── Recent topics
├── Pinned topics
└── Categories
    ├── Language
    ├── Functions
    ├── Classes
    ├── Collections
    ├── Sorting and searching
    ├── Strings and regex
    ├── Data structures
    └── Algorithm templates

Practice
├── Recall session
├── Missed topics
└── Review history

Reference card
├── Syntax
├── Complexity
├── Common mistake
├── Explanation
├── Related topics
└── Official documentation

Settings
├── Theme
├── Font size
├── Reset local history
└── Export/import progress
```

## Keyboard interactions

| Shortcut            | Action                         |
| ------------------- | ------------------------------ |
| `/` or `⌘/Ctrl + K` | Focus search                   |
| `↑` / `↓`           | Move through results           |
| `Enter`             | Open selected card             |
| `Esc`               | Close card or clear search     |
| `⌘/Ctrl + C`        | Copy focused code example      |
| `P`                 | Pin/unpin card                 |
| `R`                 | Start recall mode for the card |
| `?`                 | Open shortcut help             |

Shortcuts should not override text-editing behavior while the user is typing unless the shortcut includes a modifier.

## Recommended implementation

### Stack

- **Vite** for development and static builds
- **React** with **TypeScript** for UI components
- **Fuse.js** for small, client-side fuzzy search
- **Markdown or typed JSON** for curated reference content
- **localStorage** for pins, history, and preferences
- **Vitest** and **Testing Library** for behavior tests
- **Playwright** for critical keyboard and search flows

This project does not initially need a server, database, user account, or AI API. A static deployment keeps it fast, private, inexpensive, and usable offline after caching.

### Why not a hosted search service?

The initial catalog is small enough to load and search in the browser. A hosted search service would introduce latency, cost, tracking, and operational work without improving the core experience.

### Why not an LLM?

Curated results are faster and more predictable. They also prevent the application from drifting from syntax reference into problem solving. An LLM may later help maintainers draft cards, but generated content should be reviewed before publication.

## Suggested repository structure

```text
pyrecall/
├── README.md
├── package.json
├── public/
│   ├── favicon.svg
│   └── manifest.webmanifest
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── components/
│   │   ├── SearchBox.tsx
│   │   ├── SearchResults.tsx
│   │   ├── ReferenceCard.tsx
│   │   ├── CodeBlock.tsx
│   │   └── ShortcutHelp.tsx
│   ├── content/
│   │   ├── classes/
│   │   ├── collections/
│   │   ├── functions/
│   │   ├── language/
│   │   ├── regex/
│   │   ├── searching/
│   │   └── sorting/
│   ├── features/
│   │   ├── practice/
│   │   ├── progress/
│   │   └── search/
│   ├── hooks/
│   ├── lib/
│   │   ├── aliases.ts
│   │   ├── content.ts
│   │   ├── search.ts
│   │   └── storage.ts
│   ├── styles/
│   ├── types/
│   │   └── reference.ts
│   └── main.tsx
├── tests/
│   ├── search.test.ts
│   └── keyboard.spec.ts
└── scripts/
    └── validate-content.ts
```

## Content model

Use a validated, serializable schema. Each card should have a stable identifier so local progress survives title changes.

```ts
export type ReferenceCategory =
  | "language"
  | "functions"
  | "classes"
  | "collections"
  | "sorting-searching"
  | "strings-regex"
  | "data-structures"
  | "algorithm-templates";

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
}
```

Example entry:

```ts
export const maxHeap: ReferenceEntry = {
  id: "heap-max-negation",
  title: "Max heap with heapq",
  summary: "Use negated numeric values to represent a portable max heap.",
  category: "data-structures",
  keywords: ["heap", "heapq", "max heap", "priority queue", "largest first"],
  syntax: `import heapq

heap: list[int] = []
heapq.heappush(heap, -value)
largest = -heapq.heappop(heap)`,
  complexity: ["Peek: O(1)", "Push: O(log n)", "Pop: O(log n)"],
  warning: "Negate both when inserting and removing values.",
  related: ["heap-min", "heap-priority-payload", "heap-top-k"],
  documentationUrl: "https://docs.python.org/3/library/heapq.html",
};
```

## Search index

Build the search index once when content loads. Do not place full code blocks in the highest-weight field.

```ts
import Fuse from "fuse.js";

const search = new Fuse(entries, {
  includeScore: true,
  ignoreLocation: true,
  threshold: 0.32,
  keys: [
    { name: "title", weight: 0.45 },
    { name: "keywords", weight: 0.35 },
    { name: "summary", weight: 0.15 },
    { name: "category", weight: 0.05 },
  ],
});
```

Exact and alias matches should be promoted before fuzzy results. Tune thresholds using a fixed query-evaluation dataset rather than intuition alone.

## Search quality fixture

Keep a checked-in list of representative queries and expected results:

```ts
export const searchExpectations = [
  { query: "max heap", expectedFirst: "heap-max-negation" },
  { query: "pop left", expectedFirst: "deque-queue" },
  { query: "sort returns none", expectedFirst: "sort-vs-sorted" },
  { query: "first >= target", expectedFirst: "bisect-left" },
  { query: "class factory", expectedFirst: "classmethod" },
  {
    query: "mutable dataclass field",
    expectedFirst: "dataclass-default-factory",
  },
  { query: "whole regex", expectedFirst: "regex-fullmatch" },
];
```

Every content or ranking change should run these cases as tests.

## Local data and privacy

Store only:

- Pinned card IDs
- Recently opened card IDs
- Recall outcomes and next-review dates
- Theme and accessibility preferences

Do not store search history by default. If optional history is introduced, explain it clearly and provide a one-click deletion control.

No source code, interview prompt, or personal information should leave the browser in the first release.

## Accessibility

The application should meet WCAG 2.2 AA expectations:

- Complete keyboard navigation
- Visible focus states
- Semantic headings and landmarks
- Search results announced through an appropriate live region
- Sufficient color contrast
- No color-only meaning
- Copy buttons with accessible labels
- User-controlled font size
- Respect for reduced-motion preferences
- Code blocks usable at narrow viewport widths

## Visual direction

Prefer a restrained documentation interface:

- Search is the visual center of the home screen.
- Results use high-contrast cards with short line lengths.
- Code is visually dominant inside a result card.
- Complexity and warnings are scannable but secondary.
- Categories use text labels rather than relying on color.
- Both light and dark themes are supported.
- Avoid dashboards, charts, and gamification that distract from retrieval.

## Performance targets

- First usable render under 1 second on a typical laptop after download
- Search feedback within 50 milliseconds for the initial catalog
- No network request required to perform a search
- Initial compressed JavaScript target under 200 KB where practical
- Lighthouse accessibility score of 95 or higher
- Fully usable at 320 px width

## Content-quality requirements

Every published card must:

1. Run on the supported Python version.
2. Use the smallest example that demonstrates the construct correctly.
3. State mutation or return behavior when it is easy to confuse.
4. Include complexity when relevant.
5. Identify one realistic mistake.
6. Link to official Python documentation when available.
7. Avoid unnecessary imports and unrelated setup.
8. Avoid presenting a full answer to a named interview problem.

Add an automated validation script that checks:

- Unique IDs
- Valid categories
- Non-empty required fields
- Valid references to related-card IDs
- Duplicate or suspiciously similar titles
- HTTPS documentation URLs
- Parseable fenced Python examples where possible

## Testing strategy

### Unit tests

- Alias normalization
- Exact-match promotion
- Fuzzy ranking
- Local-storage serialization
- Recall scheduling
- Content-schema validation

### Component tests

- Search updates results
- Arrow keys change the selected result
- Enter opens a card
- Copy places the expected snippet on the clipboard
- Expanded explanations remain accessible
- Empty and no-result states render correctly

### End-to-end tests

1. Open the application and focus search with `/`.
2. Search for `max heap`.
3. Open the first result using the keyboard.
4. Copy the code example.
5. Pin the card.
6. Reload and confirm the pin remains.
7. Start recall mode and record an outcome.

## MVP

The minimum useful release includes:

- Static, responsive web application
- At least 75 reviewed reference cards
- Keyboard-first search
- Exact, alias, and fuzzy matching
- Consistent reference-card layout
- Copy-code action
- Categories and related-topic navigation
- Pins and recent topics stored locally
- Light and dark themes
- Search quality tests
- Content validation

Recall scheduling, import/export, offline installation, and user-authenticated synchronization can follow later.

## Milestones

### Milestone 1 — Searchable reference

- Create the application shell.
- Define and validate the content schema.
- Import the first 25 high-priority cards.
- Implement exact, alias, and fuzzy search.
- Add keyboard result navigation.

### Milestone 2 — Complete interview catalog

- Expand to at least 75 cards.
- Add category navigation and related cards.
- Add complexity and warning sections.
- Build search-quality fixtures.
- Review every example for correctness.

### Milestone 3 — Personal study workflow

- Add pins and recently reviewed topics.
- Add recall mode.
- Track `Remembered`, `Almost`, and `Missed` locally.
- Add a daily weak-topic queue.

### Milestone 4 — Polish and distribution

- Add offline/PWA behavior.
- Complete accessibility review.
- Meet performance targets.
- Add content export/import.
- Publish as a static site.

## MVP acceptance criteria

The MVP is complete when:

- A new user can find the canonical max-heap syntax in fewer than five seconds.
- The top result is correct for at least 90% of the checked-in representative queries.
- All essential actions are usable with only a keyboard.
- A copied example is syntactically valid and contains no hidden setup.
- Refreshing the page preserves pinned and recent cards.
- Search and reference content work without a backend.
- No feature generates a solution to an interview problem.
- Automated tests cover the critical search and keyboard flows.

## Future ideas

- Installable progressive web application
- Optional compact “interview-permitted reference” mode
- Side-by-side Python-version notes
- User-authored private cards
- Exportable Anki-style recall cards
- Search analytics performed locally on the device
- Maintainer-only AI-assisted card drafting with mandatory review
- Additional language packs using the same content schema

## Contributing content

When proposing a card:

1. Choose one narrowly defined concept.
2. Use a descriptive, searchable title.
3. Add the terms an engineer might say when they forget the API name.
4. Keep the primary example minimal.
5. Add complexity and the most common mistake.
6. Link to official documentation.
7. Add at least one search expectation when introducing new terminology.
8. Confirm that the card teaches syntax rather than solving a particular challenge.

## Definition of success

PyRecall succeeds when users retrieve forgotten syntax quickly during practice, then need the product less frequently because recall mode has helped them internalize it.

## Development

This implementation uses **Next.js (App Router)** instead of Vite so it deploys to Vercel with zero configuration. Every route is prerendered as static HTML at build time, search runs entirely in the browser, and nothing is sent to a server.

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # content validation (incl. python3 ast.parse of every snippet), tests, lint
npm run build      # production build
```

- Cards live in `src/content/*.ts`; the schema is `src/types/reference.ts`.
- Ranking is in `src/lib/search.ts`; expected results are in `tests/search-expectations.ts`.
- Pins, recent cards, recall history, and theme are stored in `localStorage` (`src/lib/storage.ts`).

### Deploying to Vercel

Import the repository at [vercel.com/new](https://vercel.com/new). The defaults for Next.js need no changes: no environment variables, no database.

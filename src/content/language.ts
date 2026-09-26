import type { ReferenceEntry } from "@/types/reference";

const docs = "https://docs.python.org/3";

export const language: ReferenceEntry[] = [
  {
    id: "truthiness-identity",
    title: "Truthiness, equality, and identity",
    summary: "== compares values, `is` compares identity; empty containers, 0, and None are falsy.",
    category: "language",
    keywords: ["truthy", "falsy", "is vs ==", "identity", "equality", "is none", "bool", "empty check"],
    syntax: `if not nums: ...          # empty list/str/dict/set
if x is None: ...         # identity check for None
if a == b: ...            # value equality
if count: ...             # careful: 0 is falsy`,
    warning: "`if node:` treats 0 and empty values as missing — use `if node is not None` when 0 is valid.",
    related: ["conditional-expression"],
    documentationUrl: `${docs}/library/stdtypes.html#truth-value-testing`,
  },
  {
    id: "conditional-expression",
    title: "Conditional expressions and walrus",
    summary: "Inline if/else expressions and := assignment expressions.",
    category: "language",
    keywords: ["ternary", "conditional expression", "inline if", "walrus", ":=", "assignment expression"],
    syntax: `label = "even" if n % 2 == 0 else "odd"
lo, hi = (a, b) if a < b else (b, a)

while (line := f.readline()):
    ...`,
    warning: "Python's ternary is `x if cond else y` — there is no `cond ? x : y`.",
    related: ["truthiness-identity"],
    pythonVersion: ":= requires 3.8+",
    documentationUrl: `${docs}/reference/expressions.html#conditional-expressions`,
  },
  {
    id: "loop-else",
    title: "Loops, range, and loop else",
    summary: "range() for counted loops; `else` on a loop runs only when no break happened.",
    category: "language",
    keywords: ["for loop", "while loop", "range", "loop else", "for else", "break", "continue", "reverse range"],
    syntax: `for i in range(n): ...            # 0 .. n-1
for i in range(n - 1, -1, -1): ...  # n-1 down to 0
for i in reversed(range(n)): ...

for x in items:
    if bad(x):
        break
else:
    print("no break")`,
    warning: "range(a, b) excludes b; a reversed range needs step -1 and stop -1 to include 0.",
    related: ["enumerate-zip"],
    documentationUrl: `${docs}/tutorial/controlflow.html#break-and-continue-statements-and-else-clauses-on-loops`,
  },
  {
    id: "exceptions-context",
    title: "Exceptions and context managers",
    summary: "try/except/else/finally and `with` for automatic cleanup.",
    category: "language",
    keywords: ["try", "except", "finally", "raise", "exception", "with", "context manager", "open file"],
    syntax: `try:
    value = int(text)
except ValueError as e:
    value = 0
else:
    print("parsed")        # only if no exception
finally:
    print("always")

with open("data.txt") as f:
    lines = f.read().splitlines()

raise ValueError("negative size")`,
    warning: "A bare `except:` also catches KeyboardInterrupt and SystemExit — name the exception.",
    related: ["truthiness-identity"],
    documentationUrl: `${docs}/tutorial/errors.html`,
  },
  {
    id: "match-statement",
    title: "Structural pattern matching",
    summary: "match/case dispatches on values and shapes of data.",
    category: "language",
    keywords: ["match", "case", "pattern matching", "switch", "structural pattern"],
    syntax: `match command.split():
    case ["go", direction]:
        move(direction)
    case ["quit" | "exit"]:
        stop()
    case [x, *rest] if x.isdigit():
        handle(int(x), rest)
    case _:
        print("unknown")`,
    warning: "A bare name in a case (case limit:) captures anything — use dotted names (Color.RED) or literals to compare.",
    related: ["conditional-expression"],
    pythonVersion: "3.10+",
    documentationUrl: `${docs}/tutorial/controlflow.html#match-statements`,
  },
  {
    id: "numbers-infinity",
    title: "Integer division, modulo, and infinity",
    summary: "// floors, % follows the divisor's sign, and float('inf') is a handy sentinel.",
    category: "language",
    keywords: ["floor division", "//", "modulo", "divmod", "infinity", "inf", "math.inf", "int max", "abs", "round"],
    syntax: `import math

7 // 2, -7 // 2      # 3, -4 (floors, not truncates)
-7 % 3               # 2
q, r = divmod(17, 5) # 3, 2
int(-7 / 2)          # -3 (truncate toward zero)
best = float("inf")  # or math.inf
lo = -math.inf`,
    warning: "-7 // 2 is -4, not -3; use int(a / b) to truncate toward zero.",
    related: ["truthiness-identity"],
    documentationUrl: `${docs}/library/stdtypes.html#numeric-types-int-float-complex`,
  },
];

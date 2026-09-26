import type { ReferenceEntry } from "@/types/reference";

const docs = "https://docs.python.org/3/library";

export const stringsRegex: ReferenceEntry[] = [
  {
    id: "string-split-join",
    title: "Splitting and joining strings",
    summary: "split() breaks a string into a list; sep.join() glues an iterable of strings.",
    category: "strings-regex",
    keywords: ["split", "join", "tokenize", "words", "strip", "csv line", "string to list"],
    syntax: `words = line.split()          # any whitespace, drops empties
parts = line.split(",")       # exact separator, keeps empties
key, _, val = line.partition("=")
text = " ".join(words)
line = line.strip()           # also lstrip / rstrip`,
    complexity: ["O(n)"],
    warning: "join needs strings: \", \".join(map(str, nums)) for numbers.",
    related: ["string-building", "string-slicing"],
    documentationUrl: `${docs}/stdtypes.html#str.split`,
  },
  {
    id: "string-building",
    title: "Efficient string construction",
    summary: "Collect pieces in a list and join once instead of repeated +=.",
    category: "strings-regex",
    keywords: ["string builder", "concatenate", "join", "f-string", "string append", "format"],
    syntax: `parts: list[str] = []
for ch in text:
    parts.append(ch.upper())
result = "".join(parts)

label = f"{name}: {score:.2f} ({pct:>5.1%})"`,
    complexity: ["join: O(total length)", "Repeated += can be O(n²)"],
    warning: "Strings are immutable; s += c in a loop may copy the whole string each time.",
    related: ["string-split-join"],
    documentationUrl: `${docs}/string.html#format-specification-mini-language`,
  },
  {
    id: "string-slicing",
    title: "String indexing, predicates, and character codes",
    summary: "Index and slice like lists; test character classes; convert with ord/chr.",
    category: "strings-regex",
    keywords: ["ord", "chr", "isalpha", "isdigit", "isalnum", "character code", "ascii", "reverse string", "palindrome check", "lowercase"],
    syntax: `s[0], s[-1], s[::-1]
s.isalnum(), s.isalpha(), s.isdigit(), s.isspace()
s.lower(), s.upper()
idx = ord(ch) - ord("a")      # 'a' -> 0
ch = chr(ord("a") + idx)
s.startswith("ab"), s.find("x")   # find returns -1 if missing`,
    warning: "s.index(x) raises ValueError when missing; s.find(x) returns -1.",
    related: ["string-split-join", "list-slicing"],
    documentationUrl: `${docs}/stdtypes.html#string-methods`,
  },
  {
    id: "regex-fullmatch",
    title: "re.match, search, and fullmatch",
    summary: "match anchors at the start, search scans anywhere, fullmatch requires the whole string.",
    category: "strings-regex",
    keywords: ["regex", "re", "regular expression", "fullmatch", "match whole string", "whole regex", "search", "pattern match", "validate"],
    syntax: `import re

re.match(r"\\d+", "42abc")       # matches '42' at start
re.search(r"\\d+", "ab42")       # finds '42' anywhere
re.fullmatch(r"\\d+", "42")      # entire string must match

m = re.fullmatch(r"(\\w+)@(\\w+)\\.com", email)
if m:
    user, domain = m.groups()`,
    warning: "re.match does not anchor at the end — use fullmatch (or $) to validate a whole string.",
    related: ["regex-groups", "regex-findall-sub"],
    documentationUrl: `${docs}/re.html#re.fullmatch`,
    recallPrompt: "Check whether an entire string consists only of digits using a regex.",
  },
  {
    id: "regex-groups",
    title: "Capturing and named groups",
    summary: "Extract parts of a match by position or by name.",
    category: "strings-regex",
    keywords: ["regex group", "named group", "capture", "groups", "groupdict", "(?P<name>)"],
    syntax: `import re

m = re.search(r"(?P<year>\\d{4})-(?P<month>\\d{2})", text)
if m:
    m.group(0)          # whole match
    m.group("year")
    m.groupdict()       # {'year': ..., 'month': ...}
re.findall(r"(?:ab)+", s)  # non-capturing group`,
    warning: "The match object is None when nothing matches — check it before calling .group().",
    related: ["regex-fullmatch", "regex-findall-sub"],
    documentationUrl: `${docs}/re.html#match-objects`,
  },
  {
    id: "regex-findall-sub",
    title: "findall, finditer, sub, and split",
    summary: "Find every match, iterate match objects, replace, or split by a pattern.",
    category: "strings-regex",
    keywords: ["findall", "finditer", "sub", "replace regex", "re.split", "all matches", "compile"],
    syntax: `import re

re.findall(r"\\d+", "a1b22")         # ['1', '22']
for m in re.finditer(r"\\d+", s):
    print(m.start(), m.group())
re.sub(r"\\s+", " ", s)               # collapse whitespace
re.split(r"[,;]\\s*", s)
WORD = re.compile(r"[a-z]+", re.IGNORECASE)`,
    warning: "With capture groups, findall returns the groups (tuples if several), not the full matches.",
    related: ["regex-fullmatch", "regex-groups"],
    documentationUrl: `${docs}/re.html#re.findall`,
  },
];

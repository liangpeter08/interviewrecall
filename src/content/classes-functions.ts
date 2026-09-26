import type { ReferenceEntry } from "@/types/reference";

const docs = "https://docs.python.org/3";

export const classes: ReferenceEntry[] = [
  {
    id: "class-init",
    title: "Class declaration and __init__",
    summary: "Define a class with an initializer that sets instance attributes.",
    category: "classes",
    keywords: ["class", "__init__", "init", "constructor", "self", "instance attribute", "__repr__"],
    syntax: `class Account:
    def __init__(self, owner: str, balance: int = 0) -> None:
        self.owner = owner
        self.balance = balance

    def __repr__(self) -> str:
        return f"Account({self.owner!r}, {self.balance})"

acct = Account("ada")`,
    warning: "Forgetting `self.` inside __init__ creates a local variable, not an attribute.",
    related: ["classmethod", "dataclass-basics", "inheritance-super"],
    documentationUrl: `${docs}/tutorial/classes.html`,
  },
  {
    id: "classmethod",
    title: "Instance, class, and static methods",
    summary: "@classmethod receives the class (good for factories); @staticmethod receives nothing implicit.",
    category: "classes",
    keywords: [
      "classmethod",
      "staticmethod",
      "static vs class",
      "class factory",
      "alternate constructor",
      "cls",
      "static method",
      "class method",
    ],
    syntax: `class Point:
    def __init__(self, x: float, y: float) -> None:
        self.x, self.y = x, y

    def norm(self) -> float:              # instance method
        return (self.x ** 2 + self.y ** 2) ** 0.5

    @classmethod
    def from_tuple(cls, t: tuple[float, float]) -> "Point":
        return cls(*t)                    # factory, subclass-friendly

    @staticmethod
    def is_valid(x: float) -> bool:       # no self, no cls
        return x == x`,
    warning: "Use cls(...) in a classmethod rather than the hard-coded class name so subclasses construct themselves.",
    related: ["class-init", "inheritance-super", "property"],
    documentationUrl: `${docs}/library/functions.html#classmethod`,
    recallPrompt: "Add an alternate constructor to a class and a helper that needs neither self nor cls.",
  },
  {
    id: "inheritance-super",
    title: "Inheritance and super()",
    summary: "Subclass a class and call the parent's initializer with super().",
    category: "classes",
    keywords: ["inheritance", "super", "subclass", "parent class", "override", "extends"],
    syntax: `class Animal:
    def __init__(self, name: str) -> None:
        self.name = name

    def speak(self) -> str:
        return "..."

class Dog(Animal):
    def __init__(self, name: str, breed: str) -> None:
        super().__init__(name)
        self.breed = breed

    def speak(self) -> str:
        return "woof"`,
    warning: "If a subclass defines __init__, the parent's __init__ is not run unless you call super().__init__().",
    related: ["class-init", "classmethod"],
    documentationUrl: `${docs}/library/functions.html#super`,
  },
  {
    id: "property",
    title: "Properties and setters",
    summary: "Expose computed or validated attributes with @property.",
    category: "classes",
    keywords: ["property", "getter", "setter", "@property", "computed attribute", "validation"],
    syntax: `class Temperature:
    def __init__(self, celsius: float) -> None:
        self.celsius = celsius           # goes through the setter

    @property
    def celsius(self) -> float:
        return self._celsius

    @celsius.setter
    def celsius(self, value: float) -> None:
        if value < -273.15:
            raise ValueError("below absolute zero")
        self._celsius = value`,
    warning: "Store the value under a different name (_celsius); assigning self.celsius inside the setter recurses forever.",
    related: ["class-init", "classmethod"],
    documentationUrl: `${docs}/library/functions.html#property`,
  },
  {
    id: "dataclass-basics",
    title: "Dataclasses",
    summary: "@dataclass generates __init__, __repr__, and __eq__ from annotated fields.",
    category: "classes",
    keywords: ["dataclass", "dataclasses", "record", "struct", "frozen", "order", "auto init"],
    syntax: `from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int = 0

@dataclass(frozen=True, order=True)
class Version:
    major: int
    minor: int      # compares as (major, minor); hashable`,
    warning: "Fields without defaults must come before fields with defaults.",
    related: ["dataclass-default-factory", "class-init", "eq-hash-order"],
    documentationUrl: `${docs}/library/dataclasses.html`,
  },
  {
    id: "dataclass-default-factory",
    title: "Dataclass default_factory",
    summary: "Use field(default_factory=list) for mutable defaults in a dataclass.",
    category: "classes",
    keywords: [
      "default_factory",
      "dataclass list default",
      "list default class",
      "mutable dataclass field",
      "field",
      "mutable default",
    ],
    syntax: `from dataclasses import dataclass, field

@dataclass
class Team:
    name: str
    members: list[str] = field(default_factory=list)
    scores: dict[str, int] = field(default_factory=dict)`,
    warning: "`members: list[str] = []` raises ValueError in a dataclass — use default_factory.",
    related: ["dataclass-basics", "mutable-default-argument"],
    documentationUrl: `${docs}/library/dataclasses.html#dataclasses.field`,
    recallPrompt: "Give a dataclass a list field that starts empty for every instance.",
  },
  {
    id: "eq-hash-order",
    title: "Equality, ordering, and hashing",
    summary: "Define __eq__, __lt__, and __hash__ so objects compare and work in sets.",
    category: "classes",
    keywords: ["__eq__", "__lt__", "__hash__", "total_ordering", "comparison", "hashable", "sortable object", "dunder"],
    syntax: `from functools import total_ordering

@total_ordering
class Card:
    def __init__(self, rank: int) -> None:
        self.rank = rank

    def __eq__(self, other: object) -> bool:
        return isinstance(other, Card) and self.rank == other.rank

    def __lt__(self, other: "Card") -> bool:
        return self.rank < other.rank

    def __hash__(self) -> int:
        return hash(self.rank)`,
    warning: "Defining __eq__ sets __hash__ to None — the object becomes unhashable unless you define __hash__ too.",
    related: ["dataclass-basics", "heap-priority-payload"],
    documentationUrl: `${docs}/reference/datamodel.html#object.__hash__`,
  },
];

export const functions: ReferenceEntry[] = [
  {
    id: "mutable-default-argument",
    title: "Mutable default argument trap",
    summary: "Default values are evaluated once at definition time, so mutable defaults are shared.",
    category: "functions",
    keywords: ["default mutable argument", "mutable default", "default list", "none default", "shared default"],
    syntax: `def add(item: int, bucket: list[int] | None = None) -> list[int]:
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket`,
    warning: "`def f(x=[])` shares one list across every call that uses the default.",
    related: ["dataclass-default-factory", "args-kwargs"],
    documentationUrl: `${docs}/tutorial/controlflow.html#default-argument-values`,
    recallPrompt: "Write a function with an optional list parameter that starts fresh on each call.",
  },
  {
    id: "args-kwargs",
    title: "*args, **kwargs, and parameter kinds",
    summary: "Accept variable positional/keyword arguments and mark positional-only or keyword-only parameters.",
    category: "functions",
    keywords: ["args", "kwargs", "*args", "**kwargs", "keyword only", "positional only", "varargs", "splat"],
    syntax: `def f(a, b, /, c, *, d=0):   # a, b positional-only; d keyword-only
    ...

def log(*args: object, **kwargs: object) -> None:
    print(args, kwargs)         # tuple, dict

f(*[1, 2], c=3, **{"d": 4})    # unpack at call site`,
    warning: "args is a tuple and kwargs is a dict — mutating them doesn't affect the caller.",
    related: ["mutable-default-argument", "lambda", "decorators"],
    pythonVersion: "`/` requires 3.8+",
    documentationUrl: `${docs}/tutorial/controlflow.html#special-parameters`,
  },
  {
    id: "lambda",
    title: "Lambdas",
    summary: "Anonymous single-expression functions, mostly used as key functions.",
    category: "functions",
    keywords: ["lambda", "anonymous function", "inline function", "key lambda"],
    syntax: `square = lambda x: x * x
pairs.sort(key=lambda p: (p[1], p[0]))
handlers = [lambda x, i=i: x + i for i in range(3)]  # bind i now`,
    warning: "Lambdas in a loop capture the variable, not its value — bind it with a default (i=i).",
    related: ["sort-key-reverse", "closures-nonlocal"],
    documentationUrl: `${docs}/reference/expressions.html#lambda`,
  },
  {
    id: "closures-nonlocal",
    title: "Closures, global, and nonlocal",
    summary: "Inner functions read outer variables; rebinding requires nonlocal (or global).",
    category: "functions",
    keywords: ["closure", "nonlocal", "global", "nested function", "unboundlocalerror", "scope", "counter closure"],
    syntax: `def make_counter():
    count = 0
    def inc() -> int:
        nonlocal count
        count += 1
        return count
    return inc

best = 0
def dfs(node) -> None:
    global best      # module-level name
    ...`,
    warning: "Assigning to an outer name without nonlocal raises UnboundLocalError. Mutating (list.append) needs no keyword.",
    related: ["lambda", "decorators", "memoization"],
    documentationUrl: `${docs}/reference/simple_stmts.html#the-nonlocal-statement`,
  },
  {
    id: "decorators",
    title: "Decorators",
    summary: "A decorator wraps a function; use functools.wraps to keep its metadata.",
    category: "functions",
    keywords: ["decorator", "wrapper", "functools.wraps", "@", "higher order function"],
    syntax: `from functools import wraps

def logged(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        print("calling", fn.__name__)
        return fn(*args, **kwargs)
    return wrapper

@logged
def greet(name: str) -> str:
    return f"hi {name}"`,
    warning: "Forgetting to return the wrapped result (return fn(...)) makes the decorated function return None.",
    related: ["closures-nonlocal", "args-kwargs", "memoization"],
    documentationUrl: `${docs}/library/functools.html#functools.wraps`,
  },
  {
    id: "generators",
    title: "Generators and yield",
    summary: "Functions with yield produce values lazily, one at a time.",
    category: "functions",
    keywords: ["generator", "yield", "yield from", "lazy", "iterator", "next"],
    syntax: `def neighbors(r: int, c: int):
    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        yield r + dr, c + dc

for nr, nc in neighbors(0, 0): ...
first = next(gen, None)          # default instead of StopIteration
yield from other_generator()`,
    warning: "A generator is single-use — iterating it a second time yields nothing.",
    related: ["filter-map-iterators", "comprehensions"],
    documentationUrl: `${docs}/reference/expressions.html#yield-expressions`,
  },
];

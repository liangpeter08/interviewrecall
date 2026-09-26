export type TokenKind = "kw" | "str" | "num" | "com" | "builtin" | "plain";
export interface Token {
  kind: TokenKind;
  text: string;
}

const KEYWORDS = new Set(
  (
    "False None True and as assert async await break case class continue def del elif else except " +
    "finally for from global if import in is lambda match nonlocal not or pass raise return try while with yield"
  ).split(" "),
);
const BUILTINS = new Set(
  (
    "abs all any bool chr dict divmod enumerate filter float frozenset hash int isinstance iter len list " +
    "map max min next object ord print range reversed set sorted str sum super tuple type zip self cls"
  ).split(" "),
);

const TOKEN_RE =
  /(#[^\n]*)|([rbfRBF]{0,2}(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'))|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_]\w*)/g;

/** A tiny Python tokenizer for display only — good enough for short reference snippets. */
export function highlightPython(code: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  for (const m of code.matchAll(TOKEN_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ kind: "plain", text: code.slice(last, idx) });
    const [text, com, str, num, word] = m;
    let kind: TokenKind = "plain";
    if (com) kind = "com";
    else if (str) kind = "str";
    else if (num) kind = "num";
    else if (word) kind = KEYWORDS.has(word) ? "kw" : BUILTINS.has(word) ? "builtin" : "plain";
    out.push({ kind, text });
    last = idx + text.length;
  }
  if (last < code.length) out.push({ kind: "plain", text: code.slice(last) });
  return out;
}

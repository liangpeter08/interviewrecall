"use client";

import { useState } from "react";
import { highlightPython } from "@/lib/highlight";

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function CodeBlock({ code, label }: { code: string; label: string }) {
  const [status, setStatus] = useState<"" | "Copied" | "Copy failed">("");

  async function onCopy() {
    setStatus((await copyText(code)) ? "Copied" : "Copy failed");
    setTimeout(() => setStatus(""), 1500);
  }

  return (
    <div className="code" data-code={code}>
      <pre tabIndex={0} aria-label={`${label} code example`}>
        <code>
          {highlightPython(code).map((t, i) =>
            t.kind === "plain" ? t.text : (
              <span key={i} className={`tok-${t.kind}`}>
                {t.text}
              </span>
            ),
          )}
        </code>
      </pre>
      <button type="button" className="btn copy" onClick={onCopy} aria-label={`Copy ${label} code`}>
        {status || "Copy"}
      </button>
      <span className="sr-only" role="status">
        {status}
      </span>
    </div>
  );
}

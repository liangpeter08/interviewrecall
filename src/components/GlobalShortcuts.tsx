"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export const SEARCH_INPUT_ID = "search-input";

const SHORTCUTS: [string, string][] = [
  ["/  or  ⌘/Ctrl K", "Focus search"],
  ["↑ / ↓", "Move through results"],
  ["Enter", "Open selected card"],
  ["Esc", "Close card or clear search"],
  ["⌘/Ctrl C", "Copy code (card page, nothing selected)"],
  ["P", "Pin / unpin card"],
  ["R", "Start recall for the card"],
  ["?", "Show this help"],
];

export function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

/** Site-wide shortcuts: focus search and open the help dialog. */
export function GlobalShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      const focusSearch = (mod && e.key.toLowerCase() === "k") || (!mod && e.key === "/" && !isTyping(e.target));
      if (focusSearch) {
        e.preventDefault();
        const input = document.getElementById(SEARCH_INPUT_ID) as HTMLInputElement | null;
        if (input) {
          input.focus();
          input.select();
        } else {
          router.push("/?focus=1");
        }
        return;
      }
      if (e.key === "?" && !mod && !isTyping(e.target)) {
        e.preventDefault();
        const d = dialog.current;
        if (d?.open) d.close();
        else d?.showModal();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, pathname]);

  return (
    <dialog ref={dialog} className="help" aria-labelledby="help-title">
      <h2 id="help-title" style={{ fontSize: "1.1rem", marginBottom: 12 }}>
        Keyboard shortcuts
      </h2>
      <table>
        <tbody>
          {SHORTCUTS.map(([keys, action]) => (
            <tr key={keys}>
              <td>
                <kbd>{keys}</kbd>
              </td>
              <td>{action}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form method="dialog" style={{ marginTop: 16, textAlign: "right" }}>
        <button className="btn btn-outline">Close</button>
      </form>
    </dialog>
  );
}

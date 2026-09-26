"use client";

import { togglePin, useLocalState } from "@/lib/storage";

export function PinButton({ id, shortcut = false }: { id: string; shortcut?: boolean }) {
  const pinned = useLocalState().pins.includes(id);
  return (
    <button type="button" className="btn btn-outline" aria-pressed={pinned} onClick={() => togglePin(id)}>
      {pinned ? "★ Pinned" : "☆ Pin"}
      {shortcut && <> <kbd>P</kbd></>}
    </button>
  );
}

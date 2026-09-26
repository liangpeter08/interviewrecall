"use client";

import { setTheme, useLocalState, type Theme } from "@/lib/storage";

const ORDER: Theme[] = ["system", "light", "dark"];
const LABEL: Record<Theme, string> = { system: "Auto", light: "Light", dark: "Dark" };

export function ThemeToggle() {
  const { theme } = useLocalState();
  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
  return (
    <button
      type="button"
      className="btn"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${LABEL[theme]}. Switch to ${LABEL[next]}`}
      title="Change theme"
    >
      ◐ {LABEL[theme]}
    </button>
  );
}

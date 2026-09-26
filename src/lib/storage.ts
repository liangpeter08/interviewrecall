"use client";

import { useSyncExternalStore } from "react";
import { STORAGE_KEY as KEY } from "./storage-key";

export type Outcome = "remembered" | "almost" | "missed";
export type Theme = "system" | "light" | "dark";

export interface RecallRecord {
  outcome: Outcome;
  /** Epoch ms of the next scheduled review. */
  due: number;
  reviewedAt: number;
}

export interface LocalState {
  version: 1;
  pins: string[];
  recent: string[];
  recall: Record<string, RecallRecord>;
  theme: Theme;
}

const EVENT = "pyrecall:storage";
const MAX_RECENT = 8;
const DAY = 24 * 60 * 60 * 1000;

export const DEFAULT_STATE: LocalState = { version: 1, pins: [], recent: [], recall: {}, theme: "system" };

export function parseState(raw: string | null): LocalState {
  if (!raw) return DEFAULT_STATE;
  try {
    const data = JSON.parse(raw) as Partial<LocalState>;
    return {
      version: 1,
      pins: Array.isArray(data.pins) ? data.pins.filter((x) => typeof x === "string") : [],
      recent: Array.isArray(data.recent) ? data.recent.filter((x) => typeof x === "string") : [],
      recall: data.recall && typeof data.recall === "object" ? data.recall : {},
      theme: data.theme === "light" || data.theme === "dark" ? data.theme : "system",
    };
  } catch {
    return DEFAULT_STATE;
  }
}

let cachedRaw: string | null | undefined;
let cachedState: LocalState = DEFAULT_STATE;

function readRaw(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** Current state, read synchronously (for event handlers and effects). */
export function readState(): LocalState {
  return getSnapshot();
}

function getSnapshot(): LocalState {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedState = parseState(raw);
  }
  return cachedState;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useLocalState(): LocalState {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_STATE);
}

export function updateState(fn: (s: LocalState) => LocalState): void {
  const next = fn(getSnapshot());
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage may be unavailable (private mode); the change simply won't persist.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function togglePin(id: string): void {
  updateState((s) => ({
    ...s,
    pins: s.pins.includes(id) ? s.pins.filter((p) => p !== id) : [id, ...s.pins],
  }));
}

export function recordVisit(id: string): void {
  updateState((s) => ({ ...s, recent: [id, ...s.recent.filter((r) => r !== id)].slice(0, MAX_RECENT) }));
}

/** Remembered → 7 days, Almost → tomorrow, Missed → due now (repeat this session). */
export function nextDue(outcome: Outcome, now: number): number {
  if (outcome === "remembered") return now + 7 * DAY;
  if (outcome === "almost") return now + DAY;
  return now;
}

/** Records the outcome and returns the review timestamp. */
export function recordRecall(id: string, outcome: Outcome, now = Date.now()): number {
  updateState((s) => ({
    ...s,
    recall: { ...s.recall, [id]: { outcome, due: nextDue(outcome, now), reviewedAt: now } },
  }));
  return now;
}

export function setTheme(theme: Theme): void {
  updateState((s) => ({ ...s, theme }));
  applyTheme(theme);
}

export function applyTheme(theme: Theme): void {
  if (theme === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
}

export function resetState(): void {
  updateState(() => ({ ...DEFAULT_STATE, theme: getSnapshot().theme }));
}


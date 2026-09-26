"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { entries, getEntry } from "@/content";
import { buildQueue, recallPromptFor } from "@/lib/practice";
import { readState, recordRecall, resetState, useLocalState, type Outcome } from "@/lib/storage";
import { CATEGORIES, type ReferenceEntry } from "@/types/reference";
import { isTyping } from "./GlobalShortcuts";
import { ReferenceCard } from "./ReferenceCard";

const OUTCOMES: { value: Outcome; label: string; key: string; note: string }[] = [
  { value: "missed", label: "Missed", key: "1", note: "again this session" },
  { value: "almost", label: "Almost", key: "2", note: "tomorrow" },
  { value: "remembered", label: "Remembered", key: "3", note: "in 7 days" },
];

export function Practice() {
  const params = useSearchParams();
  const cardId = params.get("card");
  const categoryId = params.get("category");
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const { recall } = useLocalState();

  // Build the queue once per scope; later recall writes shouldn't reshuffle the session.
  const [queue, setQueue] = useState<ReferenceEntry[] | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [now, setNow] = useState(0);
  const [tally, setTally] = useState<Record<Outcome, number>>({ missed: 0, almost: 0, remembered: 0 });
  const scratch = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const single = cardId ? getEntry(cardId) : undefined;
    const pool = single ? [single] : category ? entries.filter((e) => e.category === category.id) : entries;
    /* eslint-disable react-hooks/set-state-in-effect -- the queue depends on client-only localStorage */
    const t = Date.now();
    setNow(t);
    setQueue(buildQueue(pool, readState().recall, t));
    setIndex(0);
    setRevealed(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [cardId, category]);

  const current = queue?.[index];
  const dueCount = useMemo(() => Object.values(recall).filter((r) => r.due <= now).length, [recall, now]);

  function reveal() {
    setRevealed(true);
  }

  function mark(outcome: Outcome) {
    if (!current || !queue) return;
    setNow(recordRecall(current.id, outcome));
    setTally((t) => ({ ...t, [outcome]: t[outcome] + 1 }));
    // Missed cards come back later in the same session.
    if (outcome === "missed" && queue.length > 1) setQueue([...queue, current]);
    setIndex((i) => i + 1);
    setRevealed(false);
    if (scratch.current) scratch.current.value = "";
    scratch.current?.focus();
  }

  // Move focus off the scratch pad so the 1/2/3 grading keys work immediately.
  useEffect(() => {
    if (revealed) document.getElementById("outcome-missed")?.focus({ preventScroll: true });
  }, [revealed]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!revealed && mod && e.key === "Enter") {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      if (!revealed || isTyping(e.target) || mod) return;
      const o = OUTCOMES.find((x) => x.key === e.key);
      if (o) {
        e.preventDefault();
        (document.getElementById(`outcome-${o.value}`) as HTMLButtonElement | null)?.click();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed]);

  const scope = cardId && getEntry(cardId) ? getEntry(cardId)!.title : (category?.label ?? "All topics");
  const reviewed = tally.missed + tally.almost + tally.remembered;

  return (
    <>
      <div className="page-head">
        <h1>Recall practice</h1>
        <p>
          {scope} · Write it from memory, reveal, then grade yourself honestly.
        </p>
      </div>

      <div className="stat-row" aria-label="Session statistics">
        <span>Reviewed this session: {reviewed}</span>
        <span>Missed: {tally.missed}</span>
        <span>Almost: {tally.almost}</span>
        <span>Remembered: {tally.remembered}</span>
        <span>Due overall: {dueCount}</span>
      </div>

      {queue === null ? null : !current ? (
        <div className="card">
          <p style={{ marginTop: 0 }}>Session complete — nothing left in this queue.</p>
          <div className="card-actions">
            <Link className="btn btn-outline" href="/practice">
              Practice all topics
            </Link>
            <Link className="btn btn-outline" href="/">
              Back to search
            </Link>
          </div>
        </div>
      ) : (
        <section aria-labelledby="prompt">
          <p className="muted" style={{ margin: 0 }}>
            Card {index + 1} of {queue.length}
          </p>
          <p id="prompt" className="practice-prompt">
            {recallPromptFor(current)}
          </p>
          <label htmlFor="scratch" className="sr-only">
            Your attempt
          </label>
          <textarea
            id="scratch"
            ref={scratch}
            className="practice-scratch"
            placeholder="Type the syntax from memory…"
            spellCheck={false}
            autoFocus
            key={`${current.id}-${index}`}
          />
          {!revealed ? (
            <div className="outcomes">
              <button type="button" className="btn btn-primary" onClick={reveal}>
                Reveal card <kbd>⌘/Ctrl ↵</kbd>
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setIndex((i) => i + 1)}>
                Skip
              </button>
            </div>
          ) : (
            <>
              <div style={{ marginTop: 16 }}>
                <ReferenceCard entry={current} />
              </div>
              <div className="outcomes" role="group" aria-label="How did you do?">
                {OUTCOMES.map((o) => (
                  <button
                    key={o.value}
                    id={`outcome-${o.value}`}
                    type="button"
                    className="btn btn-outline"
                    onClick={() => mark(o.value)}
                  >
                    {o.label} <span className="muted">({o.note})</span> <kbd>{o.key}</kbd>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      <div className="section">
        <h2>Scope</h2>
        <div className="search-examples">
          <Link className="chip" href="/practice">
            All topics
          </Link>
          {CATEGORIES.map((c) => (
            <Link key={c.id} className="chip" href={`/practice?category=${c.id}`}>
              {c.label}
            </Link>
          ))}
        </div>
        <p className="muted" style={{ fontSize: "0.85rem", marginTop: 16 }}>
          Progress is stored only in this browser.{" "}
          <button
            type="button"
            className="btn"
            style={{ padding: "0 4px", textDecoration: "underline" }}
            onClick={() => {
              if (confirm("Clear pins, recent topics, and recall history from this browser?")) resetState();
            }}
          >
            Reset local history
          </button>
        </p>
      </div>
    </>
  );
}

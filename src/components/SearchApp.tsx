"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { entries, getEntry } from "@/content";
import { createSearch, STRONG_MATCH } from "@/lib/search";
import { topicRequestUrl } from "@/lib/site";
import { useLocalState } from "@/lib/storage";
import { CATEGORIES, type ReferenceEntry } from "@/types/reference";
import { SEARCH_INPUT_ID } from "./GlobalShortcuts";
import { PinButton } from "./PinButton";
import { ReferenceCard } from "./ReferenceCard";

const search = createSearch(entries);
const EXAMPLES = ["max heap", "sort by two fields", "classmethod", "lower bound", "dict default list", "graph bfs"];

function readQueryParam(): string {
  return new URLSearchParams(window.location.search).get("q") ?? "";
}

export function SearchApp() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  // Restore ?q= on load (e.g. after pressing Esc on a card page).
  useEffect(() => {
    const q = readQueryParam();
    if (q) setQuery(q); // eslint-disable-line react-hooks/set-state-in-effect -- one-time sync from the URL
  }, []);

  useEffect(() => {
    const url = query ? `/?q=${encodeURIComponent(query)}` : "/";
    window.history.replaceState(window.history.state, "", url);
  }, [query]);

  const results = useMemo(() => search(query, 8), [query]);
  const strong = results.length > 0 && results[0].score >= STRONG_MATCH;
  const current = results[Math.min(selected, results.length - 1)];

  function changeQuery(q: string) {
    setQuery(q);
    setSelected(0);
  }

  function select(i: number) {
    const next = Math.max(0, Math.min(results.length - 1, i));
    setSelected(next);
    listRef.current?.children[next]?.scrollIntoView({ block: "nearest" });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      select(selected + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      select(selected - 1);
    } else if (e.key === "Enter" && current) {
      e.preventDefault();
      router.push(`/card/${current.entry.id}`);
    } else if (e.key === "Escape") {
      if (query) changeQuery("");
      else inputRef.current?.blur();
    }
  }

  return (
    <>
      <div className="search-hero" role="search">
        <h1>
          <label htmlFor={SEARCH_INPUT_ID}>Which Python syntax do you need?</label>
        </h1>
        <div className="search-box">
          <input
            ref={inputRef}
            id={SEARCH_INPUT_ID}
            type="search"
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="max heap, sort by two fields, lower bound…"
            value={query}
            onChange={(e) => changeQuery(e.target.value)}
            onKeyDown={onKeyDown}
            aria-describedby="search-status"
          />
          <span className="search-hint" aria-hidden="true">
            <kbd>/</kbd>
          </span>
        </div>
        {!query && (
          <div className="search-examples" aria-label="Example searches">
            {EXAMPLES.map((ex) => (
              <button key={ex} type="button" className="chip" onClick={() => changeQuery(ex)}>
                {ex}
              </button>
            ))}
          </div>
        )}
      </div>

      <p id="search-status" className={query ? "result-status" : "sr-only"} aria-live="polite">
        {!query
          ? ""
          : results.length === 0
            ? "No results"
            : `${results.length} result${results.length === 1 ? "" : "s"}${strong ? "" : " — no strong match"}. ↑↓ to move, Enter to open.`}
      </p>

      {query && !strong && <NoStrongMatch query={query} onPick={changeQuery} />}

      {results.length > 0 && (
        <ol className="results" ref={listRef} aria-label="Search results">
          {results.map((r, i) => (
            <li
              key={r.entry.id}
              aria-current={i === selected ? "true" : undefined}
              className={i === selected ? "selected" : undefined}
              onMouseMove={() => i !== selected && setSelected(i)}
            >
              <ReferenceCard entry={r.entry} actions={<PinButton id={r.entry.id} />} />
            </li>
          ))}
        </ol>
      )}

      {!query && <Home />}
    </>
  );
}

function NoStrongMatch({ query, onPick }: { query: string; onPick: (q: string) => void }) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <p style={{ margin: 0 }}>
        No strong match for <strong>“{query}”</strong>.
        {" "}Try an API name or browse a category:
      </p>
      <div className="search-examples">
        {CATEGORIES.map((c) => (
          <Link key={c.id} className="chip" href={`/category/${c.id}`}>
            {c.label}
          </Link>
        ))}
      </div>
      <div className="search-examples">
        {EXAMPLES.slice(0, 3).map((ex) => (
          <button key={ex} type="button" className="chip" onClick={() => onPick(ex)}>
            {ex}
          </button>
        ))}
        <a className="chip" href={topicRequestUrl(query)} target="_blank" rel="noreferrer">
          + Suggest this topic
        </a>
      </div>
    </div>
  );
}

function CardLinks({ ids }: { ids: string[] }) {
  const items = ids.map(getEntry).filter((e): e is ReferenceEntry => Boolean(e));
  return (
    <ul className="link-list">
      {items.map((e) => (
        <li key={e.id}>
          <Link className="link-row" href={`/card/${e.id}`}>
            <strong>{e.title}</strong>
            <span className="summary">{e.summary}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Home() {
  const { pins, recent } = useLocalState();
  const counts = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c.id, entries.filter((e) => e.category === c.id).length])),
    [],
  );

  return (
    <>
      {pins.length > 0 && (
        <section className="section" aria-labelledby="pinned-h">
          <h2 id="pinned-h">Pinned</h2>
          <CardLinks ids={pins} />
        </section>
      )}
      {recent.length > 0 && (
        <section className="section" aria-labelledby="recent-h">
          <h2 id="recent-h">Recently reviewed</h2>
          <CardLinks ids={recent} />
        </section>
      )}
      <section className="section" aria-labelledby="cat-h">
        <h2 id="cat-h">Categories</h2>
        <div className="category-grid">
          {CATEGORIES.map((c) => (
            <Link key={c.id} className="category-tile" href={`/category/${c.id}`}>
              {c.label}
              <span>{counts[c.id]} cards</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section" aria-labelledby="practice-h">
        <h2 id="practice-h">Practice</h2>
        <Link className="link-row" href="/practice">
          <strong>Random recall →</strong>
          <span className="summary">Write the syntax from memory, then check yourself.</span>
        </Link>
      </section>
    </>
  );
}

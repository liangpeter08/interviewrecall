"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { recordVisit, togglePin } from "@/lib/storage";
import type { ReferenceEntry } from "@/types/reference";
import { copyText } from "./CodeBlock";
import { isTyping } from "./GlobalShortcuts";
import { PinButton } from "./PinButton";
import { ReferenceCard } from "./ReferenceCard";

export function CardView({ entry }: { entry: ReferenceEntry }) {
  const router = useRouter();

  useEffect(() => recordVisit(entry.id), [entry.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isTyping(e.target)) return;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "c") {
        // Only take over copy when the user hasn't selected text themselves.
        if (!window.getSelection()?.toString()) {
          e.preventDefault();
          void copyText(entry.syntax);
        }
        return;
      }
      if (mod || e.altKey) return;
      if (e.key === "Escape") {
        if (document.querySelector("dialog[open]")) return;
        if (window.history.length > 1) router.back();
        else router.push("/");
      } else if (e.key === "p" || e.key === "P") {
        togglePin(entry.id);
      } else if (e.key === "r" || e.key === "R") {
        router.push(`/practice?card=${entry.id}`);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entry, router]);

  return (
    <>
      <Link className="back-link" href="/">
        ← Search <kbd>Esc</kbd>
      </Link>
      <ReferenceCard
        entry={entry}
        variant="full"
        headingLevel={1}
        actions={
          <>
            <PinButton id={entry.id} shortcut />
            <Link className="btn btn-outline" href={`/practice?card=${entry.id}`}>
              Recall <kbd>R</kbd>
            </Link>
          </>
        }
      />
    </>
  );
}

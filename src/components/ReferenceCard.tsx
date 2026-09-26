import Link from "next/link";
import { getEntry } from "@/content";
import { categoryLabel, type ReferenceEntry } from "@/types/reference";
import { CodeBlock } from "./CodeBlock";

interface Props {
  entry: ReferenceEntry;
  /** "result" is the compact search card; "full" is the detail page. */
  variant?: "result" | "full";
  headingLevel?: 1 | 2;
  actions?: React.ReactNode;
}

export function ReferenceCard({ entry, variant = "result", headingLevel = 2, actions }: Props) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const full = variant === "full";
  const related = entry.related.map(getEntry).filter((e): e is ReferenceEntry => Boolean(e));

  return (
    <article className="card" aria-labelledby={`title-${entry.id}`}>
      <div className="card-head">
        <Heading className="card-title" id={`title-${entry.id}`}>
          {full ? entry.title : <Link href={`/card/${entry.id}`}>{entry.title}</Link>}
        </Heading>
        <Link className="card-category" href={`/category/${entry.category}`}>
          {categoryLabel(entry.category)}
        </Link>
      </div>
      <p className="card-summary">{entry.summary}</p>

      <CodeBlock code={entry.syntax} label={entry.title} />

      <dl className="card-meta">
        {entry.complexity && (
          <div>
            <dt>Complexity: </dt>
            <dd>{entry.complexity.join(" · ")}</dd>
          </div>
        )}
        <div className="watch-out">
          <dt>
            <strong>Watch out:</strong>{" "}
          </dt>
          <dd>{entry.warning}</dd>
        </div>
        {entry.pythonVersion && (
          <div>
            <dt>Python: </dt>
            <dd>{entry.pythonVersion}</dd>
          </div>
        )}
        {related.length > 0 && (
          <div className="related">
            <dt>See also: </dt>
            {related.map((r) => (
              <dd key={r.id}>
                <Link className="chip" href={`/card/${r.id}`}>
                  {r.title}
                </Link>
              </dd>
            ))}
          </div>
        )}
      </dl>

      {entry.explanation && (
        <details open={full}>
          <summary>Explanation</summary>
          <p>{entry.explanation}</p>
        </details>
      )}

      {(full || actions) && (
        <div className="card-actions">
          {actions}
          {full && entry.documentationUrl && (
            <a href={entry.documentationUrl} target="_blank" rel="noreferrer">
              Official documentation ↗
            </a>
          )}
        </div>
      )}
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { entriesInCategory } from "@/content";
import { CATEGORIES } from "@/types/reference";

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ id: c.id }));
}

function findCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

export async function generateMetadata({ params }: PageProps<"/category/[id]">): Promise<Metadata> {
  const category = findCategory((await params).id);
  return category ? { title: category.label } : {};
}

export default async function CategoryPage({ params }: PageProps<"/category/[id]">) {
  const category = findCategory((await params).id);
  if (!category) notFound();
  const cards = entriesInCategory(category.id);

  return (
    <>
      <Link className="back-link" href="/">
        ← Search
      </Link>
      <div className="page-head">
        <h1>{category.label}</h1>
        <p>
          {cards.length} cards ·{" "}
          <Link href={`/practice?category=${category.id}`}>Practice this category</Link>
        </p>
      </div>
      <ul className="link-list">
        {cards.map((e) => (
          <li key={e.id}>
            <Link className="link-row" href={`/card/${e.id}`}>
              <strong>{e.title}</strong>
              <span className="summary">{e.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

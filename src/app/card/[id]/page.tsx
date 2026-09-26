import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CardView } from "@/components/CardView";
import { entries, getEntry } from "@/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return entries.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: PageProps<"/card/[id]">): Promise<Metadata> {
  const entry = getEntry((await params).id);
  return entry ? { title: entry.title, description: entry.summary } : {};
}

export default async function CardPage({ params }: PageProps<"/card/[id]">) {
  const entry = getEntry((await params).id);
  if (!entry) notFound();
  return <CardView entry={entry} />;
}

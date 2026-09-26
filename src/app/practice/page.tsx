import type { Metadata } from "next";
import { Suspense } from "react";
import { Practice } from "@/components/Practice";

export const metadata: Metadata = { title: "Practice" };

export default function PracticePage() {
  return (
    <Suspense>
      <Practice />
    </Suspense>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-head">
      <h1>Not found</h1>
      <p>
        That card doesn&apos;t exist. <Link href="/">Search the reference</Link>.
      </p>
    </div>
  );
}

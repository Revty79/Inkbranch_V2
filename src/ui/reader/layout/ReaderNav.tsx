import Link from "next/link";

interface ReaderNavProps {
  readonly chronicleId?: string;
}

export function ReaderNav({ chronicleId }: ReaderNavProps) {
  return (
    <nav className="reader-nav" aria-label="Reader navigation">
      <Link href="/reader">Reader Home</Link>
      <Link href="/reader/chronicles">Chronicles</Link>
      {chronicleId ? (
        <>
          <Link href={`/reader/chronicles/${chronicleId}`}>
            Chronicle Summary
          </Link>
          <Link href={`/reader/chronicles/${chronicleId}/scene`}>
            Current Scene
          </Link>
        </>
      ) : null}
    </nav>
  );
}

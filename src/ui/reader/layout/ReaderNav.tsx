import Link from "next/link";

interface ReaderNavProps {
  readonly chronicleId?: string;
}

export function ReaderNav({ chronicleId }: ReaderNavProps) {
  return (
    <nav className="reader-nav" aria-label="Reader navigation">
      <Link href="/reader">Start</Link>
      <Link href="/reader/chronicles">Chronicles</Link>
      {chronicleId ? (
        <>
          <Link href={`/reader/chronicles/${chronicleId}`}>Story so far</Link>
          <Link href={`/reader/chronicles/${chronicleId}/scene`}>
            Continue reading
          </Link>
        </>
      ) : null}
    </nav>
  );
}

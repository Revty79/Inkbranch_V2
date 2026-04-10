import Link from "next/link";

import { ReaderEmptyState } from "@/ui/reader";

export default function ReaderChronicleNotFound() {
  return (
    <ReaderEmptyState
      title="Chronicle not found"
      message="That chronicle is unavailable or no longer exists."
      action={<Link href="/reader/chronicles">Back to chronicles</Link>}
    />
  );
}

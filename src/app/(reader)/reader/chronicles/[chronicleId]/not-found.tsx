import Link from "next/link";

import { ReaderEmptyState } from "@/ui/reader";

export default function ReaderChronicleNotFound() {
  return (
    <ReaderEmptyState
      title="Chronicle not found"
      message="The requested chronicle could not be loaded from runtime state."
      action={<Link href="/reader/chronicles">Back to chronicles</Link>}
    />
  );
}

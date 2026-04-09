import Link from "next/link";

import { ReaderEmptyState } from "@/ui/reader";

export default function ReaderNotFound() {
  return (
    <ReaderEmptyState
      title="Reader route not found"
      message="The requested reader route does not exist."
      action={<Link href="/reader">Back to reader home</Link>}
    />
  );
}

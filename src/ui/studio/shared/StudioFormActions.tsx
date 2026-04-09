import Link from "next/link";

type StudioFormActionsProps = {
  readonly cancelHref: string;
  readonly submitLabel: string;
};

export function StudioFormActions({
  cancelHref,
  submitLabel
}: StudioFormActionsProps) {
  return (
    <div className="studio-form-actions">
      <button type="submit">{submitLabel}</button>
      <Link href={cancelHref}>Cancel</Link>
    </div>
  );
}

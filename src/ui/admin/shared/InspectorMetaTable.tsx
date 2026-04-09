import type { ReactNode } from "react";

export interface InspectorMetaRow {
  readonly label: string;
  readonly value: ReactNode;
}

interface InspectorMetaTableProps {
  readonly rows: InspectorMetaRow[];
}

export function InspectorMetaTable({ rows }: InspectorMetaTableProps) {
  return (
    <table className="admin-meta-table">
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

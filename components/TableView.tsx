import React from "react";
import type { Table } from "@/lib/schema";

interface TableViewProps {
  table: Table;
}

export function TableView({ table }: TableViewProps) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-slate-300 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm text-slate-800 border-collapse">
        <caption className="p-3 text-left font-semibold text-slate-900 bg-slate-100 border-b border-slate-300">
          {table.caption}
        </caption>
        <thead className="bg-slate-200 text-slate-900 border-b border-slate-300">
          <tr>
            {table.headers.map((header, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-4 py-3 font-bold border-r border-slate-300 last:border-r-0"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {table.rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50"}
            >
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="px-4 py-3 border-r border-slate-200 last:border-r-0 leading-normal"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

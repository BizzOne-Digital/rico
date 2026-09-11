"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  isLoading?: boolean;
  mobileCard?: (row: T) => ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No records found.",
  isLoading = false,
  mobileCard,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#EDE9DE] bg-white p-8 text-center text-sm text-[#2D6A4F]">
        Loading...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-[#EDE9DE] bg-white p-8 text-center text-sm text-[#C8C9C7]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {mobileCard ? (
        <div className="space-y-3 md:hidden">
          {data.map((row) => (
            <div
              key={keyExtractor(row)}
              className="rounded-2xl border border-[#EDE9DE] bg-white p-4 shadow-sm"
            >
              {mobileCard(row)}
            </div>
          ))}
        </div>
      ) : null}

      <div className={cn("overflow-hidden rounded-2xl border border-[#EDE9DE] bg-white", mobileCard && "hidden md:block")}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#EDE9DE] bg-[#F5F3EC]/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#2D6A4F]",
                    col.hideOnMobile && "hidden lg:table-cell",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b border-[#EDE9DE]/60 last:border-0 transition-colors hover:bg-[#F5F3EC]/40"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-[#143D2D]",
                      col.hideOnMobile && "hidden lg:table-cell",
                      col.className
                    )}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

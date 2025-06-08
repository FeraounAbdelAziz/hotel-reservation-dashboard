import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/users/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconEdit } from "@tabler/icons-react";
import LongText from "@/components/long-text";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ConfirmDialog } from '@/components/confirm-dialog';

export const reservationColumns: ColumnDef<any>[] = [
  {
    accessorKey: "changed_at",
    header: "Date & Time",
    cell: ({ row }) => new Date(row.original.changed_at).toLocaleString(),
    meta: { className: "w-40" },
  },
  {
    accessorKey: "reservation_id",
    header: "Reservation ID",
    cell: ({ row }) => row.original.reservation_id?.slice(0, 8) + "...",
    meta: { className: "w-32" },
  },
  {
    accessorKey: "field_changed",
    header: "Field Changed",
    cell: ({ row }) => row.original.field_changed,
    meta: { className: "w-32" },
  },
  {
    accessorKey: "old_value",
    header: "Old Value",
    cell: ({ row }) => (
      <span className="text-red-600">{row.original.old_value ?? '-'}</span>
    ),
    meta: { className: "w-32" },
  },
  {
    accessorKey: "new_value",
    header: "New Value",
    cell: ({ row }) => (
      <span className="text-green-600">{row.original.new_value ?? '-'}</span>
    ),
    meta: { className: "w-32" },
  },
  {
    accessorKey: "changed_by",
    header: "Changed By",
    cell: ({ row }) =>
      row.original.changed_by
        ? `${row.original.changed_by.first_name} ${row.original.changed_by.last_name}`
        : '—',
    meta: { className: "w-40" },
    filterFn: (row, id, value) => {
      const changedBy = row.original.changed_by;
      if (!changedBy) return false;
      const fullName = `${changedBy.first_name} ${changedBy.last_name}`;
      return fullName.includes(value);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                // TODO: Implement edit functionality
                console.log("Edit reservation:", row.original);
              }}
            >
              <IconEdit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    meta: { className: "w-12" },
  },
];

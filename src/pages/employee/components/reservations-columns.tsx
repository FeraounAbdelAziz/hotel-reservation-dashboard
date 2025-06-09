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
    accessorKey: "first_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-24">{`${row.original.first_name} ${row.original.last_name}`}</LongText>
    ),
    meta: { className: "w-24" },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap max-w-32 truncate">
        {row.getValue("email")}
      </div>
    ),
    meta: { className: "w-32" },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => <div className="w-24">{row.getValue("phone")}</div>,
    meta: { className: "w-24" },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const [updating, setUpdating] = useState(false);
      const status = row.original.status;
      const id = row.original.id;
      const [currentStatus, setCurrentStatus] = useState(status as keyof typeof statusColors);
      const [dialogOpen, setDialogOpen] = useState(false);
      const [pendingStatus, setPendingStatus] = useState<keyof typeof statusColors | null>(null);

      const statusColors = {
        pending: "bg-yellow-800 text-white border-yellow-800",
        confirmed: "bg-green-800 text-white border-green-800",
        cancelled: "bg-red-800 text-white border-red-800",
      };

      const handleRequestChange = (newStatus: keyof typeof statusColors) => {
        setPendingStatus(newStatus);
        setDialogOpen(true);
      };

      const handleConfirm = async () => {
        if (!pendingStatus) return;
        setUpdating(true);
        const { error } = await supabase
          .from("reservations")
          .update({ status: pendingStatus })
          .eq("id", id);
        if (!error) setCurrentStatus(pendingStatus);
        setUpdating(false);
        setDialogOpen(false);
        setPendingStatus(null);
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span>
                <Badge
                  className={
                    (statusColors[currentStatus] || "bg-gray-100 text-gray-800 border-gray-200") +
                    " cursor-pointer transition-all select-none px-3 py-1 text-xs border font-semibold rounded-md shadow-sm hover:opacity-80 min-w-[90px] text-center flex items-center justify-center gap-1"
                  }
                >
                  {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                </Badge>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[120px] p-1">
              {(Object.keys(statusColors) as (keyof typeof statusColors)[]).map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => handleRequestChange(option)}
                  disabled={updating || currentStatus === option}
                  className="p-0 hover:bg-transparent focus:bg-transparent"
                >
                  <Badge
                    className={
                      (statusColors[option] || "bg-gray-100 text-gray-800 border-gray-200") +
                      " w-full px-3 py-1 text-xs border font-semibold rounded-md shadow-sm cursor-pointer flex items-center justify-center gap-1 m-1 hover:scale-105 transition-transform duration-100"
                    }
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <ConfirmDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title="Change Reservation Status?"
            desc={`Are you sure you want to change the status to "${pendingStatus ? pendingStatus.charAt(0).toUpperCase() + pendingStatus.slice(1) : ''}"?`}
            handleConfirm={handleConfirm}
            isLoading={updating}
            confirmText="Yes, change it"
            cancelBtnText="Cancel"
          />
        </>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
    enableHiding: false,
    meta: { className: "w-24" },
  },
  {
    accessorKey: "check_in",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Check-in" />
    ),
    cell: ({ row }) => new Date(row.getValue("check_in")).toLocaleDateString(),
    meta: { className: "w-24" },
  },
  {
    accessorKey: "check_out",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Check-out" />
    ),
    cell: ({ row }) => new Date(row.getValue("check_out")).toLocaleDateString(),
    meta: { className: "w-24" },
  },
  {
    accessorKey: "room_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Room Type" />
    ),
    cell: ({ row }) =>
      String(row.getValue("room_type")).charAt(0).toUpperCase() +
      String(row.getValue("room_type")).slice(1),
    meta: { className: "w-24" },
  },
  {
    accessorKey: "guests",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Guests" />
    ),
    cell: ({ row }) => row.getValue("guests"),
    meta: { className: "w-16" },
  },
  {
    accessorKey: "chamber_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chamber" />
    ),
    cell: ({ row }) => row.getValue("chamber_number") || "Not Assigned",
    meta: { className: "w-24" },
  },
  {
    accessorKey: "special_requests",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Special Requests" />
    ),
    cell: ({ row }) => (
      <span
        title={row.getValue("special_requests")}
        className="truncate max-w-32 inline-block align-middle"
      >
        {row.getValue("special_requests") || "None"}
      </span>
    ),
    meta: { className: "w-32" },
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

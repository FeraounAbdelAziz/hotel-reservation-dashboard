import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/users/components/data-table-column-header';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconEdit } from '@tabler/icons-react';
import LongText from '@/components/long-text';

export const reservationColumns: ColumnDef<any>[] = [
  {
    accessorKey: 'first_name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({ row }) => <LongText className='max-w-24'>{`${row.original.first_name} ${row.original.last_name}`}</LongText>,
    meta: { className: 'w-24' },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    cell: ({ row }) => <div className='w-fit text-nowrap max-w-32 truncate'>{row.getValue('email')}</div>,
    meta: { className: 'w-32' },
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Phone' />,
    cell: ({ row }) => <div className='w-24'>{row.getValue('phone')}</div>,
    meta: { className: 'w-24' },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const status = row.getValue('status');
      const color = status === 'active' ? 'bg-green-600' : status === 'pending' ? 'bg-yellow-500' : status === 'cancelled' ? 'bg-red-500' : status === 'confirmed' ? 'bg-blue-500' : 'bg-gray-500';
      return <Badge className={`${color} text-white capitalize`}>{status}</Badge>;
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
    enableHiding: false,
    meta: { className: 'w-24' },
  },
  {
    accessorKey: 'check_in',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Check-in' />,
    cell: ({ row }) => new Date(row.getValue('check_in')).toLocaleDateString(),
    meta: { className: 'w-24' },
  },
  {
    accessorKey: 'check_out',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Check-out' />,
    cell: ({ row }) => new Date(row.getValue('check_out')).toLocaleDateString(),
    meta: { className: 'w-24' },
  },
  {
    accessorKey: 'room_type',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Room Type' />,
    cell: ({ row }) => String(row.getValue('room_type')).charAt(0).toUpperCase() + String(row.getValue('room_type')).slice(1),
    meta: { className: 'w-24' },
  },
  {
    accessorKey: 'guests',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Guests' />,
    cell: ({ row }) => row.getValue('guests'),
    meta: { className: 'w-16' },
  },
  {
    accessorKey: 'special_requests',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Special Requests' />,
    cell: ({ row }) => <span title={row.getValue('special_requests')} className='truncate max-w-32 inline-block align-middle'>{row.getValue('special_requests') || 'None'}</span>,
    meta: { className: 'w-32' },
  },
  {
    id: 'actions',
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
                console.log('Edit reservation:', row.original);
              }}
            >
              <IconEdit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    meta: { className: 'w-12' },
  },
]; 
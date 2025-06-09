import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconEdit } from "@tabler/icons-react";

export interface Room {
  id: string;
  room_type: string;
  description: string;
  guests: number;
  size_m2: number;
  beds: number;
  price_per_night: number;
  rating: number;
  amenities: string[];
  features: string[];
  cancellation_policy: string;
  image_urls: string[];
  created_at: string;
}

export const roomColumns: ColumnDef<Room>[] = [
  {
    accessorKey: "room_type",
    header: "Room Type",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return description.length > 50 ? `${description.substring(0, 50)}...` : description;
    },
  },
  {
    accessorKey: "guests",
    header: "Guests",
  },
  {
    accessorKey: "size_m2",
    header: "Size (m²)",
    cell: ({ row }) => {
      const size = row.getValue("size_m2") as number;
      return `${size} m²`;
    },
  },
  {
    accessorKey: "beds",
    header: "Beds",
  },
  {
    accessorKey: "price_per_night",
    header: "Price/Night",
    cell: ({ row }) => {
      const price = row.getValue("price_per_night") as number;
      return `$${price.toFixed(2)}`;
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      return `${rating}/5`;
    },
  },
  {
    accessorKey: "amenities",
    header: "Amenities",
    cell: ({ row }) => {
      const amenities = row.getValue("amenities") as string[];
      return amenities.join(", ");
    },
  },
  {
    accessorKey: "features",
    header: "Features",
    cell: ({ row }) => {
      const features = row.getValue("features") as string[];
      return features.join(", ");
    },
  },
  {
    accessorKey: "cancellation_policy",
    header: "Cancellation Policy",
    cell: ({ row }) => {
      const policy = row.getValue("cancellation_policy") as string;
      return policy.length > 30 ? `${policy.substring(0, 30)}...` : policy;
    },
  },
  {
    accessorKey: "image_urls",
    header: "Images",
    cell: ({ row }) => {
      const images = row.getValue("image_urls") as string[];
      return `${images.length} images`;
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
                console.log("Edit room:", row.original);
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
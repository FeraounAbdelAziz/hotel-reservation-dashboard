import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

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
    cell: ({ }) => {
      return (
        <Button variant="ghost" size="icon">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11.293-11.293a1 1 0 0 0 0-1.414l-3.586-3.586a1 1 0 0 0-1.414 0L3 15v6z"/>
          </svg>
        </Button>
      );
    },
  },
]; 
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RoomsTable } from "./components/rooms-table";
import { Skeleton } from "@/components/ui/skeleton";
import { roomColumns } from "./components/rooms-columns";
import type { Room } from "./components/rooms-columns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

const roomSchema = z.object({
  room_type: z.string().min(1, "Room type is required"),
  description: z.string().min(1, "Description is required"),
  guests: z.coerce.number().min(1, "Guests is required"),
  size_m2: z.coerce.number().min(1, "Size is required"),
  beds: z.coerce.number().min(1, "Beds is required"),
  price_per_night: z.coerce.number().min(0, "Price is required"),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5"),
  amenities: z.string().min(1, "At least one amenity is required"),
  features: z.string().min(1, "At least one feature is required"),
  cancellation_policy: z.string().min(1, "Cancellation policy is required"),
  image_urls: z.string().min(1, "At least one image URL is required"),
});

type RoomFormValues = z.infer<typeof roomSchema>;

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      room_type: "",
      description: "",
      guests: 0,
      size_m2: 0,
      beds: 0,
      price_per_night: 0,
      rating: 0,
      amenities: "",
      features: "",
      cancellation_policy: "",
      image_urls: "",
    },
  });

  useEffect(() => {
    let isMounted = true;
    const fetchRooms = async () => {
      try {
        const { data, error } = await supabase
          .from("rooms")
          .select("*")
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (isMounted) setRooms(data || []);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        if (isMounted) setError("Failed to load rooms. Please try again later.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRooms();
    return () => { isMounted = false; };
  }, []);

  const onSubmit = async (values: RoomFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("rooms")
        .insert([{
          ...values,
          amenities: values.amenities.split(",").map(item => item.trim()),
          features: values.features.split(",").map(item => item.trim()),
          image_urls: values.image_urls.split(",").map(item => item.trim()),
          created_at: new Date().toISOString(),
        }]);

      if (error) throw error;

      // Refresh rooms list
      const { data, error: fetchError } = await supabase
        .from("rooms")
        .select("*")
        .order('created_at', { ascending: false });

      if (!fetchError) setRooms(data || []);
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Success", description: "Room added successfully." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to add room." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Hotel Rooms</CardTitle>
          <Button onClick={() => setIsDialogOpen(true)}>Add Room</Button>
        </CardHeader>
        <CardContent>
          {rooms.length > 0 ? (
            <RoomsTable data={rooms} columns={roomColumns} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No rooms found
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="room_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guests</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size_m2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size (m²)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="beds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beds</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price_per_night"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Night</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (0-5)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" min="0" max="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amenities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amenities (comma-separated)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features (comma-separated)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cancellation_policy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cancellation Policy</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image_urls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URLs (comma-separated)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Room"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
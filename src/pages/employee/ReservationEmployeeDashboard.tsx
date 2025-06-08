import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReservationTable } from "./components/reservations-table";
import { Skeleton } from "@/components/ui/skeleton";
import { reservationColumns } from "./components/reservations-columns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import useStore from '@/store/useStore';

interface Reservation {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  check_in: string;
  check_out: string;
  room_type: string;
  guests: number;
  special_requests?: string;
  created_at: string;
}

const editSchema = z.object({
  status: z.string().min(1),
  check_in: z.string().min(1),
  check_out: z.string().min(1),
  room_type: z.string().min(1),
  special_requests: z.string().optional(),
});

export default function ReservationEmployeeDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const { toast } = useToast();
  const currentUser = useStore(state => state.currentUser);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      check_in: "",
      check_out: "",
      room_type: "",
      special_requests: "",
    },
  });

  useEffect(() => {
    if (editingReservation) {
      form.reset({
        status: editingReservation.status,
        check_in: editingReservation.check_in.slice(0, 10),
        check_out: editingReservation.check_out.slice(0, 10),
        room_type: editingReservation.room_type,
        special_requests: editingReservation.special_requests || "",
      });
    }
  }, [editingReservation, form]);

  useEffect(() => {
    let isMounted = true;
    const fetchReservations = async () => {
      try {
        const { data, error } = await supabase
          .from("reservations")
          .select("*")
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (isMounted) setReservations(data || []);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        if (isMounted) setError("Failed to load reservations. Please try again later.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchReservations();
    return () => { isMounted = false; };
  }, []);

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof editSchema>) => {
    if (!editingReservation || isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Find changed fields
      const changedFields: { field: string; old: any; new: any }[] = [];
      const fieldsToCheck = ["check_in", "check_out", "room_type", "special_requests"];
      for (const field of fieldsToCheck) {
        const oldValue = (editingReservation as any)[field];
        const newValue = (values as any)[field];

        // Log the values being compared
        console.log(`Comparing ${field}: oldValue = ${oldValue}, newValue = ${newValue}`);

        // Ensure both values are in the same format for comparison
        if (field === "check_in" || field === "check_out") {
          // Convert to date strings for comparison
          const formattedOldValue = new Date(oldValue).toISOString().slice(0, 10);
          const formattedNewValue = new Date(newValue).toISOString().slice(0, 10);
          if (formattedOldValue !== formattedNewValue) {
            changedFields.push({
              field,
              old: formattedOldValue,
              new: formattedNewValue,
            });
          }
        } else {
          // For other fields, direct comparison
          if (oldValue !== newValue) {
            changedFields.push({
              field,
              old: oldValue,
              new: newValue,
            });
          }
        }
      }

      // Update reservation
      const { error } = await supabase
        .from("reservations")
        .update({
          check_in: values.check_in,
          check_out: values.check_out,
          room_type: values.room_type,
          special_requests: values.special_requests,
        })
        .eq("id", editingReservation.id);
      if (error) throw error;

      // Log changes to reservation_history
      if (changedFields.length > 0) {
        const inserts = changedFields.map(change => ({
          reservation_id: editingReservation.id,
          field_changed: change.field,
          old_value: change.old,
          new_value: change.new,
          changed_by: currentUser?.id || null,
          changed_at: new Date().toISOString(),
        }));
        const { error: histError } = await supabase.from("reservation_history").insert(inserts);
        if (histError) {
          toast({ variant: "destructive", title: "History Error", description: "Failed to log reservation history." });
        }
      }

      // Refresh reservations
      const { data, error: fetchError } = await supabase
        .from("reservations")
        .select("*")
        .order('created_at', { ascending: false });
      if (!fetchError) setReservations(data || []);
      setIsDialogOpen(false);
      setEditingReservation(null);
      toast({ title: "Success", description: "Reservation updated." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update reservation." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Patch columns to add edit handler
  const columnsWithEdit = reservationColumns.map(col => {
    if (col.id === "actions") {
      return {
        ...col,
        cell: ({ row }: any) => (
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11.293-11.293a1 1 0 0 0 0-1.414l-3.586-3.586a1 1 0 0 0-1.414 0L3 15v6z"/></svg>
          </Button>
        )
      };
    }
    return col;
  });

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
        <CardHeader>
          <CardTitle>Client Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          {reservations.length > 0 ? (
            <ReservationTable data={reservations} columns={columnsWithEdit} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No reservations found
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Reservation</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="check_in"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-in Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="check_out"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-out Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="special_requests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requests</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); setEditingReservation(null); }}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
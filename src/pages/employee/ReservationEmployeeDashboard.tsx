import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReservationTable } from "./components/reservations-table";
import { Skeleton } from "@/components/ui/skeleton";
import { reservationColumns } from "./components/reservations-columns";

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

export default function ReservationEmployeeDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            <ReservationTable data={reservations} columns={reservationColumns} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No reservations found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
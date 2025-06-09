import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReservationTable } from "./components/reservations-history-table";
import { reservationColumns } from "./components/reservations-history-columns";
import useStore from "@/store/useStore";

export default function ReservationHistoryEmployeeDashboard() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userID = useStore(state => state.currentUser?.id);
 console.log(userID);
 

  useEffect(() => {
    const fetchReservationsHistory = async () => {
      try {
        const { data, error } = await supabase
          .from("reservation_history")
          .select(
            `
                id,
                changed_at,
                reservation_id,
                field_changed,
                old_value,
                new_value,
                changed_by (
                id,
                first_name,
                last_name
                )
            `
          )
          .order("changed_at", { ascending: false });

          console.log(data,error);
          
        if (error) throw error;
        setReservations(data || []);
      } catch (err) {
        setError("Failed to load reservation history.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservationsHistory();
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
          <CardTitle>Reservation History</CardTitle>
        </CardHeader>
        <CardContent>
          <ReservationTable data={reservations} columns={reservationColumns} />
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ReservationEmployeeDashboard() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all reservations
    supabase.from("reservations").select("*").then(({ data }) => setReservations(data || []));
    // Fetch all rooms (assuming you have a rooms table)
    supabase.from("rooms").select("*").then(({ data }) => setRooms(data || []));
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Reservation Employee Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Client Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Room</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.user_id}</TableCell>
                  <TableCell>{new Date(r.check_in).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(r.check_out).toLocaleDateString()}</TableCell>
                  <TableCell>{r.room_type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Room Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`px-4 py-2 rounded ${room.is_available ? "bg-green-700 text-green-100" : "bg-red-700 text-red-100"}`}
              >
                Room {room.number} - {room.is_available ? "Available" : "Occupied"}
              </div>
            ))}
          </div>
          <Button className="mt-4" onClick={() => navigate("/employee/room-reservation")}>
            Go to Room Reservation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-200">Client Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Client</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Check-in</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Check-out</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Room</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id}>
                      <td className="px-4 py-2 text-gray-200">{r.user_id}</td>
                      <td className="px-4 py-2 text-gray-200">{new Date(r.check_in).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-gray-200">{new Date(r.check_out).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-gray-200">{r.room_type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-200">Room Availability</CardTitle>
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
            <Button className="mt-4" onClick={() => navigate("/employee/room-reservation")}>Go to Room Reservation</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
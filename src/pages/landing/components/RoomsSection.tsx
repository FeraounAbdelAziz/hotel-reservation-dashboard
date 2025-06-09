import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Users, Maximize2, ChevronRight } from "lucide-react";
import { RoomDetailsDialog } from "@/components/RoomDetailsDialog";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

interface Room {
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

export const RoomsSection = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data, error } = await supabase
          .from("rooms")
          .select("*")
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRooms(data || []);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setShowRoomDetails(true);
  };

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(null);
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="rooms" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl text-black font-bold text-center mb-16">
          Our Rooms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
              onClick={() => handleRoomClick(room)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={room.image_urls[0]}
                  alt={room.room_type}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-lg font-bold text-amber-600">
                    ${room.price_per_night}
                  </span>
                  <span className="text-sm text-gray-600">/night</span>
                </div>

                <div className="absolute top-4 left-4 bg-amber-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                  {room.room_type}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-700 transition-colors duration-300">
                    {room.room_type}
                  </h3>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-amber-800">
                      {room.rating}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem]">
                  {room.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-amber-600" />
                      <span>{room.guests} Guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize2 className="h-4 w-4 text-amber-600" />
                      <span>{room.size_m2}m²</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors duration-300"
                  >
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </div>

      {selectedRoom && (
        <RoomDetailsDialog
          room={selectedRoom}
          open={showRoomDetails}
          onOpenChange={setShowRoomDetails}
          onBook={handleBookRoom}
        />
      )}
    </section>
  );
}; 
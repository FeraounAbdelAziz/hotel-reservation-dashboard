import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as z from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  checkIn: z.date().nullable(),
  checkOut: z.date().nullable(),
  roomType: z.string(),
  guests: z.string(),
  specialRequests: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

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

export const BookingSection = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    checkIn: null,
    checkOut: null,
    roomType: "",
    guests: "2",
    specialRequests: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching rooms:", error);
        toast.error("Failed to load rooms");
        return;
      }

      setRooms(data || []);
    };

    fetchRooms();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      email,
      phone,
      checkIn,
      checkOut,
      roomType,
      specialRequests,
    } = formData;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !checkIn ||
      !checkOut ||
      !roomType
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (checkIn >= checkOut) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    setIsLoading(true);

    try {
      const { error: reservationError } = await supabase
        .from("reservations")
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          check_in: checkIn?.toISOString(),
          check_out: checkOut?.toISOString(),
          room_type: roomType,
          guests: parseInt(formData.guests),
          special_requests: specialRequests || null,
          status: "pending",
          chamber_number: "not assigned"
        });

      if (reservationError) {
        toast.error(reservationError.message);
        return;
      }

      const { data: availableChambers, error: chamberError } = await supabase
        .from('room_chambers')
        .select('id, chamber_number, room_type, status')
        .eq('status', 'available')
        .eq('room_type', roomType)
        .limit(1);

      if (availableChambers && availableChambers.length > 0) {
        const availableChamber = availableChambers[0];
        
        const { error: updateReservationError } = await supabase
          .from("reservations")
          .update({
            chamber_id: availableChamber.id,
            chamber_number: availableChamber.chamber_number,
            status: "pending"
          })
          .eq('email', email)
          .order('created_at', { ascending: false })
          .limit(1);

        if (updateReservationError) {
          console.error('Error updating reservation:', updateReservationError);
          toast.error('Error assigning room');
          return;
        }

        const { error: updateChamberError } = await supabase
          .from('room_chambers')
          .update({ status: 'reserved' })
          .eq('id', availableChamber.id);

        if (updateChamberError) {
          console.error('Error updating chamber status:', updateChamberError);
          toast.error('Error updating room status');
          return;
        }

        toast.success(`Reservation submitted successfully! Assigned to Room ${availableChamber.chamber_number}`);
      } else {
        const { error: updateReservationError } = await supabase
          .from("reservations")
          .update({
            status: "not assigned",
            chamber_number: "not assigned"
          })
          .eq('email', email)
          .order('created_at', { ascending: false })
          .limit(1);

        if (updateReservationError) {
          console.error('Error updating reservation status:', updateReservationError);
          toast.error('Error updating reservation status');
          return;
        }

        toast.success("Reservation submitted successfully! No rooms available at the moment. We'll notify you when a room becomes available.");
      }

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        checkIn: null,
        checkOut: null,
        roomType: "",
        guests: "2",
        specialRequests: "",
      });
    } catch (err) {
      console.error("Error submitting reservation:", err);
      toast.error("Failed to submit reservation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="booking" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Book Your Stay
            </h2>
            <p className="text-gray-600">
              Fill in your details to make a reservation
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="first_name"
                  className="text-sm font-medium text-gray-700"
                >
                  First Name
                </Label>
                <Input
                  id="first_name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="h-12 px-4 rounded-lg border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  placeholder="John"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="last_name"
                  className="text-sm font-medium text-gray-700"
                >
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="h-12 px-4 rounded-lg border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  placeholder="Doe"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12 px-4 rounded-lg border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="h-12 px-4 rounded-lg border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="check_in"
                  className="text-sm font-medium text-gray-700"
                >
                  Check-in Date
                </Label>
                <div className="relative">
                  <DatePicker
                    selected={formData.checkIn}
                    onChange={(date: Date | null) =>
                      handleChange({
                        target: { name: "checkIn", value: date },
                      } as any)
                    }
                    selectsStart
                    startDate={formData.checkIn}
                    endDate={formData.checkOut}
                    minDate={new Date()}
                    required
                    className="h-12 w-full px-4 rounded-lg border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                    placeholderText="Select check-in date"
                    dateFormat="MMMM d, yyyy"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="check_out"
                  className="text-sm font-medium text-gray-700"
                >
                  Check-out Date
                </Label>
                <div className="relative">
                  <DatePicker
                    selected={formData.checkOut}
                    onChange={(date: Date | null) =>
                      handleChange({
                        target: { name: "checkOut", value: date },
                      } as any)
                    }
                    selectsEnd
                    startDate={formData.checkIn}
                    endDate={formData.checkOut}
                    minDate={formData.checkIn || new Date()}
                    required
                    className="h-12 w-full px-4 rounded-lg border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                    placeholderText="Select check-out date"
                    dateFormat="MMMM d, yyyy"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="room_type"
                  className="text-sm font-medium text-gray-700"
                >
                  Room Type
                </Label>
                <Select
                  name="room_type"
                  value={formData.roomType}
                  onValueChange={(value) =>
                    handleChange({
                      target: { name: "roomType", value },
                    } as any)
                  }
                  required
                >
                  <SelectTrigger className="h-12 px-4 rounded-lg border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200">
                    <SelectValue placeholder="Select a room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem
                        key={room.id}
                        value={room.room_type}
                        className="focus:bg-amber-50 focus:text-amber-900"
                      >
                        {room.room_type} - ${room.price_per_night}/night
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="guests"
                  className="text-sm font-medium text-gray-700"
                >
                  Number of Guests
                </Label>
                <Select
                  name="guests"
                  value={formData.guests}
                  onValueChange={(value) =>
                    handleChange({ target: { name: "guests", value } } as any)
                  }
                  required
                >
                  <SelectTrigger className="h-12 px-4 rounded-lg border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200">
                    <SelectValue placeholder="Select number of guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem
                        key={num}
                        value={num.toString()}
                        className="focus:bg-amber-50 focus:text-amber-900"
                      >
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="special_requests"
                className="text-sm font-medium text-gray-700"
              >
                Special Requests
              </Label>
              <Textarea
                id="special_requests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                className="min-h-[100px] px-4 py-3 rounded-lg border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 resize-none"
                placeholder="Any special requests or requirements?"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Book Now"
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}; 
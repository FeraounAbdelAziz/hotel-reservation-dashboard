import { useState } from "react";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Wifi,
  Utensils,
  Waves,
  Mountain,
  Car,
  Shield,
  Calendar,
  Users,
  ChevronRight,
  Maximize2,
  Loader2,
} from "lucide-react";
import { rooms } from "@/data/rooms";
import type { Room } from "@/data/rooms";
import { RoomDetailsDialog } from "@/components/RoomDetailsDialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

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

export default function LandingPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
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
      // First create the reservation
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
          chamber_number: "not assigned" // Default value
        });

      if (reservationError) {
        toast.error(reservationError.message);
        return;
      }

      // Then try to find an available chamber
      const { data: availableChambers, error: chamberError } = await supabase
        .from('room_chambers')
        .select('id, chamber_number, room_type, status')
        .eq('status', 'available')
        .eq('room_type', roomType)
        .limit(1);

      console.log('Available Chambers:', availableChambers);
      console.log('Chamber Error:', chamberError);
      console.log('Searching for room type:', roomType);

      // If we found an available chamber, update both the reservation and chamber
      if (availableChambers && availableChambers.length > 0) {
        const availableChamber = availableChambers[0];
        console.log('Selected Chamber:', availableChamber);
        
        // Update reservation with chamber details
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

        // Update chamber status
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
        // No available rooms, update reservation status to not assigned
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

      // Reset form
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

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setShowRoomDetails(true);
  };

  const handleBookRoom = (roomId: string) => {
    setFormData((prev) => ({ ...prev, roomType: roomId }));
    setShowRoomDetails(false);
    // Scroll to booking form
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: <Wifi className="h-8 w-8" />,
      title: "High-Speed WiFi",
      description:
        "Stay connected with our complimentary ultra-fast internet throughout the hotel",
      gradient: "from-amber-500 to-amber-600",
    },
    {
      icon: <Utensils className="h-8 w-8" />,
      title: "Fine Dining",
      description:
        "Savor exquisite cuisine at our award-winning restaurants and elegant bars",
      gradient: "from-amber-600 to-amber-700",
    },
    {
      icon: <Waves className="h-8 w-8" />,
      title: "Luxury Spa",
      description:
        "Rejuvenate your senses with world-class spa treatments and wellness services",
      gradient: "from-amber-700 to-amber-800",
    },
    {
      icon: <Mountain className="h-8 w-8" />,
      title: "Infinity Pool",
      description:
        "Take a dip in our stunning rooftop pool with breathtaking city views",
      gradient: "from-amber-800 to-amber-900",
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: "Valet Service",
      description:
        "Enjoy hassle-free parking with our complimentary valet and car service",
      gradient: "from-amber-500 to-amber-600",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "24/7 Security",
      description:
        "Rest easy with our round-the-clock security and attentive concierge service",
      gradient: "from-amber-600 to-amber-700",
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Event Spaces",
      description:
        "Host memorable events in our elegant venues with professional support",
      gradient: "from-amber-700 to-amber-800",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Concierge",
      description:
        "Let our dedicated team assist with all your needs and special requests",
      gradient: "from-amber-800 to-amber-900",
    },
  ];

  // Contact Section
  const ContactSection = () => (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get in touch with us for any inquiries or special requests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Location</h3>
                  <p className="text-gray-600 mt-1">
                    123 Luxury Avenue, City Center
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <Phone className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Phone</h3>
                  <p className="text-gray-600 mt-1">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <Mail className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600 mt-1">info@luxuryhotel.com</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Hours</h3>
                  <p className="text-gray-600 mt-1">24/7 Front Desk</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <h3 className="font-medium text-gray-900 mb-4">
              Additional Information
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                Check-in: 3:00 PM
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                Check-out: 11:00 AM
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                Free parking available
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                Airport shuttle service
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10" />
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&auto=format&fit=crop&q=80"
          alt="Luxury Hotel"
          className="h-full w-full object-cover object-center scale-105 animate-subtle-zoom"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-7xl font-bold tracking-tight leading-tight">
                Experience Luxury
                <br />
                <span className="text-amber-400">Like Never Before</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                Indulge in unparalleled comfort and elegance at our
                award-winning hotel
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/20"
                onClick={() =>
                  document
                    .getElementById("booking")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Book Your Stay
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                onClick={() =>
                  document
                    .getElementById("rooms")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Rooms
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span>4.9/5 Guest Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gray-400" />
                <span>5-Star Luxury</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gray-400" />
                <span>City Center Location</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-5xl font-bold mb-4">
              <span className="text-amber-600">Luxury</span>{" "}
              <span className="text-gray-800">Meets</span>{" "}
              <span className="text-amber-600">Comfort</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Experience exceptional amenities and services designed for your
              comfort
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Content */}
                <div className="relative p-8">
                  {/* Icon Container */}
                  <div className="mb-6 inline-flex items-center justify-center p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform duration-500">
                    {feature.icon}
                  </div>

                  {/* Text Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-700 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Effect Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section */}
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
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Price Tag */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-lg font-bold text-amber-600">
                      ${room.price}
                    </span>
                    <span className="text-sm text-gray-600">/night</span>
                  </div>

                  {/* Room Type Badge */}
                  <div className="absolute top-4 left-4 bg-amber-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                    {room.bedType}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-700 transition-colors duration-300">
                      {room.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-amber-800">
                        4.9
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
                        <span>{room.maxGuests} Guests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize2 className="h-4 w-4 text-amber-600" />
                        <span>{room.size}</span>
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

                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
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

            {/* Booking Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
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

                {/* Last Name */}
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

                {/* Email */}
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

                {/* Phone */}
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

                {/* Check-in Date */}
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

                {/* Check-out Date */}
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

                {/* Room Type */}
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
                          value={room.id}
                          className="focus:bg-amber-50 focus:text-amber-900"
                        >
                          {room.name} - ${room.price}/night
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Guests */}
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

              {/* Special Requests */}
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

      <ContactSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">Luxury Haven</h3>
              <p className="text-gray-400 leading-relaxed">
                Experience the perfect blend of luxury, comfort, and exceptional
                service.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact</h3>
              <ul className="space-y-4 text-gray-400">
                <li>123 Luxury Street</li>
                <li>City, Country</li>
                <li>Phone: +1 234 567 890</li>
                <li>Email: info@luxuryhaven.com</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Rooms & Suites
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Dining
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Spa & Wellness
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Follow Us</h3>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Twitter
                </a>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Luxury Haven. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Room Details Dialog */}
      {selectedRoom && (
        <RoomDetailsDialog
          room={selectedRoom}
          open={showRoomDetails}
          onOpenChange={setShowRoomDetails}
          onBook={handleBookRoom}
        />
      )}
    </div>
  );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Room } from "@/data/rooms";
import { useState, useCallback, useEffect } from "react";
import { X, Star, Users, Maximize2, BedDouble, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { roomIcons } from "@/data/roomIcons";

interface RoomDetailsDialogProps {
  room: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBook: (roomId: string) => void;
}

export function RoomDetailsDialog({ room, open, onOpenChange, onBook }: RoomDetailsDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isPresidential = room.id === "presidential";

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  }, [room.images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  }, [room.images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, prevImage, nextImage]);

  // Reset image index when dialog opens
  useEffect(() => {
    if (open) setCurrentImageIndex(0);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <VisuallyHidden>  */}
      <DialogContent className=" max-w-7xl max-h-[95vh] overflow-hidden p-0 bg-black/95">
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only"></DialogTitle>
          <DialogDescription className="sr-only">
            {room.description}
          </DialogDescription>
        </DialogHeader>
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 rounded-full p-2 bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        {/* Main content */}
        <div className="flex h-[95vh]">
          {/* Left side - Image gallery */}
          <div className="relative flex-1 overflow-hidden">
            {/* Main image */}
            <div className="relative h-full w-full">
              <img
                src={room.images[currentImageIndex]}
                alt={`${room.name} - Image ${currentImageIndex + 1}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Navigation arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 bg-black/50 text-white hover:bg-black/70 transition-colors group"
              >
                <ArrowLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 bg-black/50 text-white hover:bg-black/70 transition-colors group"
              >
                <ArrowRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {room.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {room.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300",
                      index === currentImageIndex 
                        ? "ring-2 ring-white ring-offset-2 ring-offset-black" 
                        : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${room.name} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Room details */}
          <div className="w-[500px] overflow-y-auto bg-white">
            <div className="p-8 space-y-8">
              {/* Header */}
              <div>
                <h2 className={cn(
                  "text-3xl font-bold",
                  isPresidential ? "text-amber-900" : "text-gray-900"
                )}>
                  {room.name}
                </h2>
                {isPresidential && (
                  <p className="mt-1 text-amber-700 font-medium">
                    The Crown Jewel of Luxury Accommodation
                  </p>
                )}
                <div className="flex items-center gap-4 mt-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="font-medium">4.9</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-5 w-5 text-amber-700" />
                    <span>{room.maxGuests} Guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize2 className="h-5 w-5 text-amber-700" />
                    <span>{room.size}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BedDouble className="h-5 w-5 text-amber-700" />
                    <span>{room.bedType}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Description</h3>
                <p className="text-gray-600 leading-relaxed">{room.longDescription}</p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-amber-50/50 border border-amber-100">
                      <span className="text-2xl">{roomIcons[amenity.icon]}</span>
                      <span className="text-gray-700 font-medium">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Features</h3>
                <ul className="grid grid-cols-1 gap-2">
                  {room.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Booking card */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 -mx-8 -mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">${room.price}</div>
                    <div className="text-gray-600">per night</div>
                  </div>
                  <Button 
                    onClick={() => onBook(room.id)}
                    className={cn(
                      "px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-md",
                      isPresidential 
                        ? "bg-amber-900 hover:bg-amber-800 text-white" 
                        : "bg-amber-700 hover:bg-amber-800 text-white"
                    )}
                  >
                    Book Now
                  </Button>
                </div>
                <div className="text-center text-sm text-gray-500">
                  {isPresidential ? (
                    <>
                      <div>Free cancellation before check-in</div>
                      <div className="mt-1">Includes VIP airport transfer</div>
                    </>
                  ) : (
                    "Free cancellation before check-in"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      {/* <VisuallyHidden/>  */}
    </Dialog>
  );
} 
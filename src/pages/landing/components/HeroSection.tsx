import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export const HeroSection = () => {
  return (
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
  );
}; 
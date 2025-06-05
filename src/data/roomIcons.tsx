import { Coffee, Tv, Wifi, Bath, AirVent, Utensils } from "lucide-react";

export const roomIcons = {
  wifi: <Wifi className="text-amber-700" />,
  tv: <Tv className="text-amber-700" />,
  coffee: <Coffee className="text-amber-700" />,
  bath: <Bath className="text-amber-700" />,
  airVent: <AirVent className="text-amber-700" />,
  utensils: <Utensils className="text-amber-700" />,
} as const; 
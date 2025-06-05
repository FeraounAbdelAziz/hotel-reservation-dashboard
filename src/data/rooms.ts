export interface RoomAmenity {
  icon: keyof typeof import("./roomIcons").roomIcons;
  name: string;
}

export interface Room {
  id: string;
  name: string;
  price: number;
  description: string;
  size: string;
  maxGuests: number;
  bedType: string;
  images: string[];
  amenities: RoomAmenity[];
  features: string[];
  longDescription: string;
}

// Using high-quality placeholder images from Unsplash
export const rooms: Room[] = [
  {
    id: "standard",
    name: "Standard Room",
    price: 120,
    description: "Comfortable room with modern amenities",
    size: "30 m²",
    maxGuests: 2,
    bedType: "Queen Bed",
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&auto=format&fit=crop&q=80",
    ],
    amenities: [
      { icon: "wifi", name: "Free WiFi" },
      { icon: "tv", name: "Smart TV" },
      { icon: "coffee", name: "Coffee Maker" },
      { icon: "bath", name: "Private Bathroom" },
      { icon: "airVent", name: "Air Conditioning" },
      { icon: "utensils", name: "Room Service" },
    ],
    features: [
      "City view",
      "Work desk",
      "Mini refrigerator",
      "In-room safe",
      "Daily housekeeping",
      "Blackout curtains",
    ],
    longDescription: "Our Standard Room offers a perfect blend of comfort and functionality. Featuring a queen-size bed with premium bedding, a modern workspace, and a private bathroom with rain shower. The room is designed with warm wooden accents and natural lighting, creating a cozy atmosphere for your stay."
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    price: 180,
    description: "Spacious room with premium features",
    size: "40 m²",
    maxGuests: 3,
    bedType: "King Bed + Sofa Bed",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=1200&auto=format&fit=crop&q=80",
    ],
    amenities: [
      { icon: "wifi", name: "High-Speed WiFi" },
      { icon: "tv", name: "55\" Smart TV" },
      { icon: "coffee", name: "Nespresso Machine" },
      { icon: "bath", name: "Rain Shower" },
      { icon: "airVent", name: "Climate Control" },
      { icon: "utensils", name: "Premium Room Service" },
    ],
    features: [
      "Panoramic city view",
      "Executive desk",
      "Mini bar",
      "Digital safe",
      "Twice daily housekeeping",
      "Soundproof windows",
    ],
    longDescription: "The Deluxe Room offers an elevated experience with its spacious layout and premium amenities. Enjoy the comfort of a king-size bed and an additional sofa bed, perfect for families or small groups. The room features elegant wooden furnishings, floor-to-ceiling windows with city views, and a luxurious bathroom with a rain shower."
  },
  {
    id: "suite",
    name: "Executive Suite",
    price: 280,
    description: "Luxurious suite with separate living area",
    size: "60 m²",
    maxGuests: 4,
    bedType: "King Bed + Queen Sofa Bed",
    images: [
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=1200&auto=format&fit=crop&q=80",
    ],
    amenities: [
      { icon: "wifi", name: "Premium WiFi" },
      { icon: "tv", name: "65\" Smart TV" },
      { icon: "coffee", name: "Espresso Bar" },
      { icon: "bath", name: "Jacuzzi Bath" },
      { icon: "airVent", name: "Smart Climate" },
      { icon: "utensils", name: "Butler Service" },
    ],
    features: [
      "Separate living room",
      "Dining area",
      "Executive workspace",
      "Walk-in closet",
      "Premium mini bar",
      "Private balcony",
    ],
    longDescription: "The Executive Suite offers the perfect blend of luxury and functionality. This spacious suite features a separate living area with a dining table, a king-size bedroom, and a luxurious bathroom with a jacuzzi. The suite is adorned with premium wooden finishes, designer furniture, and offers stunning city views from its private balcony."
  },
  {
    id: "presidential",
    name: "Presidential Suite",
    price: 500,
    description: "Ultimate luxury with panoramic views and exclusive amenities",
    size: "120 m²",
    maxGuests: 6,
    bedType: "King Bed + 2 Queen Beds",
    images: [
      "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80",
    ],
    amenities: [
      { icon: "wifi", name: "Ultra-Fast WiFi" },
      { icon: "tv", name: "85\" Smart TV" },
      { icon: "coffee", name: "Premium Bar & Espresso" },
      { icon: "bath", name: "Spa Bathroom & Steam Room" },
      { icon: "airVent", name: "Smart Home & Climate" },
      { icon: "utensils", name: "Private Chef & Butler" },
    ],
    features: [
      "Private rooftop terrace with city views",
      "Full gourmet kitchen with premium appliances",
      "Home theater with surround sound",
      "Private office with high-speed internet",
      "Walk-in wardrobe & dressing room",
      "Private elevator & security access",
      "Exclusive lounge access",
      "Complimentary airport transfer",
      "24/7 concierge service",
      "Daily housekeeping & turndown service",
      "Premium minibar & welcome champagne",
      "Luxury bathroom amenities",
    ],
    longDescription: "Experience unparalleled luxury in our Presidential Suite, the crown jewel of our hotel. This expansive 120m² suite features multiple bedrooms, a gourmet kitchen, and a private rooftop terrace with breathtaking city views. Indulge in the finest amenities including a home theater, spa bathroom with steam room, and a private office. The suite is adorned with custom wooden elements, designer furniture, and state-of-the-art technology. Enjoy personalized service with a dedicated butler, private chef, and 24/7 concierge. Includes exclusive access to our premium lounge, complimentary airport transfers, and daily housekeeping with turndown service. Perfect for discerning travelers seeking the ultimate in luxury accommodation."
  }
]; 
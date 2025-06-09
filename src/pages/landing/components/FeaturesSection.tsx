import { Wifi, Utensils, Waves, Mountain, Car, Shield, Calendar, Users } from "lucide-react";

const features = [
  {
    icon: <Wifi className="h-8 w-8" />,
    title: "High-Speed WiFi",
    description: "Stay connected with our complimentary ultra-fast internet throughout the hotel",
    gradient: "from-amber-500 to-amber-600",
  },
  {
    icon: <Utensils className="h-8 w-8" />,
    title: "Fine Dining",
    description: "Savor exquisite cuisine at our award-winning restaurants and elegant bars",
    gradient: "from-amber-600 to-amber-700",
  },
  {
    icon: <Waves className="h-8 w-8" />,
    title: "Luxury Spa",
    description: "Rejuvenate your senses with world-class spa treatments and wellness services",
    gradient: "from-amber-700 to-amber-800",
  },
  {
    icon: <Mountain className="h-8 w-8" />,
    title: "Infinity Pool",
    description: "Take a dip in our stunning rooftop pool with breathtaking city views",
    gradient: "from-amber-800 to-amber-900",
  },
  {
    icon: <Car className="h-8 w-8" />,
    title: "Valet Service",
    description: "Enjoy hassle-free parking with our complimentary valet and car service",
    gradient: "from-amber-500 to-amber-600",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "24/7 Security",
    description: "Rest easy with our round-the-clock security and attentive concierge service",
    gradient: "from-amber-600 to-amber-700",
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: "Event Spaces",
    description: "Host memorable events in our elegant venues with professional support",
    gradient: "from-amber-700 to-amber-800",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Concierge",
    description: "Let our dedicated team assist with all your needs and special requests",
    gradient: "from-amber-800 to-amber-900",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl font-bold mb-4">
            <span className="text-amber-600">Luxury</span>{" "}
            <span className="text-gray-800">Meets</span>{" "}
            <span className="text-amber-600">Comfort</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Experience exceptional amenities and services designed for your comfort
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />
              <div className="relative p-8">
                <div className="mb-6 inline-flex items-center justify-center p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-700 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 
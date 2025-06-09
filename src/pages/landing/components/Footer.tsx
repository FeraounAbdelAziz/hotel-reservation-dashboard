import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Luxury Hotel</h3>
          <p className="text-gray-400">
            Experience unparalleled luxury and comfort in the heart of the city.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a href="#rooms" className="text-gray-400 hover:text-white transition-colors">
                Rooms
              </a>
            </li>
            <li>
              <a href="#booking" className="text-gray-400 hover:text-white transition-colors">
                Book Now
              </a>
            </li>
            <li>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
          <ul className="space-y-2 text-gray-400">
            <li>123 Luxury Avenue</li>
            <li>City Center, 12345</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Email: info@luxuryhotel.com</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Youtube className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Luxury Hotel. All rights reserved.</p>
      </div>
    </div>
  </footer>
); 
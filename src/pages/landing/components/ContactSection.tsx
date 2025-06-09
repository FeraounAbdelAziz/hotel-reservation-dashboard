import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const ContactSection = () => (
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
-- Insert dummy data for rooms
INSERT INTO public.rooms (
    room_type,
    name,
    description,
    long_description,
    guests,
    size_m2,
    beds,
    price_per_night,
    rating,
    amenities,
    features,
    cancellation_policy,
    image_urls
) VALUES 
(
    'Standard Room',
    'Standard Room',
    'Comfortable room with modern amenities',
    'Our Standard Room offers a perfect blend of comfort and functionality. Featuring a queen-size bed with premium bedding, a modern workspace, and a private bathroom with rain shower. The room is designed with warm wooden accents and natural lighting, creating a cozy atmosphere for your stay.',
    2,
    30,
    'Queen Bed',
    120.00,
    4.5,
    ARRAY['Free WiFi', 'Smart TV', 'Coffee Maker', 'Private Bathroom', 'Air Conditioning', 'Room Service'],
    ARRAY['City view', 'Work desk', 'Mini refrigerator', 'In-room safe', 'Daily housekeeping', 'Blackout curtains'],
    'Free cancellation up to 24 hours before check-in',
    ARRAY[
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&auto=format&fit=crop&q=80'
    ]
),
(
    'Deluxe Room',
    'Deluxe Room',
    'Spacious room with premium features',
    'The Deluxe Room offers an elevated experience with its spacious layout and premium amenities. Enjoy the comfort of a king-size bed and an additional sofa bed, perfect for families or small groups. The room features elegant wooden furnishings, floor-to-ceiling windows with city views, and a luxurious bathroom with a rain shower.',
    3,
    40,
    'King Bed + Sofa Bed',
    180.00,
    4.7,
    ARRAY['High-Speed WiFi', '55" Smart TV', 'Nespresso Machine', 'Rain Shower', 'Climate Control', 'Premium Room Service'],
    ARRAY['Panoramic city view', 'Executive desk', 'Mini bar', 'Digital safe', 'Twice daily housekeeping', 'Soundproof windows'],
    'Free cancellation up to 48 hours before check-in',
    ARRAY[
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=1200&auto=format&fit=crop&q=80'
    ]
),
(
    'Executive Suite',
    'Executive Suite',
    'Luxurious suite with separate living area',
    'The Executive Suite offers the perfect blend of luxury and functionality. This spacious suite features a separate living area with a dining table, a king-size bedroom, and a luxurious bathroom with a jacuzzi. The suite is adorned with premium wooden finishes, designer furniture, and offers stunning city views from its private balcony.',
    4,
    60,
    'King Bed + Queen Sofa Bed',
    280.00,
    4.8,
    ARRAY['Premium WiFi', '65" Smart TV', 'Espresso Bar', 'Jacuzzi Bath', 'Smart Climate', 'Butler Service'],
    ARRAY['Separate living room', 'Dining area', 'Executive workspace', 'Walk-in closet', 'Premium mini bar', 'Private balcony'],
    'Free cancellation up to 72 hours before check-in',
    ARRAY[
        'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=1200&auto=format&fit=crop&q=80'
    ]
),
(
    'Presidential Suite',
    'Presidential Suite',
    'Ultimate luxury with panoramic views and exclusive amenities',
    'Experience unparalleled luxury in our Presidential Suite, the crown jewel of our hotel. This expansive 120m² suite features multiple bedrooms, a gourmet kitchen, and a private rooftop terrace with breathtaking city views. Indulge in the finest amenities including a home theater, spa bathroom with steam room, and a private office. The suite is adorned with custom wooden elements, designer furniture, and state-of-the-art technology. Enjoy personalized service with a dedicated butler, private chef, and 24/7 concierge. Includes exclusive access to our premium lounge, complimentary airport transfers, and daily housekeeping with turndown service. Perfect for discerning travelers seeking the ultimate in luxury accommodation.',
    6,
    120,
    'King Bed + 2 Queen Beds',
    500.00,
    5.0,
    ARRAY['Ultra-Fast WiFi', '85" Smart TV', 'Premium Bar & Espresso', 'Spa Bathroom & Steam Room', 'Smart Home & Climate', 'Private Chef & Butler'],
    ARRAY[
        'Private rooftop terrace with city views',
        'Full gourmet kitchen with premium appliances',
        'Home theater with surround sound',
        'Private office with high-speed internet',
        'Walk-in wardrobe & dressing room',
        'Private elevator & security access',
        'Exclusive lounge access',
        'Complimentary airport transfer',
        '24/7 concierge service',
        'Daily housekeeping & turndown service',
        'Premium minibar & welcome champagne',
        'Luxury bathroom amenities'
    ],
    'Free cancellation up to 7 days before check-in',
    ARRAY[
        'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80'
    ]
); 
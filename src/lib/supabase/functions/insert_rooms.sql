-- Insert Family Suite
INSERT INTO rooms (
    room_type,
    description,
    guests,
    size_m2,
    beds,
    price_per_night,
    rating,
    amenities,
    features,
    cancellation_policy,
    image_urls,
    created_at
) VALUES (
    'Family Suite',
    'Perfect for families with spacious rooms and kid-friendly amenities',
    4,
    45,
    3,
    220,
    4.8,
    ARRAY['Family WiFi', 'Smart TV', 'Coffee Maker', 'Family Bathroom', 'Air Conditioning', 'Room Service'],
    ARRAY['Connected rooms option', 'Kids play area', 'Family dining table', 'Child safety features', 'Extra storage space', 'Blackout curtains'],
    'Free cancellation up to 24 hours before check-in',
    ARRAY[
        'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=80'
    ],
    CURRENT_TIMESTAMP
);

-- Insert Honeymoon Suite
INSERT INTO rooms (
    room_type,
    description,
    guests,
    size_m2,
    beds,
    price_per_night,
    rating,
    amenities,
    features,
    cancellation_policy,
    image_urls,
    created_at
) VALUES (
    'Honeymoon Suite',
    'Romantic retreat with premium amenities and special touches',
    2,
    55,
    1,
    350,
    4.9,
    ARRAY['Premium WiFi', 'Smart TV', 'Espresso Bar', 'Jacuzzi Bath', 'Smart Climate', 'Romantic Dining'],
    ARRAY['Private balcony', 'King-size canopy bed', 'Jacuzzi bathroom', 'Romantic dining area', 'Champagne service', 'Premium minibar', 'Special turndown service', 'Rose petal decoration'],
    'Free cancellation up to 48 hours before check-in',
    ARRAY[
        'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&auto=format&fit=crop&q=80'
    ],
    CURRENT_TIMESTAMP
); 
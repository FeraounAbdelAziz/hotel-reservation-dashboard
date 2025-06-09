-- Create enum for room types
CREATE TYPE room_type AS ENUM (
    'Standard Room',
    'Deluxe Room',
    'Executive Suite',
    'Presidential Suite'
);

-- Create enum for bed types
CREATE TYPE bed_type AS ENUM (
    'Queen Bed',
    'King Bed + Sofa Bed',
    'King Bed + Queen Sofa Bed',
    'King Bed + 2 Queen Beds'
);

-- Create rooms table
CREATE TABLE rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_type room_type NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    size VARCHAR(20) NOT NULL,
    max_guests INTEGER NOT NULL,
    bed_type bed_type NOT NULL,
    long_description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create room_images table for multiple images
CREATE TABLE room_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create room_amenities table
CREATE TABLE room_amenities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    icon VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create room_features table
CREATE TABLE room_features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    feature VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_rooms_updated_at
    BEFORE UPDATE ON rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO rooms (room_type, name, price, description, size, max_guests, bed_type, long_description)
VALUES 
    ('Standard Room', 'Standard Room', 120.00, 'Comfortable room with modern amenities', '30 m²', 2, 'Queen Bed', 'Our Standard Room offers a perfect blend of comfort and functionality. Featuring a queen-size bed with premium bedding, a modern workspace, and a private bathroom with rain shower. The room is designed with warm wooden accents and natural lighting, creating a cozy atmosphere for your stay.'),
    ('Deluxe Room', 'Deluxe Room', 180.00, 'Spacious room with premium features', '40 m²', 3, 'King Bed + Sofa Bed', 'The Deluxe Room offers an elevated experience with its spacious layout and premium amenities. Enjoy the comfort of a king-size bed and an additional sofa bed, perfect for families or small groups. The room features elegant wooden furnishings, floor-to-ceiling windows with city views, and a luxurious bathroom with a rain shower.'),
    ('Executive Suite', 'Executive Suite', 280.00, 'Luxurious suite with separate living area', '60 m²', 4, 'King Bed + Queen Sofa Bed', 'The Executive Suite offers the perfect blend of luxury and functionality. This spacious suite features a separate living area with a dining table, a king-size bedroom, and a luxurious bathroom with a jacuzzi. The suite is adorned with premium wooden finishes, designer furniture, and offers stunning city views from its private balcony.'),
    ('Presidential Suite', 'Presidential Suite', 500.00, 'Ultimate luxury with panoramic views and exclusive amenities', '120 m²', 6, 'King Bed + 2 Queen Beds', 'Experience unparalleled luxury in our Presidential Suite, the crown jewel of our hotel. This expansive 120m² suite features multiple bedrooms, a gourmet kitchen, and a private rooftop terrace with breathtaking city views. Indulge in the finest amenities including a home theater, spa bathroom with steam room, and a private office. The suite is adorned with custom wooden elements, designer furniture, and state-of-the-art technology. Enjoy personalized service with a dedicated butler, private chef, and 24/7 concierge. Includes exclusive access to our premium lounge, complimentary airport transfers, and daily housekeeping with turndown service. Perfect for discerning travelers seeking the ultimate in luxury accommodation.'); 
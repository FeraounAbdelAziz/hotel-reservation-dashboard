-- Insert chambers for Standard Room
INSERT INTO public.room_chambers (room_type, chamber_number, status) VALUES
('Standard Room', '101', 'available'),
('Standard Room', '102', 'available'),
('Standard Room', '103', 'maintenance'),
('Standard Room', '104', 'available'),
('Standard Room', '105', 'available'),
('Standard Room', '106', 'available');

-- Insert chambers for Deluxe Room
INSERT INTO public.room_chambers (room_type, chamber_number, status) VALUES
('Deluxe Room', '201', 'available'),
('Deluxe Room', '202', 'maintenance'),
('Deluxe Room', '203', 'available'),
('Deluxe Room', '204', 'available'),
('Deluxe Room', '205', 'available');

-- Insert chambers for Executive Suite
INSERT INTO public.room_chambers (room_type, chamber_number, status) VALUES
('Executive Suite', '301', 'available'),
('Executive Suite', '302', 'available'),
('Executive Suite', '303', 'maintenance'),
('Executive Suite', '304', 'available');

-- Insert chambers for Presidential Suite
INSERT INTO public.room_chambers (room_type, chamber_number, status) VALUES
('Presidential Suite', '401', 'available'),
('Presidential Suite', '402', 'maintenance'),
('Presidential Suite', '403', 'available'); 
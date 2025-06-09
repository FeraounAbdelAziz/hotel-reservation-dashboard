-- Add missing columns
ALTER TABLE public.rooms
ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS long_description text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_rooms_updated_at ON public.rooms;
CREATE TRIGGER update_rooms_updated_at
    BEFORE UPDATE ON public.rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update existing data with names and long descriptions
UPDATE public.rooms
SET 
    name = room_type,
    long_description = description
WHERE name = '';

-- Make name column not null after data update
ALTER TABLE public.rooms
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN long_description SET NOT NULL; 
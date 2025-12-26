-- Change year_created from integer to text
ALTER TABLE public.products 
ALTER COLUMN year_created TYPE text USING year_created::text;
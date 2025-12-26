-- Create periods table
CREATE TABLE public.periods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.periods ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view periods" ON public.periods FOR SELECT USING (true);
CREATE POLICY "Admins can manage periods" ON public.periods FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add period fields to products
ALTER TABLE public.products 
ADD COLUMN period_id UUID REFERENCES public.periods(id),
ADD COLUMN period_attribution TEXT;

-- Add check constraint for valid attribution values
ALTER TABLE public.products
ADD CONSTRAINT valid_period_attribution CHECK (period_attribution IS NULL OR period_attribution IN ('attributed to', 'by', 'in the style of'));

-- Insert some common periods
INSERT INTO public.periods (name, slug) VALUES
  ('Art Deco', 'art-deco'),
  ('Art Nouveau', 'art-nouveau'),
  ('Mid-Century Modern', 'mid-century-modern'),
  ('Victorian', 'victorian'),
  ('Edwardian', 'edwardian'),
  ('Georgian', 'georgian'),
  ('Regency', 'regency'),
  ('Empire', 'empire'),
  ('Baroque', 'baroque'),
  ('Renaissance', 'renaissance'),
  ('Modernist', 'modernist'),
  ('Post-Modern', 'post-modern'),
  ('Contemporary', 'contemporary');
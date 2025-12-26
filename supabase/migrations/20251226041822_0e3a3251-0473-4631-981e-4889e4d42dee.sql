-- Create countries table
CREATE TABLE public.countries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  code TEXT, -- ISO 3166-1 alpha-2 code
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view countries" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Admins can manage countries" ON public.countries FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add country_id to products
ALTER TABLE public.products 
ADD COLUMN country_id UUID REFERENCES public.countries(id);

-- Insert common countries
INSERT INTO public.countries (name, slug, code) VALUES
  ('United States', 'united-states', 'US'),
  ('United Kingdom', 'united-kingdom', 'GB'),
  ('France', 'france', 'FR'),
  ('Italy', 'italy', 'IT'),
  ('Germany', 'germany', 'DE'),
  ('Denmark', 'denmark', 'DK'),
  ('Sweden', 'sweden', 'SE'),
  ('Norway', 'norway', 'NO'),
  ('Finland', 'finland', 'FI'),
  ('Netherlands', 'netherlands', 'NL'),
  ('Belgium', 'belgium', 'BE'),
  ('Spain', 'spain', 'ES'),
  ('Japan', 'japan', 'JP'),
  ('China', 'china', 'CN'),
  ('Brazil', 'brazil', 'BR'),
  ('Mexico', 'mexico', 'MX'),
  ('Canada', 'canada', 'CA'),
  ('Australia', 'australia', 'AU'),
  ('India', 'india', 'IN'),
  ('Switzerland', 'switzerland', 'CH'),
  ('Austria', 'austria', 'AT'),
  ('Poland', 'poland', 'PL'),
  ('Czech Republic', 'czech-republic', 'CZ'),
  ('Hungary', 'hungary', 'HU'),
  ('Russia', 'russia', 'RU'),
  ('Portugal', 'portugal', 'PT'),
  ('Greece', 'greece', 'GR'),
  ('Ireland', 'ireland', 'IE'),
  ('South Korea', 'south-korea', 'KR'),
  ('Argentina', 'argentina', 'AR');
-- Add attribution type columns for designer and maker
ALTER TABLE public.products 
ADD COLUMN designer_attribution text,
ADD COLUMN maker_attribution text;

-- Add check constraints for valid values
ALTER TABLE public.products
ADD CONSTRAINT valid_designer_attribution CHECK (designer_attribution IS NULL OR designer_attribution IN ('attributed to', 'by', 'in the style of'));

ALTER TABLE public.products
ADD CONSTRAINT valid_maker_attribution CHECK (maker_attribution IS NULL OR maker_attribution IN ('attributed to', 'by', 'in the style of'));
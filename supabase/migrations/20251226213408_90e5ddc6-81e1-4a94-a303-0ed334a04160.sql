-- Create table for spec sheet downloads
CREATE TABLE public.spec_sheet_downloads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    include_price BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.spec_sheet_downloads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage spec_sheet_downloads" 
ON public.spec_sheet_downloads 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can create spec sheet downloads" 
ON public.spec_sheet_downloads 
FOR INSERT 
WITH CHECK (true);
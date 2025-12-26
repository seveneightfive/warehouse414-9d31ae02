-- Create trigger function to update product status when a hold is placed
CREATE OR REPLACE FUNCTION public.update_product_status_on_hold()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    UPDATE public.products
    SET status = 'on_hold'
    WHERE id = NEW.product_id
    AND status = 'available';
    
    RETURN NEW;
END;
$$;

-- Create trigger that fires after a hold is inserted
CREATE TRIGGER on_product_hold_created
AFTER INSERT ON public.product_holds
FOR EACH ROW
EXECUTE FUNCTION public.update_product_status_on_hold();
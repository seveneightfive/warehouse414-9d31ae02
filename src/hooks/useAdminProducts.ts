import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProductFormData {
  name: string;
  slug: string;
  short_description?: string;
  long_description?: string;
  price?: number;
  status: 'available' | 'on_hold' | 'sold';
  category_id?: string;
  subcategory_id?: string;
  designer_id?: string;
  maker_id?: string;
  style_id?: string;
  year_created?: number;
  product_width?: number;
  product_height?: number;
  product_depth?: number;
  box_width?: number;
  box_height?: number;
  box_depth?: number;
  featured_image_url?: string;
  firstdibs_url?: string;
  chairish_url?: string;
  ebay_url?: string;
}

export function useAdminProducts() {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name),
          subcategory:subcategories(id, name),
          designer:designers(id, name),
          maker:makers(id, name),
          style:styles(id, name),
          product_images(id, image_url, alt_text, sort_order)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createProduct = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const { data: product, error } = await supabase
        .from('products')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product created');
    },
    onError: (error) => {
      toast.error('Failed to create product: ' + error.message);
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductFormData> }) => {
      const { error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product updated');
    },
    onError: (error) => {
      toast.error('Failed to update product: ' + error.message);
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete product: ' + error.message);
    },
  });

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

export function useProductImages(productId: string) {
  const queryClient = useQueryClient();

  const imagesQuery = useQuery({
    queryKey: ['product-images', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order');

      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });

  const uploadImage = useMutation({
    mutationFn: async ({ file, sortOrder }: { file: File; sortOrder: number }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: publicUrl,
          sort_order: sortOrder,
        });

      if (insertError) throw insertError;

      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-images', productId] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Image uploaded');
    },
    onError: (error) => {
      toast.error('Failed to upload image: ' + error.message);
    },
  });

  const deleteImage = useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-images', productId] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Image deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete image: ' + error.message);
    },
  });

  return {
    images: imagesQuery.data || [],
    isLoading: imagesQuery.isLoading,
    uploadImage,
    deleteImage,
  };
}

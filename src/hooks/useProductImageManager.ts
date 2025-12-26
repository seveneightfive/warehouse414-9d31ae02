import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export function useProductImageManager(productId: string | undefined) {
  const queryClient = useQueryClient();

  const imagesQuery = useQuery({
    queryKey: ['product-images', productId],
    queryFn: async () => {
      if (!productId) return [];
      
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order');

      if (error) throw error;
      return data as ProductImage[];
    },
    enabled: !!productId,
  });

  const deleteImage = useMutation({
    mutationFn: async ({ imageId, imageUrl }: { imageId: string; imageUrl: string }) => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-product-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageId, imageUrl }),
        }
      );

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete image');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-images', productId] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Image deleted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete image');
    },
  });

  const reorderImages = useMutation({
    mutationFn: async (reorderedImages: { id: string; sort_order: number }[]) => {
      // Update each image's sort_order
      const updates = reorderedImages.map(({ id, sort_order }) =>
        supabase
          .from('product_images')
          .update({ sort_order })
          .eq('id', id)
      );

      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        throw new Error('Failed to reorder some images');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-images', productId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reorder images');
    },
  });

  const setFeaturedImage = useMutation({
    mutationFn: async (imageUrl: string) => {
      if (!productId) throw new Error('No product ID');
      
      const { error } = await supabase
        .from('products')
        .update({ featured_image_url: imageUrl })
        .eq('id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Featured image updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to set featured image');
    },
  });

  const refreshImages = () => {
    queryClient.invalidateQueries({ queryKey: ['product-images', productId] });
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
  };

  return {
    images: imagesQuery.data || [],
    isLoading: imagesQuery.isLoading,
    deleteImage,
    reorderImages,
    setFeaturedImage,
    refreshImages,
  };
}

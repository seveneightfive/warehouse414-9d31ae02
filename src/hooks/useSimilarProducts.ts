import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductWithRelations } from "@/types/database";

export const useSimilarProducts = (product: ProductWithRelations | null | undefined, limit = 10) => {
  return useQuery({
    queryKey: ['similar-products', product?.id],
    queryFn: async () => {
      if (!product) return [];

      // Build an OR filter for similar products
      const conditions: string[] = [];
      if (product.category_id) conditions.push(`category_id.eq.${product.category_id}`);
      if (product.designer_id) conditions.push(`designer_id.eq.${product.designer_id}`);
      if (product.style_id) conditions.push(`style_id.eq.${product.style_id}`);

      let query = supabase
        .from('products')
        .select(`
          *,
          designer:designers(*),
          maker:makers(*),
          category:categories(*),
          subcategory:subcategories(*),
          style:styles(*),
          period:periods(*),
          country:countries(*),
          product_colors(color:colors(*)),
          product_images(*)
        `)
        .neq('id', product.id)
        .in('status', ['available', 'on_hold', 'sold'])
        .limit(limit);

      if (conditions.length > 0) {
        query = query.or(conditions.join(','));
      }

      const { data, error } = await query;
      if (error) throw error;

      // Score and sort by relevance
      const scored = (data as ProductWithRelations[]).map(p => {
        let score = 0;
        if (p.category_id === product.category_id) score += 3;
        if (p.designer_id === product.designer_id) score += 3;
        if (p.style_id === product.style_id) score += 2;
        if (p.period_id === product.period_id) score += 1;
        if (p.country_id === product.country_id) score += 1;
        // Tag overlap
        if (product.tags && p.tags) {
          const overlap = p.tags.filter(t => product.tags!.includes(t)).length;
          score += overlap * 2;
        }
        // Color overlap
        const productColorIds = product.product_colors?.map(pc => pc.color?.id) || [];
        const pColorIds = p.product_colors?.map(pc => pc.color?.id) || [];
        const colorOverlap = pColorIds.filter(c => productColorIds.includes(c)).length;
        score += colorOverlap * 2;
        return { ...p, _score: score };
      });

      scored.sort((a, b) => b._score - a._score);
      return scored.slice(0, limit);
    },
    enabled: !!product?.id,
  });
};

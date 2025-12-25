import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductWithRelations, FilterState } from "@/types/database";

export const useProducts = (filters: FilterState = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          designer:designers(*),
          maker:makers(*),
          category:categories(*),
          subcategory:subcategories(*),
          style:styles(*),
          product_colors(color:colors(*)),
          product_images(*)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`);
      }

      if (filters.designer) {
        const { data: designerData } = await supabase
          .from('designers')
          .select('id')
          .eq('slug', filters.designer)
          .single();
        if (designerData) {
          query = query.eq('designer_id', designerData.id);
        }
      }

      if (filters.maker) {
        const { data: makerData } = await supabase
          .from('makers')
          .select('id')
          .eq('slug', filters.maker)
          .single();
        if (makerData) {
          query = query.eq('maker_id', makerData.id);
        }
      }

      if (filters.category) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', filters.category)
          .single();
        if (categoryData) {
          query = query.eq('category_id', categoryData.id);
        }
      }

      if (filters.style) {
        const { data: styleData } = await supabase
          .from('styles')
          .select('id')
          .eq('slug', filters.style)
          .single();
        if (styleData) {
          query = query.eq('style_id', styleData.id);
        }
      }

      if (filters.yearFrom) {
        query = query.gte('year_created', filters.yearFrom);
      }

      if (filters.yearTo) {
        query = query.lte('year_created', filters.yearTo);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Filter by color if specified (requires post-processing due to junction table)
      let filteredData = data as ProductWithRelations[];
      
      if (filters.color) {
        const { data: colorData } = await supabase
          .from('colors')
          .select('id')
          .eq('slug', filters.color)
          .single();
        
        if (colorData) {
          filteredData = filteredData.filter(product => 
            product.product_colors?.some(pc => pc.color?.id === colorData.id)
          );
        }
      }

      return filteredData;
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          designer:designers(*),
          maker:makers(*),
          category:categories(*),
          subcategory:subcategories(*),
          style:styles(*),
          product_colors(color:colors(*)),
          product_images(*)
        `)
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data as ProductWithRelations | null;
    },
    enabled: !!slug,
  });
};

export const useFeaturedProducts = (limit: number = 8) => {
  return useQuery({
    queryKey: ['featured-products', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          designer:designers(*),
          maker:makers(*),
          category:categories(*),
          subcategory:subcategories(*),
          style:styles(*),
          product_colors(color:colors(*)),
          product_images(*)
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as ProductWithRelations[];
    },
  });
};

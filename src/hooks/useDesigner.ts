import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Designer } from "@/types/database";

export const useDesigner = (slug: string) => {
  return useQuery({
    queryKey: ['designer', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('designers')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data as Designer | null;
    },
    enabled: !!slug,
  });
};

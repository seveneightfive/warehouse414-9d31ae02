import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAdminCategories() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async ({ name, slug }: { name: string; slug: string }) => {
      const { error } = await supabase.from('categories').insert({ name, slug });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category created');
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, name, slug }: { id: string; name: string; slug: string }) => {
      const { error } = await supabase.from('categories').update({ name, slug }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category updated');
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category deleted');
    },
  });

  return { data: query.data || [], isLoading: query.isLoading, create, update, remove };
}

export function useAdminSubcategories() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin-subcategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*, category:categories(id, name)')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async ({ name, slug, category_id }: { name: string; slug: string; category_id?: string }) => {
      const { error } = await supabase.from('subcategories').insert({ name, slug, category_id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subcategories'] });
      toast.success('Subcategory created');
    },
  });

  return { data: query.data || [], isLoading: query.isLoading, create };
}

export function useAdminDesigners() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin-designers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('designers')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async ({ name, slug, about }: { name: string; slug: string; about?: string }) => {
      const { error } = await supabase.from('designers').insert({ name, slug, about });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-designers'] });
      toast.success('Designer created');
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, name, slug, about }: { id: string; name: string; slug: string; about?: string }) => {
      const { error } = await supabase.from('designers').update({ name, slug, about }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-designers'] });
      toast.success('Designer updated');
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('designers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-designers'] });
      toast.success('Designer deleted');
    },
  });

  return { data: query.data || [], isLoading: query.isLoading, create, update, remove };
}

export function useAdminMakers() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin-makers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('makers')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async ({ name, slug }: { name: string; slug: string }) => {
      const { error } = await supabase.from('makers').insert({ name, slug });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-makers'] });
      toast.success('Maker created');
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, name, slug }: { id: string; name: string; slug: string }) => {
      const { error } = await supabase.from('makers').update({ name, slug }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-makers'] });
      toast.success('Maker updated');
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('makers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-makers'] });
      toast.success('Maker deleted');
    },
  });

  return { data: query.data || [], isLoading: query.isLoading, create, update, remove };
}

export function useAdminStyles() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin-styles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('styles')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async ({ name, slug }: { name: string; slug: string }) => {
      const { error } = await supabase.from('styles').insert({ name, slug });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-styles'] });
      toast.success('Style created');
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, name, slug }: { id: string; name: string; slug: string }) => {
      const { error } = await supabase.from('styles').update({ name, slug }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-styles'] });
      toast.success('Style updated');
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('styles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-styles'] });
      toast.success('Style deleted');
    },
  });

  return { data: query.data || [], isLoading: query.isLoading, create, update, remove };
}

export function useAdminPeriods() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin-periods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('periods')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async ({ name, slug }: { name: string; slug: string }) => {
      const { error } = await supabase.from('periods').insert({ name, slug });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-periods'] });
      toast.success('Period created');
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, name, slug }: { id: string; name: string; slug: string }) => {
      const { error } = await supabase.from('periods').update({ name, slug }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-periods'] });
      toast.success('Period updated');
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('periods').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-periods'] });
      toast.success('Period deleted');
    },
  });

  return { data: query.data || [], isLoading: query.isLoading, create, update, remove };
}

export function useAdminColors() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin-colors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colors')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async ({ name, slug, hex_code }: { name: string; slug: string; hex_code?: string }) => {
      const { error } = await supabase.from('colors').insert({ name, slug, hex_code });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-colors'] });
      toast.success('Color created');
    },
  });

  return { data: query.data || [], isLoading: query.isLoading, create };
}

export function useAdminCountries() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin-countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async ({ name, slug, code }: { name: string; slug: string; code?: string }) => {
      const { error } = await supabase.from('countries').insert({ name, slug, code });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-countries'] });
      toast.success('Country created');
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, name, slug, code }: { id: string; name: string; slug: string; code?: string }) => {
      const { error } = await supabase.from('countries').update({ name, slug, code }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-countries'] });
      toast.success('Country updated');
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('countries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-countries'] });
      toast.success('Country deleted');
    },
  });

  return { data: query.data || [], isLoading: query.isLoading, create, update, remove };
}

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FilterState } from "@/types/database";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const ProductFilters = ({ filters, onFiltersChange }: ProductFiltersProps) => {
  const { data: designers } = useQuery({
    queryKey: ['designers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('designers').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: makers } = useQuery({
    queryKey: ['makers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('makers').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: colors } = useQuery({
    queryKey: ['colors'],
    queryFn: async () => {
      const { data, error } = await supabase.from('colors').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: styles } = useQuery({
    queryKey: ['styles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('styles').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: periods } = useQuery({
    queryKey: ['periods'],
    queryFn: async () => {
      const { data, error } = await supabase.from('periods').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: countries } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data, error } = await supabase.from('countries').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });

  const updateFilter = (key: keyof FilterState, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? undefined : value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value || undefined)}
          className="pl-10 font-body"
        />
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Select
          value={filters.designer || 'all'}
          onValueChange={(value) => updateFilter('designer', value)}
        >
          <SelectTrigger className="font-body">
            <SelectValue placeholder="Designer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Designers</SelectItem>
            {designers?.map((designer) => (
              <SelectItem key={designer.id} value={designer.slug}>
                {designer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.maker || 'all'}
          onValueChange={(value) => updateFilter('maker', value)}
        >
          <SelectTrigger className="font-body">
            <SelectValue placeholder="Maker" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Makers</SelectItem>
            {makers?.map((maker) => (
              <SelectItem key={maker.id} value={maker.slug}>
                {maker.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.category || 'all'}
          onValueChange={(value) => updateFilter('category', value)}
        >
          <SelectTrigger className="font-body">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.style || 'all'}
          onValueChange={(value) => updateFilter('style', value)}
        >
          <SelectTrigger className="font-body">
            <SelectValue placeholder="Style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Styles</SelectItem>
            {styles?.map((style) => (
              <SelectItem key={style.id} value={style.slug}>
                {style.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.period || 'all'}
          onValueChange={(value) => updateFilter('period', value)}
        >
          <SelectTrigger className="font-body">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Periods</SelectItem>
            {periods?.map((period) => (
              <SelectItem key={period.id} value={period.slug}>
                {period.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.country || 'all'}
          onValueChange={(value) => updateFilter('country', value)}
        >
          <SelectTrigger className="font-body">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries?.map((country) => (
              <SelectItem key={country.id} value={country.slug}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.color || 'all'}
          onValueChange={(value) => updateFilter('color', value)}
        >
          <SelectTrigger className="font-body">
            <SelectValue placeholder="Color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colors</SelectItem>
            {colors?.map((color) => (
              <SelectItem key={color.id} value={color.slug}>
                {color.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="font-body"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;

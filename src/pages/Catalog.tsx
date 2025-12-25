import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";
import { useProducts } from "@/hooks/useProducts";
import { FilterState } from "@/types/database";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize filters from URL params
  const initialFilters: FilterState = {
    designer: searchParams.get('designer') || undefined,
    maker: searchParams.get('maker') || undefined,
    color: searchParams.get('color') || undefined,
    category: searchParams.get('category') || undefined,
    style: searchParams.get('style') || undefined,
    search: searchParams.get('search') || undefined,
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const { data: products, isLoading } = useProducts(filters);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
    });
    setSearchParams(params);
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="py-12 md:py-16 bg-secondary stripe-border">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-6xl text-center">CATALOG</h1>
          <p className="font-body text-muted-foreground text-center mt-2">
            {products?.length || 0} unique pieces available
          </p>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} />
          
          <div className="mt-8">
            <ProductGrid products={products || []} isLoading={isLoading} />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;

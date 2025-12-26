import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDesigner } from "@/hooks/useDesigner";
import { useProducts } from "@/hooks/useProducts";
import ProductGrid from "@/components/products/ProductGrid";

const DesignerDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: designer, isLoading: isLoadingDesigner } = useDesigner(slug || '');
  const { data: products, isLoading: isLoadingProducts } = useProducts({ designer: slug });

  if (isLoadingDesigner) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-1/2 mb-4" />
          <Skeleton className="h-24 w-full mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!designer) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-4xl mb-4">DESIGNER NOT FOUND</h1>
          <p className="font-body text-muted-foreground mb-8">
            This designer may have been removed.
          </p>
          <Button asChild>
            <Link to="/catalog">Browse Catalog</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link 
          to="/catalog" 
          className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </Link>
      </div>

      {/* Designer Info */}
      <div className="container mx-auto px-4 pb-8">
        <h1 className="font-display text-4xl md:text-5xl leading-tight">{designer.name}</h1>
        
        {designer.about && (
          <div className="mt-6 max-w-3xl">
            <p className="font-body text-muted-foreground whitespace-pre-wrap">
              {designer.about}
            </p>
          </div>
        )}
      </div>

      {/* Products by Designer */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="font-display text-2xl mb-6">PIECES BY {designer.name.toUpperCase()}</h2>
        
        {isLoadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="font-body text-muted-foreground">
            No products currently available from this designer.
          </p>
        )}
      </div>
    </Layout>
  );
};

export default DesignerDetail;

import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ProductWithRelations } from "@/types/database";

interface ProductCardProps {
  product: ProductWithRelations;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price: number | null) => {
    if (!price) return "Price on request";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link 
      to={`/product/${product.slug}`} 
      className="group product-card block bg-card"
    >
      {/* Image */}
      <div className="aspect-square bg-muted image-zoom relative">
        {product.featured_image_url ? (
          <img
            src={product.featured_image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 stripe-pattern opacity-20" />
          </div>
        )}
        
        {/* Status Badge */}
        {(product.status === 'on_hold' || product.status === 'sold') && (
          <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 text-xs font-body uppercase tracking-wider">
            {product.status === 'on_hold' ? 'On Hold' : 'Sold'}
          </div>
        )}

        {/* Cross-listing badges */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          {product.firstdibs_url && (
            <div className="w-6 h-6 bg-background rounded-full flex items-center justify-center text-[8px] font-bold">
              1D
            </div>
          )}
          {product.chairish_url && (
            <div className="w-6 h-6 bg-background rounded-full flex items-center justify-center text-[8px] font-bold">
              CH
            </div>
          )}
          {product.ebay_url && (
            <div className="w-6 h-6 bg-background rounded-full flex items-center justify-center text-[8px] font-bold">
              EB
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display text-xl leading-tight group-hover:text-muted-foreground transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground font-body">
          {product.designer && (
            <span>{product.designer.name}</span>
          )}
          {product.maker && (
            <span>• {product.maker_name}</span>
          )}
        </div>

        <p className="mt-3 font-body text-sm">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;

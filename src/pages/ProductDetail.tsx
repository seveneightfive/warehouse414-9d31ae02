import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Clock, DollarSign, ShoppingCart, ExternalLink } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/hooks/useProducts";
import { useProductActions } from "@/hooks/useProductActions";
import HoldDialog from "@/components/dialogs/HoldDialog";
import OfferDialog from "@/components/dialogs/OfferDialog";
import PurchaseDialog from "@/components/dialogs/PurchaseDialog";
import ProductImageGallery from "@/components/products/ProductImageGallery";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || '');
  const actions = useProductActions();
  const [includePriceInPdf, setIncludePriceInPdf] = useState(true);

  const formatPrice = (price: number | null) => {
    if (!price) return "Price on request";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDimensions = (w: number | null, h: number | null, d: number | null, weight: number | null = null) => {
    if (!w && !h && !d && !weight) return null;
    const parts = [];
    if (w) parts.push(`${w}"W`);
    if (h) parts.push(`${h}"H`);
    if (d) parts.push(`${d}"D`);
    const dimStr = parts.join(' × ');
    if (weight) {
      return dimStr ? `${dimStr} • ${weight} lbs` : `${weight} lbs`;
    }
    return dimStr;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-4xl mb-4">PRODUCT NOT FOUND</h1>
          <p className="font-body text-muted-foreground mb-8">
            This item may have been sold or removed.
          </p>
          <Button asChild>
            <Link to="/catalog">Browse Catalog</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const productDimensions = formatDimensions(product.product_width, product.product_height, product.product_depth, product.product_weight);
  const boxDimensions = formatDimensions(product.box_width, product.box_height, product.box_depth, product.box_weight);
  const isAvailable = product.status === 'available';

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

      {/* Product Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <ProductImageGallery 
            images={product.product_images} 
            featuredImage={product.featured_image_url}
            productName={product.name}
          />

          {/* Details */}
          <div>
            {/* Status Badge */}
            {product.status !== 'available' && (
              <Badge 
                variant={product.status === 'on_hold' ? 'secondary' : 'default'}
                className="mb-4 font-body uppercase tracking-wider"
              >
                {product.status === 'on_hold' ? 'On Hold' : 'Sold'}
              </Badge>
            )}

            {/* Title & Price */}
            <h1 className="font-display text-4xl md:text-5xl leading-tight">{product.name}</h1>
            <p className="font-body text-2xl mt-4">{formatPrice(product.price)}</p>

            {/* Short Description */}
            {product.short_description && (
              <p className="font-body text-muted-foreground mt-4 text-lg">
                {product.short_description}
              </p>
            )}

            {/* Attributes */}
            <div className="mt-6 flex flex-wrap gap-2">
              {product.designer && (
                <Link to={`/designer/${product.designer.slug}`}>
                  <Badge variant="outline" className="font-body hover:bg-secondary cursor-pointer">
                    {product.designer.name}
                    {product.designer_attribution && ` (${product.designer_attribution})`}
                  </Badge>
                </Link>
              )}
              {product.maker && (
                <Link to={`/catalog?maker=${product.maker.slug}`}>
                  <Badge variant="outline" className="font-body hover:bg-secondary cursor-pointer">
                    {product.maker.name}
                    {product.maker_attribution && ` (${product.maker_attribution})`}
                  </Badge>
                </Link>
              )}
              {product.category && (
                <Link to={`/catalog?category=${product.category.slug}`}>
                  <Badge variant="outline" className="font-body hover:bg-secondary cursor-pointer">
                    {product.category.name}
                  </Badge>
                </Link>
              )}
              {product.style && (
                <Link to={`/catalog?style=${product.style.slug}`}>
                  <Badge variant="outline" className="font-body hover:bg-secondary cursor-pointer">
                    {product.style.name}
                  </Badge>
                </Link>
              )}
              {product.period && (
                <Link to={`/catalog?period=${product.period.slug}`}>
                  <Badge variant="outline" className="font-body hover:bg-secondary cursor-pointer">
                    {product.period.name}
                    {product.period_attribution && ` (${product.period_attribution})`}
                  </Badge>
                </Link>
              )}
              {product.country && (
                <Link to={`/catalog?country=${product.country.slug}`}>
                  <Badge variant="outline" className="font-body hover:bg-secondary cursor-pointer">
                    {product.country.name}
                  </Badge>
                </Link>
              )}
              {product.year_created && (
                <Badge variant="outline" className="font-body">
                  c. {product.year_created}
                </Badge>
              )}
              {product.product_colors?.map(({ color }) => (
                <Link key={color.id} to={`/catalog?color=${color.slug}`}>
                  <Badge variant="outline" className="font-body hover:bg-secondary cursor-pointer">
                    {color.name}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Materials */}
            {product.materials && (
              <div className="mt-6">
                <p className="font-body text-sm">
                  <span className="text-muted-foreground">Materials:</span> {product.materials}
                </p>
              </div>
            )}

            {/* Dimensions */}
            {(productDimensions || boxDimensions || product.dimension_notes) && (
              <div className="mt-8 p-4 bg-secondary">
                <h3 className="font-display text-lg mb-3">DIMENSIONS</h3>
                {productDimensions && (
                  <p className="font-body text-sm">
                    <span className="text-muted-foreground">Product:</span> {productDimensions}
                  </p>
                )}
                {product.dimension_notes && (
                  <p className="font-body text-sm mt-1 text-muted-foreground italic">
                    {product.dimension_notes}
                  </p>
                )}
                {boxDimensions && (
                  <p className="font-body text-sm mt-1">
                    <span className="text-muted-foreground">Shipping Box:</span> {boxDimensions}
                  </p>
                )}
              </div>
            )}

            {/* Cross-listings */}
            {(product.firstdibs_url || product.chairish_url || product.ebay_url) && (
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="font-body text-sm text-muted-foreground">Also available on:</span>
                {product.firstdibs_url && (
                  <a 
                    href={product.firstdibs_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-body text-sm underline hover:no-underline"
                  >
                    1stDibs <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {product.chairish_url && (
                  <a 
                    href={product.chairish_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-body text-sm underline hover:no-underline"
                  >
                    Chairish <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {product.ebay_url && (
                  <a 
                    href={product.ebay_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-body text-sm underline hover:no-underline"
                  >
                    eBay Collective <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              {isAvailable ? (
                <>
                  <Button 
                    className="w-full font-body uppercase tracking-widest"
                    size="lg"
                    onClick={() => actions.setPurchaseDialogOpen(true)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Purchase Inquiry
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline"
                      className="font-body uppercase tracking-widest"
                      onClick={() => actions.setHoldDialogOpen(true)}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Place on Hold
                    </Button>
                    <Button 
                      variant="outline"
                      className="font-body uppercase tracking-widest"
                      onClick={() => actions.setOfferDialogOpen(true)}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Make Offer
                    </Button>
                  </div>
                </>
              ) : (
                <Button disabled className="w-full font-body uppercase tracking-widest" size="lg">
                  {product.status === 'on_hold' ? 'Currently On Hold' : 'Sold'}
                </Button>
              )}

              {/* Spec Sheet Download */}
              <div className="flex items-center gap-3 pt-2">
                <Button 
                  variant="ghost" 
                  className="flex-1 font-body text-sm"
                  onClick={() => {
                    // TODO: Implement PDF generation edge function
                    console.log('Download spec sheet', { includePriceInPdf });
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Spec Sheet
                </Button>
                <label className="flex items-center gap-2 font-body text-xs text-muted-foreground cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includePriceInPdf}
                    onChange={(e) => setIncludePriceInPdf(e.target.checked)}
                    className="rounded border-border"
                  />
                  Include price
                </label>
              </div>
            </div>

            {/* Long Description */}
            {product.long_description && (
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="font-display text-xl mb-4">ABOUT THIS PIECE</h3>
                <div className="font-body text-muted-foreground space-y-4 whitespace-pre-wrap">
                  {product.long_description}
                </div>
              </div>
            )}

            {/* Designer About */}
            {product.designer?.about && (
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-display text-xl mb-4">ABOUT THE DESIGNER</h3>
                <Link to={`/designer/${product.designer.slug}`} className="font-body text-lg font-medium hover:underline">
                  {product.designer.name}
                </Link>
                <p className="font-body text-muted-foreground mt-2 whitespace-pre-wrap">
                  {product.designer.about}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <HoldDialog 
        open={actions.holdDialogOpen}
        onOpenChange={actions.setHoldDialogOpen}
        productId={product.id}
        productName={product.name}
        onSubmit={actions.placeHold}
        isLoading={actions.isPlacingHold}
      />
      <OfferDialog 
        open={actions.offerDialogOpen}
        onOpenChange={actions.setOfferDialogOpen}
        productId={product.id}
        productName={product.name}
        currentPrice={product.price}
        onSubmit={actions.submitOffer}
        isLoading={actions.isSubmittingOffer}
      />
      <PurchaseDialog 
        open={actions.purchaseDialogOpen}
        onOpenChange={actions.setPurchaseDialogOpen}
        productId={product.id}
        productName={product.name}
        price={product.price}
        onSubmit={actions.sendPurchaseInquiry}
        isLoading={actions.isSendingInquiry}
      />
    </Layout>
  );
};

export default ProductDetail;

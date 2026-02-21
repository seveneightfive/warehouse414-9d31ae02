import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/hooks/useProducts";
import { useProductActions } from "@/hooks/useProductActions";
import HoldDialog from "@/components/dialogs/HoldDialog";
import OfferDialog from "@/components/dialogs/OfferDialog";
import PurchaseDialog from "@/components/dialogs/PurchaseDialog";
import SpecSheetDialog from "@/components/dialogs/SpecSheetDialog";
import RevealSection from "@/components/products/RevealSection";
import StickyActionBar from "@/components/products/StickyActionBar";
import SimilarProductsFeed from "@/components/products/SimilarProductsFeed";
import { ProductImage } from "@/types/database";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || '');
  const actions = useProductActions();
  const [specSheetDialogOpen, setSpecSheetDialogOpen] = useState(false);

  const formatPrice = (price: number | null) => {
    if (!price) return "Price on request";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
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
          <h1 className="font-display text-4xl mb-4">product not found</h1>
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

  const isAvailable = product.status === 'available';

  // Organize images: featured + sorted gallery images
  const galleryImages: Array<{ id: string; image_url: string; alt_text: string | null }> = [];
  if (product.featured_image_url) {
    galleryImages.push({ id: 'featured', image_url: product.featured_image_url, alt_text: product.name });
  }
  const sortedImages = [...product.product_images].sort((a, b) => a.sort_order - b.sort_order);
  sortedImages.forEach(img => galleryImages.push(img));

  // Distribute images across sections
  const heroImage = galleryImages[0] || null;
  const tripleRow1 = galleryImages.slice(1, 4); // images 2,3,4
  const tripleRow2 = galleryImages.slice(4, 7); // images 5,6,7
  const detailsImage = galleryImages[7] || galleryImages[1] || heroImage;
  const remainingImages = galleryImages.slice(8);
  const finalImage = remainingImages.length > 0 ? remainingImages : (galleryImages[galleryImages.length - 1] ? [galleryImages[galleryImages.length - 1]] : []);

  // Collect product details for section 5
  const details: Array<{ label: string; value: string; link?: string }> = [];
  if (product.designer) {
    let val = product.designer.name;
    if (product.designer_attribution) val += ` (${product.designer_attribution})`;
    details.push({ label: 'Designer', value: val, link: `/designer/${product.designer.slug}` });
  }
  if (product.maker) {
    let val = product.maker.name;
    if (product.maker_attribution) val += ` (${product.maker_attribution})`;
    details.push({ label: 'Maker', value: val, link: `/catalog?maker=${product.maker.slug}` });
  }
  if (product.materials) details.push({ label: 'Materials', value: product.materials });
  if (product.year_created) details.push({ label: 'Year', value: `c. ${product.year_created}` });
  if (product.style) details.push({ label: 'Style', value: product.style.name, link: `/catalog?style=${product.style.slug}` });
  if (product.period) {
    let val = product.period.name;
    if (product.period_attribution) val += ` (${product.period_attribution})`;
    details.push({ label: 'Period', value: val, link: `/catalog?period=${product.period.slug}` });
  }
  if (product.country) details.push({ label: 'Origin', value: product.country.name, link: `/catalog?country=${product.country.slug}` });
  if (product.category) details.push({ label: 'Category', value: product.category.name, link: `/catalog?category=${product.category.slug}` });

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

      {/* ===== SECTION 1: Hero — Image + Title/Price/Description ===== */}
      <RevealSection className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Featured Image */}
          <div className="aspect-square bg-muted overflow-hidden">
            {heroImage ? (
              <img
                src={heroImage.image_url}
                alt={heroImage.alt_text || product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-24 h-24 stripe-pattern opacity-20" />
              </div>
            )}
          </div>

          {/* Title, Price, Short Description */}
          <div className="flex flex-col justify-center py-8 lg:py-16">
            {product.status !== 'available' && (
              <Badge
                variant={product.status === 'on_hold' ? 'secondary' : 'default'}
                className="mb-4 font-body uppercase tracking-wider w-fit"
              >
                {product.status === 'on_hold' ? 'On Hold' : 'Sold'}
              </Badge>
            )}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1]">{product.name}</h1>
            <p className="font-body text-2xl md:text-3xl mt-6 text-muted-foreground">{formatPrice(product.price)}</p>
            {product.short_description && (
              <p className="font-body text-lg text-muted-foreground mt-6 leading-relaxed max-w-lg">
                {product.short_description}
              </p>
            )}

            {/* Cross-listings */}
            {(product.firstdibs_url || product.chairish_url || product.ebay_url) && (
              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <span className="font-body text-sm text-muted-foreground">Also on:</span>
                {product.firstdibs_url && (
                  <a href={product.firstdibs_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-body text-sm underline hover:no-underline">
                    1stDibs <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {product.chairish_url && (
                  <a href={product.chairish_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-body text-sm underline hover:no-underline">
                    Chairish <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {product.ebay_url && (
                  <a href={product.ebay_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-body text-sm underline hover:no-underline">
                    eBay <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </RevealSection>

      {/* ===== SECTION 2: Three Square Images Row ===== */}
      {tripleRow1.length > 0 && (
        <RevealSection className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tripleRow1.map((img, i) => (
              <RevealSection key={img.id} delay={i * 150}>
                <div className="aspect-square bg-muted overflow-hidden">
                  <img
                    src={img.image_url}
                    alt={img.alt_text || `${product.name} - Image ${i + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </RevealSection>
            ))}
          </div>
        </RevealSection>
      )}

      {/* ===== SECTION 3: Description (editorial layout inspired by reference) ===== */}
      {product.long_description && (
        <RevealSection className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-16 max-w-6xl mx-auto">
              <div>
                <p className="font-body text-sm text-muted-foreground uppercase tracking-widest">about this piece</p>
              </div>
              <div>
                <div className="font-body text-xl md:text-2xl lg:text-3xl leading-relaxed text-foreground whitespace-pre-wrap">
                  {product.long_description}
                </div>

                {/* Designer About as secondary text */}
                {product.designer?.about && (
                  <div className="mt-12 pt-8 border-t border-border">
                    <Link to={`/designer/${product.designer.slug}`} className="font-body text-lg font-medium hover:underline">
                      {product.designer.name}
                    </Link>
                    <p className="font-body text-muted-foreground mt-3 leading-relaxed">
                      {product.designer.about}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </RevealSection>
      )}

      {/* ===== SECTION 4: Three More Square Images ===== */}
      {tripleRow2.length > 0 && (
        <RevealSection className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tripleRow2.map((img, i) => (
              <RevealSection key={img.id} delay={i * 150}>
                <div className="aspect-square bg-muted overflow-hidden">
                  <img
                    src={img.image_url}
                    alt={img.alt_text || `${product.name} - Image ${i + 5}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </RevealSection>
            ))}
          </div>
        </RevealSection>
      )}

      {/* ===== SECTION 5: Image + Product Details ===== */}
      {details.length > 0 && (
        <RevealSection className="container mx-auto px-4 pb-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Image */}
            <div className="aspect-square bg-muted overflow-hidden">
              {detailsImage && (
                <img
                  src={detailsImage.image_url}
                  alt={detailsImage.alt_text || product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center py-8 lg:py-16">
              <h2 className="font-display text-3xl md:text-4xl mb-8">product details</h2>
              <dl className="space-y-4">
                {details.map(({ label, value, link }) => (
                  <div key={label} className="flex flex-col border-b border-border pb-4">
                    <dt className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-1">{label}</dt>
                    <dd className="font-body text-lg">
                      {link ? (
                        <Link to={link} className="hover:underline">{value}</Link>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Tags */}
              {product.product_colors && product.product_colors.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.product_colors.map(({ color }) => (
                    <Link key={color.id} to={`/catalog?color=${color.slug}`}>
                      <Badge variant="tag" className="font-body cursor-pointer">{color.name}</Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </RevealSection>
      )}

      {/* ===== SECTION 6: Dimensions + Final Image(s) ===== */}
      {(product.product_dimensions || product.box_dimensions) && (
        <RevealSection className="container mx-auto px-4 pb-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Dimensions */}
            <div className="flex flex-col justify-center py-8 lg:py-16 order-2 lg:order-1">
              <h2 className="font-display text-3xl md:text-4xl mb-8">dimensions</h2>
              {product.product_dimensions && (
                <div className="border-b border-border pb-4 mb-4">
                  <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-1">Product</p>
                  <p className="font-body text-lg">{product.product_dimensions}</p>
                </div>
              )}
              {product.dimension_notes && (
                <p className="font-body text-sm text-muted-foreground italic mb-4">{product.dimension_notes}</p>
              )}
              {product.box_dimensions && (
                <div className="border-b border-border pb-4">
                  <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-1">Shipping Box</p>
                  <p className="font-body text-lg">{product.box_dimensions}</p>
                </div>
              )}
            </div>

            {/* Final image or carousel */}
            <div className="order-1 lg:order-2">
              {finalImage.length > 1 ? (
                <div
                  className="flex overflow-x-auto snap-x snap-mandatory gap-4 scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {finalImage.map((img, i) => (
                    <div key={img.id + i} className="flex-shrink-0 w-full snap-center">
                      <div className="aspect-square bg-muted overflow-hidden">
                        <img
                          src={img.image_url}
                          alt={img.alt_text || `${product.name} - Image`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : finalImage[0] ? (
                <div className="aspect-square bg-muted overflow-hidden">
                  <img
                    src={finalImage[0].image_url}
                    alt={finalImage[0].alt_text || product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </RevealSection>
      )}

      {/* ===== MORE LIKE THIS ===== */}
      <SimilarProductsFeed product={product} />

      {/* Bottom spacer for sticky bar */}
      <div className="h-16" />

      {/* Sticky Action Bar */}
      <StickyActionBar
        isAvailable={isAvailable}
        status={product.status}
        onPurchase={() => actions.setPurchaseDialogOpen(true)}
        onOffer={() => actions.setOfferDialogOpen(true)}
        onHold={() => actions.setHoldDialogOpen(true)}
        onSpecSheet={() => setSpecSheetDialogOpen(true)}
      />

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
      <SpecSheetDialog
        open={specSheetDialogOpen}
        onOpenChange={setSpecSheetDialogOpen}
        product={product}
        productSlug={slug}
      />
    </Layout>
  );
};

export default ProductDetail;

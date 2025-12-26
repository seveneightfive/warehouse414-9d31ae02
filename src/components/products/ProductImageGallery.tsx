import { useRef, useState, useEffect } from "react";
import { ProductImage } from "@/types/database";

interface ProductImageGalleryProps {
  images: ProductImage[];
  featuredImage: string | null;
  productName: string;
}

const ProductImageGallery = ({ images, featuredImage, productName }: ProductImageGalleryProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Combine featured image with gallery images
  const allImages = [
    ...(featuredImage ? [{ id: 'featured', image_url: featuredImage, alt_text: productName, sort_order: -1 }] : []),
    ...images.sort((a, b) => a.sort_order - b.sort_order),
  ];

  // Handle scroll to update active indicator
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.offsetWidth;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(newIndex, allImages.length - 1));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [allImages.length]);

  // Scroll to specific image when indicator is clicked
  const scrollToImage = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    container.scrollTo({
      left: index * container.offsetWidth,
      behavior: 'smooth'
    });
  };

  if (allImages.length === 0) {
    return (
      <div className="aspect-square bg-muted flex items-center justify-center">
        <div className="w-24 h-24 stripe-pattern opacity-20" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Horizontal Scroll Carousel */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {allImages.map((image, index) => (
          <div 
            key={image.id} 
            className="flex-shrink-0 w-full snap-center"
          >
            <div className="aspect-square bg-muted overflow-hidden">
              <img
                src={image.image_url}
                alt={image.alt_text || `${productName} - Image ${index + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      {allImages.length > 1 && (
        <div className="flex justify-center gap-2">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === activeIndex 
                  ? 'bg-foreground w-4' 
                  : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;

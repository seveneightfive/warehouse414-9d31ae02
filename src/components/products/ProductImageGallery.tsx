import { useState } from "react";
import { ProductImage } from "@/types/database";

interface ProductImageGalleryProps {
  images: ProductImage[];
  featuredImage: string | null;
  productName: string;
}

const ProductImageGallery = ({ images, featuredImage, productName }: ProductImageGalleryProps) => {
  // Combine featured image with gallery images
  const allImages = [
    ...(featuredImage ? [{ id: 'featured', image_url: featuredImage, alt_text: productName, sort_order: -1 }] : []),
    ...images.sort((a, b) => a.sort_order - b.sort_order),
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = allImages[selectedIndex];

  if (allImages.length === 0) {
    return (
      <div className="aspect-square bg-muted flex items-center justify-center">
        <div className="w-24 h-24 stripe-pattern opacity-20" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-muted overflow-hidden">
        <img
          src={selectedImage.image_url}
          alt={selectedImage.alt_text || productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {allImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square bg-muted overflow-hidden border-2 transition-colors ${
                index === selectedIndex ? 'border-foreground' : 'border-transparent hover:border-muted-foreground'
              }`}
            >
              <img
                src={image.image_url}
                alt={image.alt_text || `${productName} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;

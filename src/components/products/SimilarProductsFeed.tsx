import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductWithRelations } from "@/types/database";
import { useSimilarProducts } from "@/hooks/useSimilarProducts";
import RevealSection from "./RevealSection";

interface SimilarProductsFeedProps {
  product: ProductWithRelations;
}

const formatPrice = (price: number | null) => {
  if (!price) return "Price on request";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
};

const SimilarProductsFeed = ({ product }: SimilarProductsFeedProps) => {
  const { data: similar = [] } = useSimilarProducts(product);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (similar.length === 0) return null;

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 380, behavior: 'smooth' });
  };

  return (
    <RevealSection className="py-20 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl md:text-4xl">you might also like</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {similar.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.slug}`}
              className="flex-shrink-0 w-[340px] snap-start group"
            >
              <div className="aspect-square bg-muted overflow-hidden">
                {p.featured_image_url ? (
                  <img
                    src={p.featured_image_url}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 stripe-pattern opacity-20" />
                  </div>
                )}
              </div>
              <div className="mt-3 border-t border-border pt-3">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-display text-lg leading-tight group-hover:text-muted-foreground transition-colors">
                    {p.name}
                  </h3>
                  <span className="font-body text-sm whitespace-nowrap">{formatPrice(p.price)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </RevealSection>
  );
};

export default SimilarProductsFeed;

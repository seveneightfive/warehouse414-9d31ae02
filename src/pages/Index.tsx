import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/products/ProductGrid";
import { useFeaturedProducts } from "@/hooks/useProducts";

const Index = () => {
  const { data: featuredProducts, isLoading } = useFeaturedProducts(8);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center bg-primary text-primary-foreground overflow-hidden">
        {/* Stripe Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full stripe-pattern" style={{ transform: 'rotate(-5deg) scale(1.5)' }} />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-none mb-6 animate-fade-in">
              CURATED VINTAGE
              <br />
              FURNITURE & ART
            </h1>
            <p className="font-body text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl animate-fade-in" style={{ animationDelay: '100ms' }}>
              One-of-a-kind pieces selected for exceptional design, 
              quality craftsmanship, and timeless character.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <Button 
                asChild 
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-body uppercase tracking-widest"
              >
                <Link to="/catalog">
                  Browse Catalog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative stripe element */}
        <div className="absolute bottom-0 left-0 right-0 h-16 stripe-pattern" />
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-4xl md:text-5xl">RECENT ADDITIONS</h2>
              <p className="font-body text-muted-foreground mt-2">
                Newly arrived pieces ready for your collection
              </p>
            </div>
            <Link 
              to="/catalog" 
              className="hidden md:flex items-center gap-2 font-body text-sm uppercase tracking-widest hover:text-muted-foreground transition-colors"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ProductGrid products={featuredProducts || []} isLoading={isLoading} />

          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline" className="font-body uppercase tracking-widest">
              <Link to="/catalog">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="w-full aspect-square bg-muted stripe-pattern opacity-10" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-display text-4xl md:text-5xl mb-6">THE WAREHOUSE414 DIFFERENCE</h2>
              <p className="font-body text-muted-foreground mb-6">
                Every piece in our collection is hand-selected for its design significance, 
                condition, and provenance. We work with collectors, estates, and design 
                professionals to source furniture and art that tells a story.
              </p>
              <p className="font-body text-muted-foreground mb-8">
                From mid-century modern masterpieces to rare industrial finds, each item 
                is photographed in detail and described accurately so you know exactly 
                what you're getting.
              </p>
              <Button asChild variant="outline" className="font-body uppercase tracking-widest">
                <Link to="/about">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 stripe-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-4">LOOKING FOR SOMETHING SPECIFIC?</h2>
          <p className="font-body text-muted-foreground mb-8 max-w-xl mx-auto">
            Let us know what you're looking for. We source new pieces weekly 
            and can keep you informed when items matching your criteria arrive.
          </p>
          <Button asChild size="lg" className="font-body uppercase tracking-widest">
            <Link to="/contact">
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

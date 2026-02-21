import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/products/ProductGrid";
import { useFeaturedProducts } from "@/hooks/useProducts";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const { data: featuredProducts, isLoading } = useFeaturedProducts(8);

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-foreground/40" />

        {/* Content card */}
        <div className="relative z-10 w-full max-w-3xl mx-4 my-16 bg-background/90 backdrop-blur-sm p-8 md:p-14 text-center">
          <p className="font-body text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6">
            curated treasures: unique antiques &amp; vintage finds
          </p>
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl mb-8">
            discover one-of-a-kind antiques for every space
          </h1>
          <div className="space-y-4 font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            <p>
              Welcome to warehouse414, high-style home furnishing and collectibles. Our carefully selected and curated collections include antique furniture, original art and decorative vintage pieces that add character, history, and charm to any space.
            </p>
            <p>
              Every item in our collection tells its own story; blend history with modern living. Whether you're an interior designer, home décor enthusiast, or simply searching for timeless antique furniture, warehouse414 offers a selection that inspires creativity and elevates your space.
            </p>
            <p>
              Shop Now to bring home authentic antiques and vintage décor that transform your space into a showcase of style and sophistication.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="font-body uppercase tracking-widest px-10"
          >
            <Link to="/catalog">
              Shop Now
            </Link>
          </Button>
        </div>
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

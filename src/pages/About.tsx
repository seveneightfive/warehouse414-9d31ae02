import Layout from "@/components/layout/Layout";
const About = () => {
  return <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 stripe-border bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-5xl md:text-7xl text-center">ABOUT</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl mb-6">THE WAREHOUSE414 STORY</h2>
            <div className="font-body text-muted-foreground space-y-6">
              <p>
                Founded with a passion for exceptional design, Warehouse414 curates one-of-a-kind 
                vintage furniture and art pieces that stand the test of time. Each item in our 
                collection is carefully selected for its design significance, quality craftsmanship, 
                and unique character.
              </p>
              <p>
                We believe that great design transcends eras. Whether it's a mid-century modern 
                masterpiece, an industrial artifact, or a striking piece of contemporary art, 
                we seek out items that tell a story and bring character to any space.
              </p>
              <p>
                Our commitment to authenticity means every piece is photographed in detail and 
                described accurately, including any wear that adds to its patina and history. 
                We work closely with collectors, estates, and design professionals to source 
                pieces that are truly special.
              </p>
            </div>

            <div className="mt-16 pt-16 border-t border-border">
              <h2 className="font-display text-3xl md:text-4xl mb-6">OUR PROCESS</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="w-12 h-12 stripe-pattern mb-4" />
                  <h3 className="font-display text-xl mb-2">SOURCING</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    We travel to estates, auctions, and private collections to find exceptional pieces 
                    with proven provenance.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 stripe-pattern mb-4" />
                  <h3 className="font-display text-xl mb-2">DOCUMENTATION</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Each piece is thoroughly photographed and documented, including any restoration 
                    work or condition notes.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 stripe-pattern mb-4" />
                  <h3 className="font-display text-xl mb-2">DELIVERY</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    We work with specialized art and furniture shippers to ensure your piece arrives 
                    safely, anywhere in the world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
};
export default About;
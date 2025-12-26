import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Stripe accent bar */}
      <div className="h-2 stripe-pattern" />
      
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary-foreground stripe-pattern-thick" style={{ filter: 'invert(1)' }} />
              <span className="font-display text-2xl tracking-wider">WAREHOUSE414</span>
            </div>
            <p className="font-body text-sm text-primary-foreground/70 max-w-md">
              Curating exceptional vintage furniture and art pieces. Each item is unique, 
              carefully selected for its design significance and quality craftsmanship.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-lg mb-4 tracking-wider">EXPLORE</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/catalog" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Catalog
              </Link>
              <Link to="/about" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg mb-4 tracking-wider">CONTACT</h4>
            <div className="flex flex-col gap-2 font-body text-sm text-primary-foreground/70">
              <a href="mailto:chris@warehouse414.com" className="hover:text-primary-foreground transition-colors">
                chris@warehouse414.com
              </a>
              <a href="tel:17852328008" className="hover:text-primary-foreground transition-colors">
                785.232.8008
              </a>
              <a href="https://maps.google.com/?q=414+SE+Second+St,+Topeka,+Kansas"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-primary-foreground transition-colors"
    >
      414 se second street<br />
      topeka, kansas<br />
                by appointment only
    </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} Warehouse414. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="font-body text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

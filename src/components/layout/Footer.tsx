import { Link } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";
import warehouseLogo from "@/assets/warehouse414-logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Stripe accent bar */}
      <div className="h-2 stripe-pattern" />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img src={warehouseLogo} alt="Warehouse 414" className="w-24 md:w-32 h-auto" />
            </Link>
            <div className="flex items-center gap-4 flex-wrap">
              <a href="https://www.facebook.com/p/Warehouse-414-new-61574405447016/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/warehouse4one4/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.1stdibs.com/dealers/warehouse-414/" target="_blank" rel="noopener noreferrer" className="font-display text-xs tracking-wider text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                1stDibs
              </a>
              <a href="https://www.chairish.com/shop/warehouse414" target="_blank" rel="noopener noreferrer" className="font-display text-xs tracking-wider text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Chairish
              </a>
              <a href="https://www.ebay.com/str/warehouse414" target="_blank" rel="noopener noreferrer" className="font-display text-xs tracking-wider text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                eBay
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-lg mb-4 tracking-wider">EXPLORE</h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/catalog"
                className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                catalog
              </Link>
              <Link
                to="/about"
                className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                about us
              </Link>
              <Link
                to="/contact"
                className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                contact
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
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} Warehouse414. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="font-body text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

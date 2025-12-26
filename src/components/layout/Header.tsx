import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logoTop from "@/assets/logo-top.png";
import logoBottom from "@/assets/logo-bottom.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Black bar with top logo */}
      <div className="bg-foreground flex items-center justify-start">
        <Link to="/" className="block">
          <img src={logoTop} alt="Warehouse" className="h-10 md:h-14 w-auto" />
        </Link>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-10 md:h-12">
          {/* Bottom logo */}
          <Link to="/" className="block -mt-1">
            <img src={logoBottom} alt="414" className="h-6 md:h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/catalog" 
              className="font-body text-sm uppercase tracking-widest hover:text-muted-foreground transition-colors"
            >
              Catalog
            </Link>
            <Link 
              to="/about" 
              className="font-body text-sm uppercase tracking-widest hover:text-muted-foreground transition-colors"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="font-body text-sm uppercase tracking-widest hover:text-muted-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link 
                to="/catalog" 
                className="font-body text-sm uppercase tracking-widest py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Catalog
              </Link>
              <Link 
                to="/about" 
                className="font-body text-sm uppercase tracking-widest py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="font-body text-sm uppercase tracking-widest py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

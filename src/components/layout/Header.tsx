import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Stripe accent bar */}
      <div className="h-2 stripe-pattern" />
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 stripe-pattern-thick" />
            <span className="font-display text-2xl md:text-3xl tracking-wider">
              WAREHOUSE414
            </span>
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

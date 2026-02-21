import { ShoppingCart, DollarSign, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StickyActionBarProps {
  isAvailable: boolean;
  status: string;
  onPurchase: () => void;
  onOffer: () => void;
  onHold: () => void;
  onSpecSheet: () => void;
}

const StickyActionBar = ({ isAvailable, status, onPurchase, onOffer, onHold, onSpecSheet }: StickyActionBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto px-4 py-3">
        {isAvailable ? (
          <div className="flex gap-2 justify-center max-w-2xl mx-auto">
            <Button
              className="flex-1 font-body uppercase tracking-widest text-xs"
              size="sm"
              onClick={onPurchase}
            >
              <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
              Purchase
            </Button>
            <Button
              variant="outline"
              className="flex-1 font-body uppercase tracking-widest text-xs"
              size="sm"
              onClick={onOffer}
            >
              <DollarSign className="mr-1.5 h-3.5 w-3.5" />
              Make Offer
            </Button>
            <Button
              variant="outline"
              className="flex-1 font-body uppercase tracking-widest text-xs"
              size="sm"
              onClick={onHold}
            >
              <Clock className="mr-1.5 h-3.5 w-3.5" />
              Hold
            </Button>
            <Button
              variant="outline"
              className="flex-1 font-body uppercase tracking-widest text-xs"
              size="sm"
              onClick={onSpecSheet}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Spec Sheet
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <span className="font-body uppercase tracking-widest text-sm text-muted-foreground">
              {status === 'on_hold' ? 'Currently On Hold' : 'Sold'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyActionBar;

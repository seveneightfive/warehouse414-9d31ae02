import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface OfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  currentPrice: number | null;
  onSubmit: (data: {
    productId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    offerAmount: number;
    message?: string;
  }) => void;
  isLoading: boolean;
}

const OfferDialog = ({
  open,
  onOpenChange,
  productId,
  productName,
  currentPrice,
  onSubmit,
  isLoading,
}: OfferDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [message, setMessage] = useState("");

  const formatPrice = (price: number | null) => {
    if (!price) return "Price on request";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      productId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone || undefined,
      offerAmount: parseFloat(offerAmount),
      message: message || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">MAKE AN OFFER</DialogTitle>
          <DialogDescription className="font-body">
            Submit your offer for <span className="font-medium text-foreground">{productName}</span>
            {currentPrice && <span className="block mt-1">Listed at {formatPrice(currentPrice)}</span>}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="offer-name" className="font-body">Name *</Label>
            <Input
              id="offer-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="font-body"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="offer-email" className="font-body">Email *</Label>
            <Input
              id="offer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="font-body"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="offer-phone" className="font-body">Phone (optional)</Label>
            <Input
              id="offer-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="font-body"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="offer-amount" className="font-body">Your Offer (USD) *</Label>
            <Input
              id="offer-amount"
              type="number"
              min="1"
              step="1"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              required
              className="font-body"
              placeholder="Enter amount"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="offer-message" className="font-body">Message (optional)</Label>
            <Textarea
              id="offer-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="font-body"
              placeholder="Any additional details..."
              rows={3}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full font-body uppercase tracking-widest"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Offer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OfferDialog;

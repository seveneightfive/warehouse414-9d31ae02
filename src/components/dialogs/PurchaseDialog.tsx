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

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  price: number | null;
  onSubmit: (data: {
    productId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    message?: string;
  }) => void;
  isLoading: boolean;
}

const PurchaseDialog = ({
  open,
  onOpenChange,
  productId,
  productName,
  price,
  onSubmit,
  isLoading,
}: PurchaseDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
      message: message || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">PURCHASE INQUIRY</DialogTitle>
          <DialogDescription className="font-body">
            Ready to purchase <span className="font-medium text-foreground">{productName}</span>?
            {price && <span className="block mt-1 text-lg font-medium text-foreground">{formatPrice(price)}</span>}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="purchase-name" className="font-body">Name *</Label>
            <Input
              id="purchase-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="font-body"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchase-email" className="font-body">Email *</Label>
            <Input
              id="purchase-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="font-body"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchase-phone" className="font-body">Phone *</Label>
            <Input
              id="purchase-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="font-body"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchase-message" className="font-body">Message (optional)</Label>
            <Textarea
              id="purchase-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="font-body"
              placeholder="Questions about shipping, payment, etc."
              rows={3}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full font-body uppercase tracking-widest"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Inquiry"}
          </Button>
          <p className="font-body text-xs text-muted-foreground text-center">
            We'll contact you within 24 hours to complete your purchase.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;

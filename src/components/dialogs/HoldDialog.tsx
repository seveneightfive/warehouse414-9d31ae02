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

interface HoldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  onSubmit: (data: {
    productId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
  }) => void;
  isLoading: boolean;
}

const HoldDialog = ({
  open,
  onOpenChange,
  productId,
  productName,
  onSubmit,
  isLoading,
}: HoldDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      productId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">PLACE ON HOLD</DialogTitle>
          <DialogDescription className="font-body">
            Hold <span className="font-medium text-foreground">{productName}</span> for 48 hours while you decide.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-body">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="font-body"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="font-body">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="font-body"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-body">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="font-body"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full font-body uppercase tracking-widest"
            disabled={isLoading}
          >
            {isLoading ? "Placing Hold..." : "Confirm Hold"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HoldDialog;

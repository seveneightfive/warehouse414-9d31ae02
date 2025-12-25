import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HoldFormData {
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

interface OfferFormData {
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  offerAmount: number;
  message?: string;
}

interface PurchaseFormData {
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  message?: string;
}

export const useProductActions = () => {
  const { toast } = useToast();
  const [holdDialogOpen, setHoldDialogOpen] = useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);

  const holdMutation = useMutation({
    mutationFn: async (data: HoldFormData) => {
      // Get hold duration from settings
      const { data: settings } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'hold_duration_hours')
        .single();
      
      const holdDurationHours = settings?.value ? parseInt(settings.value) : 48;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + holdDurationHours);

      const { error } = await supabase.from('product_holds').insert({
        product_id: data.productId,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone || null,
        hold_duration_hours: holdDurationHours,
        expires_at: expiresAt.toISOString(),
      });

      if (error) throw error;

      // Update product status
      await supabase
        .from('products')
        .update({ status: 'on_hold' })
        .eq('id', data.productId);
    },
    onSuccess: () => {
      toast({
        title: "Hold Placed Successfully",
        description: "This item is now on hold for you. We'll be in touch shortly.",
      });
      setHoldDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to place hold. Please try again.",
        variant: "destructive",
      });
      console.error('Hold error:', error);
    },
  });

  const offerMutation = useMutation({
    mutationFn: async (data: OfferFormData) => {
      const { error } = await supabase.from('offers').insert({
        product_id: data.productId,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone || null,
        offer_amount: data.offerAmount,
        message: data.message || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Offer Submitted",
        description: "We've received your offer and will respond within 24 hours.",
      });
      setOfferDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit offer. Please try again.",
        variant: "destructive",
      });
      console.error('Offer error:', error);
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (data: PurchaseFormData) => {
      const { error } = await supabase.from('purchase_inquiries').insert({
        product_id: data.productId,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone || null,
        message: data.message || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Sent",
        description: "We'll contact you shortly to complete your purchase.",
      });
      setPurchaseDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
      console.error('Purchase error:', error);
    },
  });

  return {
    holdDialogOpen,
    setHoldDialogOpen,
    offerDialogOpen,
    setOfferDialogOpen,
    purchaseDialogOpen,
    setPurchaseDialogOpen,
    placeHold: holdMutation.mutate,
    isPlacingHold: holdMutation.isPending,
    submitOffer: offerMutation.mutate,
    isSubmittingOffer: offerMutation.isPending,
    sendPurchaseInquiry: purchaseMutation.mutate,
    isSendingInquiry: purchaseMutation.isPending,
  };
};

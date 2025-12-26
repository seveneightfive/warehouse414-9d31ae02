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
import { Checkbox } from "@/components/ui/checkbox";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { jsPDF } from "jspdf";
import warehouseLogo from "@/assets/warehouse414-logo.jpg";

interface ProductData {
  id: string;
  name: string;
  price: number | null;
  short_description: string | null;
  long_description: string | null;
  materials: string | null;
  featured_image_url: string | null;
  product_width: number | null;
  product_height: number | null;
  product_depth: number | null;
  product_weight: number | null;
  box_width: number | null;
  box_height: number | null;
  box_depth: number | null;
  box_weight: number | null;
  dimension_notes: string | null;
  year_created: string | null;
  sku: string | null;
  designer?: { name: string } | null;
  maker?: { name: string } | null;
  category?: { name: string } | null;
  style?: { name: string } | null;
  period?: { name: string } | null;
  country?: { name: string } | null;
}

interface SpecSheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductData;
}

const PHONE_NUMBER = "785.232.8008";

const SpecSheetDialog = ({ open, onOpenChange, product }: SpecSheetDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [includePrice, setIncludePrice] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const formatPrice = (price: number | null) => {
    if (!price) return "Price on request";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDimensions = (w: number | null, h: number | null, d: number | null, weight: number | null = null) => {
    if (!w && !h && !d && !weight) return null;
    const parts = [];
    if (w) parts.push(`${w}"W`);
    if (h) parts.push(`${h}"H`);
    if (d) parts.push(`${d}"D`);
    const dimStr = parts.join(' × ');
    if (weight) {
      return dimStr ? `${dimStr} • ${weight} lbs` : `${weight} lbs`;
    }
    return dimStr;
  };

  const loadImageAsBase64 = (url: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  const generateSpecSheet = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter your name and email");
      return;
    }

    setIsGenerating(true);

    // Save download request to database
    try {
      const { error } = await supabase.from("spec_sheet_downloads").insert({
        product_id: product.id,
        customer_name: name.trim(),
        customer_email: email.trim(),
        include_price: includePrice,
      });

      if (error) {
        console.error("Error saving spec sheet download:", error);
      }
    } catch (err) {
      console.error("Error saving spec sheet download:", err);
    }

    const productDimensions = formatDimensions(product.product_width, product.product_height, product.product_depth, product.product_weight);
    const boxDimensions = formatDimensions(product.box_width, product.box_height, product.box_depth, product.box_weight);

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "letter",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 12.7; // 0.5 inches
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Header: Logo on left, product name on right
    const headerHeight = 18;
    
    // Add logo (smaller, left-aligned)
    try {
      const logoImg = new Image();
      logoImg.src = warehouseLogo;
      await new Promise((resolve) => {
        logoImg.onload = resolve;
      });
      
      const logoWidth = 30;
      const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
      pdf.addImage(warehouseLogo, "JPEG", margin, y, logoWidth, Math.min(logoHeight, headerHeight));
      
      // Product name to the right of logo
      const textX = margin + logoWidth + 8;
      const textWidth = contentWidth - logoWidth - 8;
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      const nameLines = pdf.splitTextToSize(product.name, textWidth);
      pdf.text(nameLines, textX, y + 6);
      
      // Phone number below product name
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(PHONE_NUMBER, textX, y + 6 + (nameLines.length * 5) + 2);
      
      y += Math.max(headerHeight, logoHeight) + 3;
    } catch (err) {
      console.error("Error loading logo:", err);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(product.name, margin, y + 8);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(`WAREHOUSE 414 • ${PHONE_NUMBER}`, margin, y + 14);
      y += headerHeight + 3;
    }

    // Separator line
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 6;

    // Product image
    if (product.featured_image_url) {
      try {
        const imgData = await loadImageAsBase64(product.featured_image_url);
        if (imgData) {
          const maxImgHeight = 65;
          const maxImgWidth = contentWidth * 0.8;
          
          const img = new Image();
          img.src = product.featured_image_url;
          await new Promise((resolve) => { img.onload = resolve; });
          
          let imgWidth = maxImgWidth;
          let imgHeight = (img.height / img.width) * imgWidth;
          
          if (imgHeight > maxImgHeight) {
            imgHeight = maxImgHeight;
            imgWidth = (img.width / img.height) * imgHeight;
          }
          
          const imgX = (pageWidth - imgWidth) / 2;
          pdf.addImage(imgData, "JPEG", imgX, y, imgWidth, imgHeight);
          y += imgHeight + 6;
        }
      } catch (err) {
        console.error("Error loading product image:", err);
      }
    }

    // Price (if included)
    if (includePrice) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(formatPrice(product.price), pageWidth / 2, y, { align: "center" });
      y += 5;
    }

    // SKU
    if (product.sku) {
      pdf.setFontSize(8);
      pdf.setTextColor(100);
      pdf.text(`SKU: ${product.sku}`, pageWidth / 2, y, { align: "center" });
      pdf.setTextColor(0);
      y += 5;
    }

    y += 3;

    // Short description
    if (product.short_description) {
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "italic");
      const descLines = pdf.splitTextToSize(product.short_description, contentWidth);
      pdf.text(descLines, margin, y);
      y += descLines.length * 3.5 + 4;
    }

    // Details section helper
    const addSection = (title: string) => {
      if (y > pageHeight - 25) {
        pdf.addPage();
        y = margin;
      }
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(80);
      pdf.text(title.toUpperCase(), margin, y);
      pdf.setLineWidth(0.15);
      pdf.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
      pdf.setTextColor(0);
      y += 5;
    };

    const addAttribute = (label: string, value: string | null | undefined) => {
      if (!value) return;
      if (y > pageHeight - 15) {
        pdf.addPage();
        y = margin;
      }
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${label}: `, margin, y);
      pdf.setFont("helvetica", "normal");
      const labelWidth = pdf.getTextWidth(`${label}: `);
      const valueLines = pdf.splitTextToSize(value, contentWidth - labelWidth);
      pdf.text(valueLines, margin + labelWidth, y);
      y += valueLines.length * 3.5 + 1.5;
    };

    // Build attributes array
    const details = [
      { label: "Designer", value: product.designer?.name },
      { label: "Maker", value: product.maker?.name },
      { label: "Category", value: product.category?.name },
      { label: "Style", value: product.style?.name },
      { label: "Period", value: product.period?.name },
      { label: "Origin", value: product.country?.name },
      { label: "Circa", value: product.year_created },
      { label: "Materials", value: product.materials },
    ].filter(d => d.value);

    if (details.length > 0) {
      addSection("Details");
      details.forEach(d => addAttribute(d.label, d.value));
      y += 3;
    }

    // Dimensions section
    if (productDimensions || boxDimensions || product.dimension_notes) {
      addSection("Dimensions");
      if (productDimensions) {
        addAttribute("Product", productDimensions);
      }
      if (product.dimension_notes) {
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(100);
        const noteLines = pdf.splitTextToSize(product.dimension_notes, contentWidth);
        pdf.text(noteLines, margin, y);
        pdf.setTextColor(0);
        y += noteLines.length * 3 + 2;
      }
      if (boxDimensions) {
        addAttribute("Shipping Box", boxDimensions);
      }
      y += 3;
    }

    // Footer
    const footerY = pageHeight - 15;
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100);
    pdf.text(
      `Generated for ${name} (${email}) on ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      footerY,
      { align: "center" }
    );
    pdf.text(
      `Warehouse 414 • ${PHONE_NUMBER} • www.warehouse414.com`,
      pageWidth / 2,
      footerY + 4,
      { align: "center" }
    );

    // Download PDF
    const filename = `${product.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-spec-sheet.pdf`;
    pdf.save(filename);

    toast.success("Spec sheet downloaded successfully");
    setIsGenerating(false);
    onOpenChange(false);
    
    // Reset form
    setName("");
    setEmail("");
    setIncludePrice(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Download Spec Sheet</DialogTitle>
          <DialogDescription className="font-body">
            Enter your details to download the product specification sheet.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="spec-name" className="font-body">Name</Label>
            <Input
              id="spec-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="font-body"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spec-email" className="font-body">Email</Label>
            <Input
              id="spec-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="font-body"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-price"
              checked={includePrice}
              onCheckedChange={(checked) => setIncludePrice(checked === true)}
            />
            <Label 
              htmlFor="include-price" 
              className="font-body text-sm cursor-pointer"
            >
              Include price in spec sheet
            </Label>
          </div>
        </div>
        <Button 
          onClick={generateSpecSheet} 
          className="w-full font-body uppercase tracking-widest"
          disabled={isGenerating}
        >
          <Download className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating..." : "Download Spec Sheet"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SpecSheetDialog;

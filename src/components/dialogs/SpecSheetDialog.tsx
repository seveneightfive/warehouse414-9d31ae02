import { useState, useRef } from "react";
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

  const generateSpecSheet = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter your name and email");
      return;
    }

    setIsGenerating(true);

    const productDimensions = formatDimensions(product.product_width, product.product_height, product.product_depth, product.product_weight);
    const boxDimensions = formatDimensions(product.box_width, product.box_height, product.box_depth, product.box_weight);

    // Generate HTML spec sheet
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Spec Sheet - ${product.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Georgia', serif; 
      color: #1a1a1a; 
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header { 
      text-align: center; 
      border-bottom: 2px solid #1a1a1a; 
      padding-bottom: 20px; 
      margin-bottom: 30px; 
    }
    .header h1 { 
      font-size: 14px; 
      letter-spacing: 4px; 
      font-weight: normal;
      margin-bottom: 10px;
    }
    .product-image { 
      width: 100%; 
      max-height: 400px; 
      object-fit: contain; 
      margin-bottom: 30px;
    }
    .product-name { 
      font-size: 28px; 
      margin-bottom: 10px; 
      font-weight: normal;
    }
    .price { 
      font-size: 20px; 
      margin-bottom: 20px; 
    }
    .section { 
      margin-bottom: 24px; 
    }
    .section-title { 
      font-size: 12px; 
      letter-spacing: 2px; 
      text-transform: uppercase; 
      border-bottom: 1px solid #ccc; 
      padding-bottom: 8px; 
      margin-bottom: 12px; 
    }
    .section-content { 
      font-size: 14px; 
      line-height: 1.6; 
    }
    .attributes { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 8px; 
    }
    .attribute { 
      font-size: 14px; 
    }
    .attribute-label { 
      color: #666; 
    }
    .footer { 
      margin-top: 40px; 
      padding-top: 20px; 
      border-top: 1px solid #ccc; 
      text-align: center; 
      font-size: 12px; 
      color: #666; 
    }
    @media print {
      body { padding: 20px; }
      .product-image { max-height: 300px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>WAREHOUSE 414</h1>
    <p>Product Specification Sheet</p>
  </div>

  ${product.featured_image_url ? `<img src="${product.featured_image_url}" alt="${product.name}" class="product-image" />` : ''}

  <h2 class="product-name">${product.name}</h2>
  ${includePrice ? `<p class="price">${formatPrice(product.price)}</p>` : ''}
  ${product.sku ? `<p style="font-size: 12px; color: #666; margin-bottom: 20px;">SKU: ${product.sku}</p>` : ''}

  ${product.short_description ? `
  <div class="section">
    <div class="section-content">${product.short_description}</div>
  </div>
  ` : ''}

  <div class="section">
    <h3 class="section-title">Details</h3>
    <div class="attributes">
      ${product.designer ? `<div class="attribute"><span class="attribute-label">Designer:</span> ${product.designer.name}</div>` : ''}
      ${product.maker ? `<div class="attribute"><span class="attribute-label">Maker:</span> ${product.maker.name}</div>` : ''}
      ${product.category ? `<div class="attribute"><span class="attribute-label">Category:</span> ${product.category.name}</div>` : ''}
      ${product.style ? `<div class="attribute"><span class="attribute-label">Style:</span> ${product.style.name}</div>` : ''}
      ${product.period ? `<div class="attribute"><span class="attribute-label">Period:</span> ${product.period.name}</div>` : ''}
      ${product.country ? `<div class="attribute"><span class="attribute-label">Origin:</span> ${product.country.name}</div>` : ''}
      ${product.year_created ? `<div class="attribute"><span class="attribute-label">Circa:</span> ${product.year_created}</div>` : ''}
      ${product.materials ? `<div class="attribute"><span class="attribute-label">Materials:</span> ${product.materials}</div>` : ''}
    </div>
  </div>

  ${productDimensions || boxDimensions || product.dimension_notes ? `
  <div class="section">
    <h3 class="section-title">Dimensions</h3>
    <div class="section-content">
      ${productDimensions ? `<p><span class="attribute-label">Product:</span> ${productDimensions}</p>` : ''}
      ${product.dimension_notes ? `<p style="font-style: italic; color: #666;">${product.dimension_notes}</p>` : ''}
      ${boxDimensions ? `<p><span class="attribute-label">Shipping Box:</span> ${boxDimensions}</p>` : ''}
    </div>
  </div>
  ` : ''}

  ${product.long_description ? `
  <div class="section">
    <h3 class="section-title">About This Piece</h3>
    <div class="section-content" style="white-space: pre-wrap;">${product.long_description}</div>
  </div>
  ` : ''}

  <div class="footer">
    <p>Generated for ${name} (${email}) on ${new Date().toLocaleDateString()}</p>
    <p style="margin-top: 8px;">Warehouse 414 • www.warehouse414.com</p>
  </div>
</body>
</html>
    `;

    // Create and download the file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-spec-sheet.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

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

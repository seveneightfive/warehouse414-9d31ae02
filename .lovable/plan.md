

## Update Footer: Remove Text, Lowercase Links, Add Social/Marketplace Icons

### Changes to `src/components/layout/Footer.tsx`

**1. Remove description text**
- Delete the `<p>` block with "Curating exceptional vintage furniture..." so the Brand column only has the logo.

**2. Lowercase navigation links**
- Change "Catalog" to "catalog", "About Us" to "about us", "Contact" to "contact"

**3. Add social and marketplace icons row**
- Add a new row (flex) of icon links in the footer, likely in the Brand column or as a standalone section:
  - **Facebook** -- use `Facebook` icon from `lucide-react`, links to `https://www.facebook.com/p/Warehouse-414-new-61574405447016/`
  - **Instagram** -- use `Instagram` icon from `lucide-react`, links to `https://www.instagram.com/warehouse4one4/`
  - **1stDibs** -- render a small inline SVG or text logo "1stDibs" (no lucide icon exists), links to `https://www.1stdibs.com/dealers/warehouse-414/`
  - **Chairish** -- render a small text logo "Chairish" (no lucide icon exists), links to `https://www.chairish.com/shop/warehouse414`
  - **eBay** -- render a small text logo "eBay" (no lucide icon exists), links to `https://www.ebay.com/str/warehouse414`
- All external links use `target="_blank"` and `rel="noopener noreferrer"`

### Technical Details

- Import `Facebook` and `Instagram` from `lucide-react`
- For 1stDibs, Chairish, and eBay: use styled text labels (small, uppercase/branded font) since there are no built-in icons for these marketplaces
- Place the icon row below the logo in the Brand column, with consistent sizing and hover effects matching the existing footer style


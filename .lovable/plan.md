

## Redesign Home Page Hero Section

### Layout
Based on the reference screenshots (especially the second one), the hero will feature:
- A full-bleed background image covering the entire hero section
- A centered, semi-transparent white content card overlaying the image
- Text content centered within the card
- A "Shop Now" CTA button

### Content Structure
1. **Eyebrow text**: "curated treasures: unique antiques & vintage finds"
2. **Main heading**: "Discover One-of-a-Kind Antiques for Every Space"
3. **Body paragraph 1**: "Welcome to warehouse414, high-style home furnishing and collectibles. Our carefully selected and curated collections include antique furniture, original art and decorative vintage pieces that add character, history, and charm to any space."
4. **Body paragraph 2**: "Every item in our collection tells its own story; blend history with modern living. Whether you're an interior designer, home decor enthusiast, or simply searching for timeless antique furniture, warehouse414 offers a selection that inspires creativity and elevates your space."
5. **Body paragraph 3**: "Shop Now to bring home authentic antiques and vintage decor that transform your space into a showcase of style and sophistication."
6. **CTA Button**: "Shop Now" linking to /catalog

### Background Image
Since there's no actual warehouse414 showroom photo in the project assets, I'll use the warehouse414 logo image as a placeholder and style the hero with a dark overlay. Alternatively, we can use a CSS gradient/pattern background that fits the brand until a real hero image is provided.

### Technical Changes
**File: `src/pages/Index.tsx`**
- Replace the current hero section (black background with stripe pattern) with the new layout:
  - Full-height section with a background image (or dark styled background as placeholder)
  - Centered white/light card with the content
  - Responsive padding and text sizing

The rest of the page (Recent Additions, About Teaser, CTA) remains unchanged.


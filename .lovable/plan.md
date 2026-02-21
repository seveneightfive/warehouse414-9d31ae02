

## Redesign About Page to Match warehouse414.com Style

### What Changes
The About page will be completely redesigned to mirror the warehouse414.com/about-us layout, featuring a full-bleed hero with centered content card, a two-column story section, and scroll-reveal animations throughout. The copy in the first section will be updated as specified.

### Layout Sections

**Section 1 -- Full-Bleed Hero**
- Full-viewport-height background image using the existing `hero-bg.jpg` showroom photo
- Semi-transparent dark overlay for contrast
- Centered white content card floating over the image with:
  - Small label: "Curated Treasures"
  - Large heading: "warehouse four fourteen"
  - Body text with the user-provided copy about great design transcending eras
  - "View Collection" button linking to `/catalog`

**Section 2 -- Our Story (two-column)**
- Light gray/secondary background
- Left column: heading "Discover Our Passion and Purpose" + paragraphs about the shop's location, mission, and inventory
- Right column: placeholder area for a future image (using the showroom photo for now)
- Scroll-reveal animation on both columns

**Section 3 -- Our Process (three-column grid)**
- Keep the existing Sourcing / Documentation / Delivery cards but style them with the stripe pattern icons and reveal animations

**Section 4 -- Buying and Selling**
- Full-width background image section (reuse hero-bg.jpg with parallax)
- White text overlay with heading "buying & selling"
- Short blurb about selling items + "Send Email" button linking to `/contact`

### Technical Details

**Modified file: `src/pages/About.tsx`**
- Complete rewrite of JSX structure into 4 sections
- Import `RevealSection` component for scroll animations
- Import `useParallax` hook for the hero and buying/selling background sections
- Import `hero-bg.jpg` for backgrounds
- Import `Link` from react-router-dom for the "View Collection" button
- Use existing Tailwind utilities and brand classes (`font-display`, `font-body`, `stripe-border`)

No new files or database changes needed.


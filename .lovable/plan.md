
## Add Parallax Scrolling to Product Detail Hero Image

### What Changes
A smooth parallax effect will be added to the hero (featured) image in Section 1 of the product detail page. As the user scrolls down, the image will move at a slower rate than the rest of the content, creating a subtle depth effect.

### Approach
Create a custom `useParallax` hook that listens to the scroll position and applies a `translateY` transform to the hero image. The image will shift vertically at roughly 30% of the scroll speed, giving a cinematic parallax feel without being jarring.

### Technical Details

**New file: `src/hooks/useParallax.ts`**
- A lightweight hook using `useEffect` + `useRef` + `requestAnimationFrame` to track scroll position
- Returns a `ref` to attach to the parallax container and a `style` object with the computed `transform`
- Uses a configurable speed factor (default 0.3)
- Cleans up the scroll listener on unmount

**Modified file: `src/pages/ProductDetail.tsx`**
- Import and use the `useParallax` hook
- Wrap the hero image `<img>` in a container that clips overflow and apply the parallax transform via the hook's returned style
- The image will be scaled slightly larger (scale 1.2) so parallax movement doesn't reveal empty space
- Only the Section 1 hero image gets the parallax effect; other sections remain unchanged

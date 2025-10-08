# 🎨 AI Image Generation Prompt for Hero Background

## 📋 Recommended AI Tools
- **Midjourney** (Best quality)
- **DALL-E 3** (GPT-4 integration)
- **Stable Diffusion XL** (Free alternative)
- **Adobe Firefly** (Commercial safe)

---

## 🎯 Main Prompt

```
A modern, professional abstract background for a freelance platform website hero section, 
featuring soft teal and green gradients (#1a4d3e, #2d6654, #e6f7f4), 
minimalist geometric shapes, subtle grid patterns, 
clean and professional aesthetic, 
digital illustration style, 
high resolution 1920x1080, 
corporate branding feel,
soft lighting, 
smooth transitions,
modern tech startup vibe,
--ar 16:9 --style raw --v 6
```

---

## 🎨 Alternative Detailed Prompt

```
Professional freelance marketplace background illustration:
- Color palette: Teal green (#1a4d3e), medium teal (#2d6654), light mint (#e6f7f4), white (#ffffff)
- Style: Modern minimalist geometric abstract
- Elements: Floating circles, subtle diagonal lines, soft gradients
- Composition: Clean, organized, professional
- Mood: Trustworthy, innovative, collaborative
- Technical: High resolution, web-optimized, subtle texture
- Inspiration: Fiverr, Upwork, modern SaaS platforms
- Format: Wide landscape 16:9 ratio
- Lighting: Soft ambient, no harsh shadows
- Detail level: Medium complexity, not too busy
- Usage: Website hero section background overlay
--q 2 --ar 16:9
```

---

## 🎯 Specific Style Variations

### Option 1: Geometric Minimalist
```
Abstract geometric background with teal and green color scheme,
hexagonal patterns, isometric grid overlay,
professional corporate style,
subtle depth, clean composition,
1920x1080 pixels, high quality
```

### Option 2: Flowing Gradient
```
Smooth flowing gradient background,
teal to mint green transition (#1a4d3e to #e6f7f4),
subtle wave patterns,
modern fluid design,
professional freelance platform aesthetic,
ultra high resolution
```

### Option 3: Tech-Inspired
```
Modern tech-inspired background,
digital nodes and connections,
teal green color scheme,
minimalist circuit board aesthetic,
clean professional look,
suitable for SaaS platform,
16:9 aspect ratio
```

---

## 📐 Technical Specifications

### Image Requirements:
- **Resolution**: 1920x1080 (Full HD) minimum
- **Format**: WebP (for best compression)
- **File Size**: < 200KB (optimized)
- **Aspect Ratio**: 16:9
- **Color Mode**: RGB
- **Quality**: High (85-90%)

### Color Palette (Exact):
- **Primary Dark**: `#0f3b2f` (Deep forest green)
- **Primary**: `#1a4d3e` (Rich teal green)
- **Primary Light**: `#2d6654` (Medium teal)
- **Primary Lighter**: `#4a8a77` (Light teal)
- **Ultra Light**: `#e6f7f4` (Mint background)
- **White**: `#ffffff`

---

## 🎨 Design Guidelines

### DO:
✅ Use subtle, professional colors
✅ Keep it clean and minimal
✅ Ensure good contrast
✅ Make it suitable for overlay text
✅ Use soft gradients
✅ Include geometric elements
✅ Maintain professional aesthetic

### DON'T:
❌ Make it too busy or cluttered
❌ Use harsh contrasts
❌ Include text or logos
❌ Use stock photos of people
❌ Make it too dark
❌ Use neon or bright colors
❌ Include realistic photography

---

## 🔧 Post-Processing Steps

After generating the image:

1. **Optimize for Web**:
   ```bash
   # Convert to WebP
   cwebp -q 85 hero_bg.jpg -o hero_bg.webp
   ```

2. **Resize if Needed**:
   ```bash
   # Using ImageMagick
   convert hero_bg.jpg -resize 1920x1080 -quality 90 hero_bg_optimized.jpg
   ```

3. **Check File Size**:
   - Should be < 200KB
   - If larger, reduce quality to 80%

4. **Test Overlay**:
   - Ensure text is readable when overlaid
   - Check on both light and dark overlays

---

## 💡 Quick Examples for Inspiration

### Similar Style References:
1. **Stripe.com** - Clean gradient backgrounds
2. **Notion.so** - Subtle geometric patterns
3. **Figma.com** - Modern abstract shapes
4. **Linear.app** - Minimalist tech aesthetic
5. **Vercel.com** - Clean gradient meshes

---

## 🚀 Ready-to-Use Midjourney Prompt

```
/imagine prompt: modern abstract background for freelance marketplace website, 
teal green color palette (#1a4d3e, #2d6654, #e6f7f4), 
geometric minimalist design, 
soft gradients and subtle patterns, 
professional corporate aesthetic, 
clean composition with floating circles and diagonal lines, 
high resolution digital illustration, 
suitable for hero section overlay, 
ultra detailed, 
--ar 16:9 --v 6 --style raw --q 2
```

---

## 📝 File Naming Convention

Save your generated image as:
- **Filename**: `hero_bg.webp`
- **Location**: `/public/hero/`
- **Full Path**: `/public/hero/hero_bg.webp`

---

## ✅ Checklist Before Using

- [ ] Image is 1920x1080 or higher
- [ ] Saved in WebP format
- [ ] File size < 200KB
- [ ] Colors match the palette
- [ ] No text or watermarks
- [ ] Suitable for text overlay
- [ ] Looks good with 5% opacity
- [ ] Professional and clean
- [ ] Tested on website

---

## 🎯 If You Don't Have AI Tools

### Alternative: Use Gradient Generator

Create a simple gradient background using:
- **CSS Gradient**: https://cssgradient.io/
- **Mesh Gradients**: https://meshgradient.com/
- **Pattern Generator**: https://pattern.monster/

Then export as PNG and convert to WebP.

---

## 💝 Bonus: Placeholder Gradient

If you need a quick placeholder, use this CSS gradient:

```css
background: linear-gradient(135deg, 
  #0f3b2f 0%, 
  #1a4d3e 25%, 
  #2d6654 50%, 
  #4a8a77 75%, 
  #e6f7f4 100%
);
```

Save this as an image using a screenshot tool at 1920x1080!

---

**Last Updated**: September 30, 2025  
**Status**: Ready for image generation  
**Priority**: Medium (works fine with opacity overlay)

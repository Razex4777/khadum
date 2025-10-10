# 🎨 Freepik Assets Guide for Khadum Landing Page

## 📋 Required Assets

### 1. Hero Section Images
**Search Terms on Freepik:**
- "dashboard mockup illustration flat"
- "saas platform interface modern"
- "mobile app mockup workspace"

**Specifications:**
- Format: SVG or PNG (high resolution)
- Style: Flat design, modern, clean
- Colors: Blue/cyan/purple palette
- Save as: `public/hero/dashboard-mockup.svg`

### 2. Features Section Illustrations

**Feature 1: WhatsApp Integration**
- Search: "whatsapp chat illustration flat"
- Save as: `public/landing/images/whatsapp-feature.svg`
- Style: Flat, minimalist, green accent

**Feature 2: Secure Payment**
- Search: "secure payment shield illustration"
- Save as: `public/landing/images/secure-payment.svg`
- Style: Flat, blue/green, shield icon

**Feature 3: AI Matching**
- Search: "artificial intelligence connection network flat"
- Save as: `public/landing/images/ai-matching.svg`
- Style: Purple/violet, nodes and connections

### 3. How It Works Illustrations (6 needed)

1. **Conversation** - `step-1-conversation.svg`
   - Search: "chat message bubble flat illustration"
   
2. **Search/Matching** - `step-2-search.svg`
   - Search: "search magnifying glass people flat"
   
3. **Selection** - `step-3-selection.svg`
   - Search: "user selection checkmark flat"
   
4. **Agreement** - `step-4-handshake.svg`
   - Search: "handshake deal agreement flat"
   
5. **Payment** - `step-5-payment.svg`
   - Search: "credit card payment secure flat"
   
6. **Review** - `step-6-rating.svg`
   - Search: "star rating review flat"

### 4. Flat Icons Pack (SVG)

**Categories Needed:**
- Security icons (shield, lock, checkmark)
- Action icons (arrow, send, check)
- Social media icons (whatsapp, email, phone)
- Business icons (briefcase, users, building)

**Download from:**
- Freepik Icons: https://www.freepik.com/icons
- Search: "flat icon pack minimalist"
- Save to: `public/landing/icons/`

### 5. Background Patterns

**Search:**
- "abstract gradient background modern"
- "geometric pattern subtle tech"
- Save to: `public/landing/images/backgrounds/`

## 🔧 How to Use Freepik MCP

### Option 1: Direct MCP Search (if API key available)

```javascript
// Search for resources
mcp_freepik-fastmcp_search_resources({
  term: "dashboard illustration flat",
  filters: {
    content_type: { vector: 1 },
    license: { freemium: 1 }
  },
  limit: 10
})

// Download resource
mcp_freepik-fastmcp_download_resource_by_id({
  resource-id: RESOURCE_ID,
  image_size: "large"
})
```

### Option 2: Manual Download from Freepik.com

1. Visit https://www.freepik.com
2. Search for the asset using terms above
3. Filter by:
   - **Type**: Vector (SVG)
   - **License**: Free
   - **Style**: Flat, Modern
4. Download and save to appropriate folder
5. Optimize SVGs using SVGO or similar

## 📁 Asset Organization

```
public/
├── landing/
│   ├── images/
│   │   ├── whatsapp-feature.svg
│   │   ├── secure-payment.svg
│   │   ├── ai-matching.svg
│   │   ├── step-1-conversation.svg
│   │   ├── step-2-search.svg
│   │   ├── step-3-selection.svg
│   │   ├── step-4-handshake.svg
│   │   ├── step-5-payment.svg
│   │   └── step-6-rating.svg
│   ├── icons/
│   │   ├── shield.svg
│   │   ├── check.svg
│   │   ├── arrow.svg
│   │   └── [more icons]
│   └── logos/
│       └── [partner logos]
└── hero/
    └── dashboard-mockup.svg
```

## 🎨 Style Guidelines

### Colors to Look For:
- **Primary**: Blue (#0EA5E9), Cyan (#06B6D4)
- **Secondary**: Purple (#8B5CF6), Indigo (#6366F1)
- **Accent**: Amber (#F59E0B), Orange (#FB923C)
- **Success**: Green (#10B981), Emerald (#059669)

### Design Style:
- ✅ Flat design (no gradients on main elements)
- ✅ Minimalist, clean lines
- ✅ Modern SaaS aesthetic
- ✅ Professional, trustworthy
- ❌ Avoid 3D or realistic styles
- ❌ Avoid overly detailed illustrations

## 🚀 Quick Start Commands

### Search for Icons:
```bash
# Via Freepik MCP
mcp_freepik-fastmcp_search_icons({
  term: "security payment",
  filters: { shape: "flat", free_svg: "free" },
  per_page: 20
})
```

### Download Specific Icon:
```bash
mcp_freepik-fastmcp_download_icon_by_id({
  id: ICON_ID,
  format: "svg"
})
```

## 📝 License Tracking

Keep track of all downloaded assets:

| Asset Name | Freepik ID | License | Attribution Required |
|------------|------------|---------|---------------------|
| whatsapp-feature.svg | TBD | Free | No |
| secure-payment.svg | TBD | Free | No |
| ai-matching.svg | TBD | Free | No |

## ✅ Asset Checklist

- [ ] Hero dashboard mockup
- [ ] 3 main feature illustrations
- [ ] 6 how-it-works step illustrations
- [ ] 30+ flat icons (various categories)
- [ ] Background patterns (optional)
- [ ] All assets optimized (< 50KB each SVG)
- [ ] All assets saved in correct folders
- [ ] License information documented

## 💡 Tips

1. **Use SVG format** whenever possible for crisp scaling
2. **Optimize SVGs** with SVGO or similar tools
3. **Consistent style** - all illustrations should look cohesive
4. **Color matching** - adjust colors to match our palette
5. **File naming** - use descriptive kebab-case names
6. **Size optimization** - keep SVGs under 50KB

## 🔗 Useful Links

- Freepik: https://www.freepik.com
- Freepik Icons: https://www.freepik.com/icons
- Freepik Illustrations: https://www.freepik.com/vectors
- SVGO Optimizer: https://jakearchibald.github.io/svgomg/
- Color Palette: https://coolors.co/0ea5e9-8b5cf6-f59e0b-10b981

---

**Note**: Until Freepik API is configured, manually download assets from freepik.com following the guidelines above.


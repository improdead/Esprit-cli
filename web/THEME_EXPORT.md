# Esprit Landing Page Theme Export

This document contains the complete design system and theme tokens extracted from the Esprit landing page. Use this to design a dashboard that matches the landing page aesthetic.

## Color Palette

### Primary Colors
- **Black**: `#000000` / `black`
- **Dark Gray**: `#222222` / `#222`
- **Gray**: `#333333` / `#333`

### Background Colors
- **Main Background**: `#e8e8e8` (light gray)
- **Main Background with Opacity**: `#e8e8e8/90` (90% opacity)
- **White**: `#ffffff` / `white`
- **Off White**: `#fafafa`
- **Light Gray**: `#f9f9f9`

### Text Colors
- **Primary Text**: `#111111` / `#111`
- **Black Text**: `#000000` / `black`
- **Dark Gray Text**: `#222222` / `#222`
- **Gray Text**: `#666666` / `#666`
- **Medium Gray**: `#999999` / `#999`
- **Light Gray**: `#cccccc` / `#ccc`
- **Muted**: `#666666`

### Border Colors
- **Default**: `#cccccc` / `#ccc` / `gray-300`
- **Hover**: `#999999` / `#999`
- **Light**: `#e5e5e5` / `gray-200`
- **Dark**: `#333333` / `#333`

### Accent Colors
- **Orange 500**: `#f97316` / `orange-500`
- **Orange 600**: `#ea580c` / `orange-600`
- **Orange with 5% opacity**: `orange-500/5` (for glow effects)

### Code Syntax Colors
- **Purple**: `#9333ea` / `purple-600` (for keywords like `const`, `new`)
- **Green**: `#16a34a` / `green-600` (for strings)
- **Blue**: `#2563eb` / `blue-600` (for numbers)
- **Gray**: `#6b7280` / `gray-400` (for comments)

### Selection Colors
- **Background**: `orange-100`
- **Text**: `orange-900`

## Typography

### Font Families
- **Sans Serif**: `font-sans` (system font stack) - Used for headings, navigation
- **Serif**: `font-serif` (system serif stack) - Used for large display text
- **Monospace**: `font-mono` (monospace font stack) - Used for body text, labels, buttons, code

### Font Sizes
- **Extra Small**: `text-xs` (12px / 0.75rem)
- **Small**: `text-sm` (14px / 0.875rem)
- **Base**: `text-base` (16px / 1rem)
- **Large**: `text-lg` (18px / 1.125rem)
- **XL**: `text-xl` (20px / 1.25rem)
- **2XL**: `text-2xl` (24px / 1.5rem)
- **3XL**: `text-3xl` (30px / 1.875rem)
- **4XL**: `text-4xl` (36px / 2.25rem)
- **5XL**: `text-5xl` (48px / 3rem)
- **6XL**: `text-6xl` (60px / 3.75rem)
- **7XL**: `text-7xl` (72px / 4.5rem)

**Custom Sizes:**
- `text-[10px]` (0.625rem)
- `text-[11px]` (0.6875rem)
- `text-[13px]` (0.8125rem)

### Font Weights
- **Normal**: `font-normal` (400)
- **Medium**: `font-medium` (500)
- **Semibold**: `font-semibold` (600)
- **Bold**: `font-bold` (700)

### Line Heights
- **Tight**: `leading-tight` or `leading-[1.0]` (1.0)
- **Relaxed**: `leading-relaxed` (1.5-1.75)
- **Normal**: `leading-normal` (1.5)

### Letter Spacing
- **Tight**: `tracking-tight`
- **Wide**: `tracking-wide`
- **Widest**: `tracking-widest`
- **Custom**: `tracking-[0.2em]`

### Text Styles

#### Headline (Hero)
```css
font-family: font-sans
font-weight: font-medium
font-size: text-5xl md:text-6xl lg:text-7xl
line-height: leading-[1.0]
letter-spacing: tracking-tight
color: text-[#111]
```

#### Subheadline
```css
font-family: font-mono
font-size: text-xs md:text-sm
line-height: leading-relaxed
letter-spacing: tracking-tight
color: text-[#666]
```

#### Section Title
```css
font-family: font-sans or font-serif
font-weight: font-medium
font-size: text-3xl md:text-4xl or text-4xl md:text-5xl
line-height: leading-tight or leading-[1.1]
```

#### Body Text
```css
font-family: font-mono
font-size: text-xs md:text-sm or text-sm md:text-base
line-height: leading-relaxed
color: text-gray-600
```

#### Labels
```css
font-family: font-mono
font-size: text-xs
font-weight: font-medium
letter-spacing: tracking-[0.2em] or tracking-widest
color: text-gray-400
text-transform: uppercase
```

#### Navigation
```css
font-family: font-sans
font-size: text-[13px]
font-weight: font-medium
letter-spacing: tracking-wide
text-transform: uppercase
```

#### Buttons
```css
font-family: font-mono
font-size: text-xs or text-sm
letter-spacing: tracking-widest
text-transform: uppercase
```

## Spacing

### Spacing Scale
- `0` = 0
- `1` = 4px (0.25rem)
- `1.5` = 6px (0.375rem)
- `2` = 8px (0.5rem)
- `3` = 12px (0.75rem)
- `4` = 16px (1rem)
- `5` = 20px (1.25rem)
- `6` = 24px (1.5rem)
- `8` = 32px (2rem)
- `10` = 40px (2.5rem)
- `12` = 48px (3rem)
- `16` = 64px (4rem)
- `20` = 80px (5rem)
- `24` = 96px (6rem)

### Section Padding
- **Vertical**: `py-20` (80px) or `py-24` (96px)
- **Horizontal**: `px-6` (24px)
- **Hero**: `pt-20 pb-24`

### Container Max Widths
- **Small**: `max-w-3xl` (768px)
- **Medium**: `max-w-5xl` (1024px)
- **Large**: `max-w-7xl` (1280px)
- **XLarge**: `max-w-[1200px]`
- **XXLarge**: `max-w-[1440px]`

## Components

### Button

**Base Styles:**
```css
inline-flex items-center font-mono transition-all duration-200 active:translate-y-[1px]
```

**Primary Variant:**
```css
bg-[#222] text-white border border-[#222] hover:bg-black shadow-sm
```

**Outline Variant:**
```css
bg-transparent text-[#222] border border-[#ccc] hover:border-[#999] hover:bg-white/50
```

**Text Variant:**
```css
bg-transparent text-[#222] hover:text-black underline decoration-1 underline-offset-4
```

**Sizes:**
- **Small**: `px-4 py-1.5 text-xs`
- **Medium**: `px-6 py-2.5 text-sm`
- **Large**: `px-8 py-3 text-base`

**Header Button:**
```css
h-full px-8 bg-black text-white font-mono text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors
```

### Header

```css
sticky top-0 z-50 bg-[#e8e8e8]/90 backdrop-blur-md border-b border-gray-300 h-[72px]
```

- **Height**: `72px` (`h-[72px]`)
- **Background**: `#e8e8e8` with 90% opacity
- **Backdrop Blur**: `backdrop-blur-md`
- **Border**: `border-b border-gray-300`
- **Logo Height**: `h-16` (64px)

### Card

```css
bg-white rounded border border-gray-200 shadow-sm p-6
```

- **Background**: `bg-white`
- **Border**: `border border-gray-200`
- **Border Radius**: `rounded`
- **Shadow**: `shadow-sm` or `shadow-soft`
- **Padding**: `p-6`

### Code Block

```css
bg-white rounded border border-gray-200 shadow-soft overflow-hidden font-mono text-xs
```

**Header:**
```css
bg-[#fafafa] border-b border-gray-200
```

**Line Numbers:**
```css
text-gray-300 border-r border-gray-100
```

**Syntax Colors:**
- Keywords: `text-purple-600`
- Strings: `text-green-600`
- Numbers: `text-blue-600`
- Comments: `text-gray-400`

### Section

```css
py-20 px-6 max-w-5xl mx-auto border-t border-gray-200
```

- **Spacing**: `py-20 px-6`
- **Border**: `border-t border-gray-200` (top border)
- **Max Width**: `max-w-5xl` or `max-w-7xl`
- **Centering**: `mx-auto`

## Effects

### Glow Effect
```css
absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none z-[-1]
```

### Backdrop Blur
```css
backdrop-blur-md
```

### Transitions
- **Default**: `transition-colors`
- **All**: `transition-all duration-200`
- **Smooth**: `transition-all duration-300 ease-in-out`

### Hover Effects
- **Translate**: `group-hover:translate-x-0.5`
- **Scale**: `active:translate-y-[1px]`

## Decorative Elements

### Dots Pattern
```css
w-1 h-1 bg-black/50 rounded-sm gap-1.5
```

### Badge Dot
```css
w-2 h-2 rounded-full bg-black
```

## Layout

### Main Container
```css
max-w-[1440px] mx-auto bg-background/50 border-x border-white/50 shadow-2xl min-h-screen
```

### Grid Layout
```css
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
```

### Flex Layout
- Common gaps: `gap-3`, `gap-4`, `gap-8`, `gap-16`

## Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Design Principles

1. **Minimalism**: Clean, minimal design with plenty of white space
2. **Typography**: Strong emphasis on typography hierarchy with sans-serif for headings and monospace for body text
3. **Contrast**: High contrast between text and backgrounds (black on light gray)
4. **Spacing**: Generous spacing between sections and elements
5. **Monochrome**: Primarily black, white, and gray color palette with orange as accent
6. **Modern**: Modern, professional aesthetic suitable for developer tools
7. **Readability**: Focus on readability with relaxed line heights and appropriate font sizes

## Usage Notes

### Colors
- Use the monochrome palette (black, white, grays) as primary colors
- Orange (`#f97316`, `#ea580c`) should be used sparingly as an accent color for highlights, CTAs, or important information

### Typography
- Use `font-sans` for headings and navigation
- Use `font-serif` for large display text
- Use `font-mono` for body text, labels, buttons, and code-related content

### Spacing
- Maintain generous spacing (`py-20`, `py-24` for sections)
- Use consistent padding (`px-6`) for horizontal spacing

### Components
- Buttons should use uppercase text with wide letter spacing
- Cards should have subtle borders and shadows
- Use backdrop blur for overlays and sticky headers

### Layout
- Use max-width containers (`max-w-[1440px]` for main container)
- Center content with `mx-auto`
- Use responsive grid layouts with appropriate breakpoints

## Example Component Styles

### Dashboard Card Example
```tsx
<div className="bg-white rounded border border-gray-200 shadow-sm p-6">
  <h3 className="font-sans font-medium text-lg mb-2">Card Title</h3>
  <p className="font-mono text-gray-600 text-sm mb-4">Card description</p>
  <button className="text-black font-mono text-xs uppercase tracking-widest flex items-center gap-2 hover:text-gray-600 transition-colors">
    View All <ArrowRight size={14} />
  </button>
</div>
```

### Dashboard Section Example
```tsx
<section className="py-12 px-6 max-w-7xl mx-auto">
  <div className="mb-8">
    <h1 className="text-4xl font-sans font-medium text-gray-900 mb-2">
      Dashboard
    </h1>
    <p className="text-gray-600 font-mono text-sm">
      Welcome to your Esprit dashboard
    </p>
  </div>
  {/* Content */}
</section>
```

---

**Note**: All color values and class names are based on Tailwind CSS. The theme uses a monochrome palette with orange accents, emphasizing typography and clean spacing.


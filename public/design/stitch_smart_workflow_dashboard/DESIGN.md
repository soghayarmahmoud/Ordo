---
name: Lumina Console
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00a572'
  on-tertiary-container: '#00311f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base-unit: 4px
  gutter: 24px
  margin-page: 32px
  container-padding: 20px
  stack-gap: 12px
---

## Brand & Style

This design system is engineered for developers and power users who demand a high-performance, focused environment. The brand personality is technical yet sophisticated, blending the utility of a CLI with the visual polish of modern SaaS.

The aesthetic leans heavily into **Glassmorphism** and **Modern Corporate** styles. It utilizes deep, ink-like foundations layered with semi-transparent surfaces that feel like polished obsidian. The emotional response should be one of "flow state"—calm, organized, and hyper-efficient. Expect high-contrast interactions, vibrant neon-adjacent accents against muted slates, and a sense of physical depth created through light refraction and background blurs.

## Colors

The palette is optimized for long-duration dark mode usage. 
- **Base Layer:** The deepest slate (`#0f172a`) serves as the application canvas.
- **Surface Layers:** Elements "floating" above the base use a semi-transparent hex with an alpha channel to allow background colors to bleed through slightly.
- **Accents:** A primary Electric Blue (`#3b82f6`) and a Secondary Violet (`#8b5cf6`) are used for primary actions and active states.
- **Utility:** Success states use Emerald (`#10b981`), while destructive actions use a sharp Rose (`#f43f5e`).
- **Borders:** All container boundaries use a crisp Slate (`#1e293b`) to maintain structure without excessive visual weight.

## Typography

The typography system prioritizes legibility and technical precision. **Inter** is the primary typeface for all UI elements, chosen for its neutral, highly readable letterforms. For metadata, tags, and code snippets, **JetBrains Mono** is used to provide a distinct "developer-first" feel.

- **Scale:** High contrast between headlines and body text ensures clear information hierarchy.
- **Weight:** Semi-bold is preferred for headings to stand out against dark, blurred backgrounds.
- **Monospace:** Use JetBrains Mono exclusively for status labels, IDs, and any data that requires character-level alignment.

## Layout & Spacing

This design system utilizes a **12-column fluid grid** for the main content area, with a fixed-width sidebar for navigation. 

- **Sidebar:** Fixed at 240px (expanded) or 72px (collapsed).
- **Rhythm:** A strictly 4px-based scaling system ensures consistent vertical and horizontal rhythm. 
- **Containers:** All dashboard widgets should utilize a standard `20px` internal padding.
- **Mobile Adaptivity:** On mobile devices, the grid collapses to a single column, margins reduce to `16px`, and the sidebar transforms into a bottom navigation bar or a full-screen drawer.

## Elevation & Depth

Depth is communicated through **Glassmorphism** and subtle **Tonal Layering**. 

1. **Level 0 (Base):** Solid `#0f172a`.
2. **Level 1 (Cards/Panels):** Background: `rgba(30, 41, 59, 0.5)` with a `12px` backdrop-blur. 1px solid border of `rgba(255, 255, 255, 0.1)`.
3. **Level 2 (Modals/Popovers):** Background: `rgba(30, 41, 59, 0.8)` with a `24px` backdrop-blur. Ambient shadow: `0 20px 25px -5px rgba(0, 0, 0, 0.5)`.
4. **Active States:** Elements in focus or active use a secondary "outer glow" shadow using the primary blue or purple at 20% opacity.

The goal is to create a UI that feels like it is projected onto layers of glass.

## Shapes

The shape language is consistently rounded to soften the technical nature of the dashboard.
- **Standard Cards/Modals:** `12px` (rounded-lg).
- **Buttons & Inputs:** `8px` (rounded-md).
- **Tags & Status Badges:** Fully pill-shaped for immediate distinction from interactive buttons.
- **Interactive States:** On hover, clickable areas should show a subtle increase in border-radius or a glowing corner accent to indicate engagement.

## Components

### Buttons
- **Primary:** Solid `#3b82f6` with white text. Subtle inner top-light border to give a 3D feel.
- **Secondary:** Transparent with `#1e293b` border. Hover state triggers a background shift to `rgba(59, 130, 246, 0.1)`.

### Input Fields
- Dark backgrounds (`#0f172a`) with a 1px border. Focus state changes the border to Primary Blue and adds a `2px` soft blue glow.

### Kanban Boards
- Columns are semi-transparent with a `backdrop-blur`. 
- Task cards use the Level 1 Elevation (Glassmorphism) with a vertical color strip on the left to denote priority.

### Toggle Switches
- Track: `#1e293b`.
- Thumb: White.
- Active Track: Linear gradient from Primary Blue to Secondary Purple.

### Sidebar Icons
- Minimalist line-art icons (2px stroke). 
- Active state uses a "dual tone" where the icon fills with a low-opacity version of the accent color and gains a vibrant 2px left-side indicator bar.

### Data Cards
- Headlines in Inter (14px Bold).
- Values in JetBrains Mono for numerical precision.
- Sparkline charts in the background should be monochromatic (Slate) unless the trend is significant (Primary Blue).
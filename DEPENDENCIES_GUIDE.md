# Package Dependencies Reference

## All Dependencies Explained

This document explains every package used in this project and why it's needed.

---

## 📦 Core Framework Dependencies

### **react** (18.3.1)
- **Purpose**: Core React library for building UI
- **Why**: Foundation of the entire application
- **Size**: ~6 KB (gzipped)

### **react-dom** (18.3.1)
- **Purpose**: React rendering for web browsers
- **Why**: Renders React components to the DOM
- **Size**: ~42 KB (gzipped)

---

## 🔄 Routing

### **react-router** (7.13.0)
- **Purpose**: Client-side routing and navigation
- **Why**: Handles navigation between pages without page reload
- **Used For**: Home → Product Details → Create Product, etc.
- **Note**: NOT react-router-dom (doesn't work in this environment)

---

## 🎨 Styling

### **tailwindcss** (4.1.12)
- **Purpose**: Utility-first CSS framework
- **Why**: Fast styling with pre-built classes
- **Example**: `className="flex items-center gap-2"`

### **@tailwindcss/vite** (4.1.12)
- **Purpose**: Tailwind v4 Vite integration
- **Why**: Enables Tailwind in Vite build process

### **tailwind-merge** (3.2.0)
- **Purpose**: Merges Tailwind classes intelligently
- **Why**: Prevents class conflicts, used in `cn()` utility
- **Example**: `cn("text-sm", "text-lg")` → `"text-lg"`

### **class-variance-authority** (0.7.1)
- **Purpose**: Create variant-based component APIs
- **Why**: Makes reusable component variants (button sizes, colors)
- **Example**: `button({ variant: "primary", size: "lg" })`

### **clsx** (2.1.1)
- **Purpose**: Conditional class names utility
- **Why**: Dynamically apply classes based on conditions
- **Example**: `clsx({ 'active': isActive })`

---

## 🧩 UI Components (Radix UI)

All Radix packages provide accessible, unstyled primitives:

### **@radix-ui/react-accordion** (1.2.3)
- Collapsible sections with animation

### **@radix-ui/react-alert-dialog** (1.1.6)
- Modal dialogs for confirmations

### **@radix-ui/react-avatar** (1.1.3)
- User avatar with fallback

### **@radix-ui/react-checkbox** (1.1.4)
- Accessible checkbox component

### **@radix-ui/react-dialog** (1.1.6)
- Modal overlays and dialogs

### **@radix-ui/react-dropdown-menu** (2.1.6)
- Dropdown menus and context menus

### **@radix-ui/react-label** (2.1.2)
- Form labels with proper associations

### **@radix-ui/react-popover** (1.1.6)
- Floating content anchored to elements

### **@radix-ui/react-select** (2.1.6)
- Accessible select dropdowns

### **@radix-ui/react-separator** (1.1.2)
- Visual dividers between content

### **@radix-ui/react-slot** (1.1.2)
- Merges props with child components

### **@radix-ui/react-switch** (1.1.3)
- Toggle switch component

### **@radix-ui/react-tabs** (1.1.3)
- Tabbed content sections

### **@radix-ui/react-tooltip** (1.1.8)
- Hover tooltips

**Why use Radix?**
- Accessible by default (WCAG compliant)
- Unstyled (full design control)
- Keyboard navigation built-in
- Focus management handled

---

## 🎭 Icons

### **lucide-react** (0.487.0)
- **Purpose**: Icon library
- **Why**: Beautiful, consistent icons
- **Example**: `<ArrowLeft />`, `<Upload />`, `<DollarSign />`
- **Size**: Tree-shakeable, only imports used icons

---

## 🔔 Notifications

### **sonner** (2.0.3)
- **Purpose**: Toast notifications
- **Why**: User feedback for actions (bid placed, error messages)
- **Example**: `toast.success("Bid placed!")`

---

## 🎬 Animation

### **motion** (12.23.24)
- **Purpose**: Animation library (formerly Framer Motion)
- **Why**: Smooth animations and transitions
- **Note**: Only if animations are added later
- **Import**: `import { motion } from "motion/react"`

---

## 📅 Date Handling

### **date-fns** (3.6.0)
- **Purpose**: Date manipulation and formatting
- **Why**: Format timestamps, calculate time differences
- **Example**: `formatDistance(date, now)` → "2 hours ago"

---

## 🖼️ Image & Media

### **embla-carousel-react** (8.6.0)
- **Purpose**: Carousel/slider component
- **Why**: Product image galleries
- **Note**: Replaced with custom implementation to avoid errors

---

## 📝 Forms

### **react-hook-form** (7.55.0)
- **Purpose**: Form state management and validation
- **Why**: Handle complex forms with validation
- **Example**: Create product form, bid form
- **Note**: Required to use version 7.55.0

---

## 🎨 Material UI (Optional)

### **@mui/material** (7.3.5)
- **Purpose**: Material Design components
- **Note**: Included for optional use

### **@emotion/react** & **@emotion/styled**
- **Purpose**: CSS-in-JS for Material UI
- **Required**: Peer dependencies for @mui/material

### **@mui/icons-material** (7.3.5)
- **Purpose**: Material Design icons
- **Note**: Alternative to Lucide icons

---

## 🎨 Ant Design (Optional)

### **antd** (installed if needed)
- **Purpose**: Ant Design component library
- **Note**: Alternative component library

---

## 🎨 Theme Management

### **next-themes** (0.4.6)
- **Purpose**: Dark mode / theme switching
- **Note**: Originally for Next.js, removed from sonner component
- **Status**: Not actively used

---

## 🛠️ Build Tools

### **vite** (6.3.5)
- **Purpose**: Build tool and dev server
- **Why**: Fast HMR, optimized production builds
- **Speed**: ~100x faster than Webpack

### **@vitejs/plugin-react** (4.7.0)
- **Purpose**: React support for Vite
- **Why**: Enables JSX, Fast Refresh

---

## 🎯 Utility Libraries

### **@popperjs/core** (2.11.8)
- **Purpose**: Tooltip and popover positioning
- **Why**: Smart positioning that avoids edges

### **react-popper** (2.3.0)
- **Purpose**: React wrapper for Popper.js
- **Why**: Easier Popper integration with React

### **cmdk** (1.1.1)
- **Purpose**: Command menu component
- **Why**: Keyboard-driven command palette (if added)

### **input-otp** (1.4.2)
- **Purpose**: OTP/PIN input component
- **Why**: For verification codes (if added later)

### **react-day-picker** (8.10.1)
- **Purpose**: Date picker component
- **Why**: Select auction end dates (if added)

### **vaul** (1.1.2)
- **Purpose**: Drawer/bottom sheet component
- **Why**: Mobile-friendly bottom drawers

---

## 🎮 Drag & Drop

### **react-dnd** (16.0.1)
- **Purpose**: Drag and drop functionality
- **Why**: Reorder images, drag to upload

### **react-dnd-html5-backend** (16.0.1)
- **Purpose**: HTML5 drag and drop backend
- **Why**: Required for react-dnd to work

---

## 📊 Charts (Optional)

### **recharts** (2.15.2)
- **Purpose**: Chart library
- **Why**: Visualize bid history, analytics
- **Note**: For future dashboard features

---

## 🎪 UI Utilities

### **react-resizable-panels** (2.1.7)
- **Purpose**: Resizable panel layouts
- **Why**: Split views, adjustable sidebars

### **react-responsive-masonry** (2.7.1)
- **Purpose**: Masonry grid layout
- **Why**: Pinterest-style image grids

### **react-slick** (0.31.0)
- **Purpose**: Carousel/slider
- **Why**: Alternative to Embla carousel

### **tw-animate-css** (1.3.8)
- **Purpose**: Tailwind animation utilities
- **Why**: Pre-built animation classes

---

## 📱 Why These Specific Versions?

### Locked Versions
- **react-hook-form@7.55.0** - Required version for compatibility
- **vite@6.3.5** - Overridden in package.json

### Latest Versions
- All other packages use latest stable versions
- Auto-updated for security patches

---

## 📊 Total Bundle Size

### Development
- **node_modules**: ~400-500 MB
- **Includes**: All dependencies + dev tools

### Production (After Build)
- **JavaScript**: ~200 KB (gzipped)
- **CSS**: ~50 KB (gzipped)
- **Total**: ~250 KB
- **Load Time**: < 1 second on 3G

---

## 🗑️ Optional: Remove Unused Packages

If not using certain features, you can remove:

```bash
# Remove Material UI
npm uninstall @mui/material @mui/icons-material @emotion/react @emotion/styled

# Remove charts
npm uninstall recharts

# Remove drag and drop
npm uninstall react-dnd react-dnd-html5-backend

# Remove animation
npm uninstall motion

# Remove carousel
npm uninstall react-slick
```

**Warning**: Only remove if you're sure you won't use them!

---

## ➕ Adding New Packages

```bash
# Install any new package
npm install package-name

# Example: Add axios for API calls
npm install axios

# Example: Add date library
npm install dayjs
```

---

## 🔄 Updating Packages

```bash
# Check for updates
npm outdated

# Update all packages
npm update

# Update specific package
npm install react@latest

# Update to latest (including major versions)
npx npm-check-updates -u
npm install
```

---

## 🔒 Security

### Checking for Vulnerabilities
```bash
# Audit packages
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Force fix (may break things)
npm audit fix --force
```

---

## 📚 Further Reading

- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **Tailwind**: https://tailwindcss.com/
- **Radix UI**: https://www.radix-ui.com/
- **React Router**: https://reactrouter.com/

---

**Summary**: Every package serves a purpose. Core packages (React, Vite, Tailwind, React Router) are essential. UI libraries (Radix) provide accessible components. Everything else adds specific features you might need.

# 🎨 Theme Management Guide

## Overview

Dự án sử dụng hệ thống theme management dựa trên **CSS Variables** và **TypeScript constants** để quản lý màu sắc, spacing, typography và các thuộc tính design system khác.

## File Structure

```
src/themes/
├── index.ts          # Export chính
├── theme.ts          # Theme constants (TypeScript)
└── variables.css     # CSS Variables
```

## CSS Variables (`variables.css`)

### Cách sử dụng:

```css
.my-component {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  padding: var(--spacing-lg);
  border-radius: var(--radius-xl);
}
```

### Danh sách Variables:

#### Colors:
- `--color-primary`: #0084ff (Màu chủ đạo)
- `--color-primary-hover`: #0073e6
- `--color-secondary`: #667eea
- `--color-bg-primary`: #ffffff
- `--color-bg-secondary`: #f5f5f5
- `--color-text-primary`: #000000
- `--color-text-secondary`: #999999
- `--color-border-light`: #f0f0f0
- `--color-message-own`: #0084ff
- `--color-message-other`: #ffffff

#### Spacing:
- `--spacing-xs`: 4px
- `--spacing-sm`: 8px
- `--spacing-md`: 12px
- `--spacing-lg`: 16px
- `--spacing-xl`: 24px
- `--spacing-xxl`: 32px

#### Border Radius:
- `--radius-sm`: 4px
- `--radius-md`: 8px
- `--radius-lg`: 12px
- `--radius-xl`: 18px
- `--radius-round`: 50%

#### Font Sizes:
- `--font-size-xs`: 11px
- `--font-size-sm`: 12px
- `--font-size-base`: 14px
- `--font-size-md`: 16px
- `--font-size-lg`: 18px
- `--font-size-xl`: 20px

#### Shadows:
- `--shadow-sm`: 0 2px 4px rgba(0, 0, 0, 0.1)
- `--shadow-md`: 0 4px 12px rgba(0, 0, 0, 0.15)
- `--shadow-lg`: 0 8px 24px rgba(0, 0, 0, 0.2)

## TypeScript Theme (`theme.ts`)

### Cách sử dụng:

```typescript
import { theme } from '@/themes'

const styles = {
  backgroundColor: theme.colors.primary,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.xl,
}
```

### Type-safe:

```typescript
import type { Theme } from '@/themes'

const getButtonColor = (theme: Theme) => {
  return theme.colors.primary
}
```

## Dark Mode Support

CSS Variables hỗ trợ dark mode:

```css
[data-theme='dark'] {
  --color-bg-primary: #1a1a1a;
  --color-bg-secondary: #2a2a2a;
  --color-text-primary: #ffffff;
  /* ... */
}
```

Để toggle dark mode:

```typescript
document.documentElement.setAttribute('data-theme', 'dark')
```

## Best Practices

### ✅ DO:

```css
/* Sử dụng CSS variables */
.button {
  background: var(--color-primary);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
}
```

```typescript
// Sử dụng theme constants cho dynamic styles
import { theme } from '@/themes'
const buttonStyle = {
  backgroundColor: theme.colors.primary
}
```

### ❌ DON'T:

```css
/* Hardcode màu sắc */
.button {
  background: #0084ff; /* ❌ */
  padding: 12px 16px;  /* ❌ */
}
```

```tsx
// Inline styles với hardcoded values
<div style={{ background: '#0084ff', padding: '16px' }}> {/* ❌ */}
```

## Thay đổi Theme

### 1. Thay đổi toàn cục:

Chỉnh sửa `src/themes/variables.css`:

```css
:root {
  --color-primary: #ff6b6b; /* Red theme */
  /* ... */
}
```

### 2. Thay đổi Ant Design theme:

Chỉnh sửa `src/main.tsx`:

```typescript
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#ff6b6b',
      borderRadius: 12,
    },
  }}
>
```

### 3. Thêm màu mới:

**variables.css:**
```css
:root {
  --color-accent: #ff6b6b;
}
```

**theme.ts:**
```typescript
export const theme = {
  colors: {
    // ... existing colors
    accent: '#ff6b6b',
  },
}
```

## Component Example

```tsx
// MyComponent/Index.tsx
import React from 'react'
import './index.css'

const MyComponent: React.FC = () => {
  return (
    <div className="my-component">
      <h1 className="my-component__title">Hello</h1>
      <p className="my-component__text">World</p>
    </div>
  )
}
```

```css
/* MyComponent/index.css */
.my-component {
  background: var(--color-bg-primary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.my-component__title {
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
}

.my-component__text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
}
```

## Migration from Inline Styles

### Before (❌):
```tsx
<div style={{
  background: '#fff',
  padding: '16px',
  borderRadius: '8px'
}}>
```

### After (✅):
```tsx
<div className="my-component">
```

```css
.my-component {
  background: var(--color-bg-primary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
}
```

## Resources

- [CSS Variables MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Ant Design Theming](https://ant.design/docs/react/customize-theme)
- [BEM Naming Convention](http://getbem.com/naming/)

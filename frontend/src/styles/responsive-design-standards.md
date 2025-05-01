# URL Shortener - Responsive Design Standards

## Breakpoints

- `xs`: 360px (Small mobile)
- `sm`: 640px (Large mobile/small tablet)
- `md`: 768px (Tablet)
- `lg`: 1024px (Small desktop)
- `xl`: 1280px (Medium desktop)
- `2xl`: 1536px (Large desktop)

## Text Sizes

- Headlines: `text-2xl sm:text-3xl md:text-4xl lg:text-5xl`
- Section titles: `text-xl sm:text-2xl md:text-3xl`
- Body text: `text-base`
- Small text: `text-sm`

## Spacing

- Page padding: `px-4 sm:px-6 lg:px-8`
- Section spacing: `my-8 md:my-12 lg:my-16`
- Component padding: `p-4 md:p-6`

## Layout

- Stack on mobile, grid on desktop: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Responsive widths: `w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto`

## Components

- Cards: Add `overflow-hidden` for mobile views
- Tables: Wrap in `overflow-x-auto` for horizontal scrolling
- Forms: Stack inputs on mobile, horizontal on larger screens

## Mobile-First Development Process

1. Design for mobile first (320px width minimum)
2. Add responsive classes for larger screens
3. Test all components at each breakpoint
4. Use responsive developer tools in browsers
5. Implement and test on real devices when possible

## Accessibility Guidelines

- Touch targets should be at least 44x44px on mobile
- Text should be readable at all sizes (min 16px for body text)
- Ensure sufficient color contrast
- Maintain focus states for keyboard navigation
- Use semantic HTML elements

## Components Library

- Use the provided responsive components:
  - `Container`: For consistent page layouts
  - `Grid`: For responsive grid layouts
  - `MobileNav`: For responsive navigation
  - `ResponsiveImage`: For optimized image loading

## Testing Checklist

- Test on iPhone SE (smallest common screen)
- Test on iPhone 12/13 (medium)
- Test on iPad/iPad Mini (tablet)
- Test on desktop at various sizes
- Verify overflow handling in confined spaces
- Check that text doesn't overflow containers
- Ensure navigation works at all screen sizes

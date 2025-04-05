# Global Rules for Client-Side Development

This document outlines the global rules and best practices for client-side development using React, Material-UI, and with a strong focus on WCAG conformance.

## Core Development Principles

* **Accessibility First**: Accessibility is not an add-on but a core requirement. All components must meet WCAG 2.2 AA standards.
* **Type Safety**: Use TypeScript for all code with strict type checking enabled.
* **Component-Based Architecture**: Build using small, reusable, well-tested components.
* **Responsive Design**: All UI must work correctly across mobile, tablet, and desktop.
* **Performance Optimization**: Optimize for Core Web Vitals and smooth user experience.
* **Progressive Enhancement**: Core functionality should work without JavaScript when possible.
* **Internationalization Ready**: All user-facing text must use i18n wrappers.

## Code Organization

* **Feature-Based Structure**: Organize code by feature rather than by type.
* **Atomic Design Principles**: Follow atomic design methodology (atoms, molecules, organisms, templates, pages).
* **Separation of Concerns**: Separate UI components from business logic with custom hooks.
* **Reusable Logic**: Extract shared functionality into custom hooks and utility functions.

## Accessibility Requirements

* **Keyboard Navigation**: All interactive elements must be fully accessible via keyboard.
* **Focus Management**: Implement proper focus handling, especially for modals and dynamic content.
* **Screen Reader Support**: All content must be accessible to screen readers.
* **Color Contrast**: All text and interactive elements must meet WCAG AA contrast requirements.
* **Text Resizing**: UI must support text resizing up to 200% without loss of content or functionality.
* **Alternative Text**: All images must have appropriate alt text.
* **Form Labels**: All form controls must have properly associated labels.
* **Error Identification**: Form errors must be clearly identified and described.
* **Motion Sensitivity**: Respect user preferences for reduced motion.
* **Landmark Regions**: Use semantic HTML and ARIA landmarks to define page structure.

## Component Rules

* **Pure Components**: Create pure functional components when possible.
* **Separation of Concerns**: Components should have a single responsibility.
* **Prop Types**: All component props must be typed with TypeScript interfaces.
* **Default Props**: Provide sensible default props when applicable.
* **Composition**: Prefer composition over inheritance.
* **Documentation**: Include JSDoc comments for component purpose and props.
* **Accessibility Documentation**: Document accessibility features and considerations.

## State Management

* **Component State**: Use `useState` for component-specific state.
* **Complex State**: Use `useReducer` for complex component state logic.
* **Application State**: Use React Context for state shared across multiple components.
* **Global State**: For larger applications, consider Redux Toolkit or Zustand.
* **Server State**: Use React Query or SWR for data fetching and caching.
* **Immutability**: Never directly modify state, always create new state objects.

## React-Specific Rules

* **Hooks Order**: Call hooks at the top level of components, not inside conditionals or loops.
* **Dependencies**: Properly specify dependencies in useEffect, useMemo, and useCallback.
* **Cleanup**: Always clean up effects (event listeners, subscriptions) to prevent memory leaks.
* **Key Prop**: Always use stable, unique keys for items in lists.
* **React.memo**: Use React.memo for performance optimization of expensive components.
* **Fragment Usage**: Use fragments (`<>...</>`) instead of unnecessary div containers.
* **Controlled Components**: Prefer controlled components over uncontrolled when possible.

## Material-UI Usage

* **Theme**: Use the centralized theme system for consistent styling.
* **Spacing**: Use `theme.spacing()` instead of hard-coded pixel values.
* **Colors**: Use `theme.palette` colors instead of hard-coded hex values.
* **Typography**: Use `Typography` component with theme variants.
* **Grid System**: Use `Grid` component for layouts.
* **Breakpoints**: Use `theme.breakpoints` for responsive designs.
* **Styling**: Use styled API with the `sx` prop for component styling.
* **Component Customization**: Use `theme.components` for global component styling.
* **Dark Mode**: Support both light and dark color schemes.

## API Integration

* **Data Fetching**: Use React Query or SWR for data fetching, caching, and state management.
* **Error Handling**: Implement consistent error handling for all API calls.
* **Loading States**: Show appropriate loading states during API requests.
* **Retry Logic**: Implement retry logic for failed requests.
* **Cancellation**: Cancel requests when components unmount.
* **Authentication**: Handle authentication and token refreshing properly.
* **Response Parsing**: Type API responses using TypeScript interfaces.

## Form Handling

* **Form Libraries**: Use Formik with Yup or React Hook Form with Zod for complex forms.
* **Validation**: Implement both client-side and server-side validation.
* **Error Messages**: Display clear, actionable error messages.
* **Accessibility**: Ensure forms are accessible (labels, error messages, focus management).
* **Submit Button State**: Disable submit buttons during form submission.
* **Form Reset**: Provide clear way to reset form to initial state.
* **Input Masking**: Use input masking for formatted fields (phone, credit card, etc.).

## Performance Optimization

* **Code Splitting**: Use `React.lazy` and Suspense for code splitting.
* **Virtualization**: Use virtualization for long lists (`react-window`, `react-virtualized`).
* **Memoization**: Use `useMemo` and `useCallback` for expensive computations and callbacks.
* **Image Optimization**: Optimize images and use responsive image techniques.
* **Bundle Optimization**: Regularly analyze and optimize bundle size.
* **Preloading**: Preload critical resources.
* **Web Vitals**: Monitor and optimize for Core Web Vitals (LCP, FID, CLS).

## Testing Requirements

* **Component Testing**: Unit test components with React Testing Library.
* **Hook Testing**: Test custom hooks with `@testing-library/react-hooks`.
* **Snapshot Testing**: Use snapshot tests for component UI stability.
* **Accessibility Testing**: Include accessibility tests using `jest-axe`.
* **Integration Testing**: Write integration tests for key user flows.
* **Coverage**: Maintain minimum test coverage thresholds.
* **Visual Regression**: Implement visual regression testing with Storybook and Chromatic.
* **End-to-End Testing**: Use Cypress for critical user flows.

## Security Best Practices

* **Input Sanitization**: Sanitize all user inputs and API responses.
* **XSS Prevention**: Prevent cross-site scripting attacks.
* **CSRF Protection**: Implement CSRF tokens for form submissions.
* **Authentication**: Implement secure authentication flows.
* **Sensitive Data**: Never store sensitive data in localStorage.
* **Dependency Scanning**: Regularly scan for vulnerable dependencies.
* **Content Security Policy**: Implement appropriate Content Security Policy.
* **HTTPS**: Enforce HTTPS for all API calls.

## Code Style and Formatting

* **ESLint**: Follow ESLint rules, including React and accessibility plugins.
* **Prettier**: Use Prettier for consistent code formatting.
* **Import Order**: Group imports consistently (external libraries first, then internal).
* **Named Exports**: Prefer named exports over default exports.
* **File Naming**: Use consistent file naming conventions (PascalCase for components).
* **Directory Structure**: Follow consistent directory structure for components.
* **Long Lines**: Avoid excessively long lines of code (100 characters max).
* **Magic Numbers**: Avoid magic numbers, use named constants.

## Internationalization

* **Translation Library**: Use react-i18next for translations.
* **Translation Keys**: Use structured, hierarchical translation keys.
* **Interpolation**: Use variables for dynamic content in translations.
* **Pluralization**: Handle pluralization correctly.
* **RTL Support**: Support right-to-left languages in layout and design.
* **Date and Number Formatting**: Use locale-aware date and number formatting.
* **Language Switching**: Allow users to change languages without page reload.
* **Translation Management**: Use a translation management system for collaboration.

## ARIA and Accessibility Details

* **ARIA Roles**: Use appropriate ARIA roles only when HTML semantics are insufficient.
* **ARIA States and Properties**: Use ARIA states and properties correctly.
* **Focus Management**: Implement keyboard focus management for interactive widgets.
* **Skip Links**: Provide skip links for keyboard users.
* **Color Independence**: Don't use color alone to convey information.
* **Keyboard Shortcuts**: Provide keyboard shortcuts for common actions.
* **Modal Focus Trapping**: Trap focus within modal dialogs.
* **Live Regions**: Use ARIA live regions for dynamic content updates.
* **Accessible Names**: Provide accessible names for all interactive elements.
* **Form Error Announcements**: Announce form errors to screen readers.

## Design System Integration

* **Component Library**: Use Material-UI as the foundation for the design system.
* **Design Tokens**: Use design tokens for colors, spacing, typography, etc.
* **Component Documentation**: Document components in Storybook with examples and usage guidelines.
* **Accessibility Notes**: Include accessibility information in component documentation.
* **Visual Consistency**: Maintain visual consistency across the application.
* **Animation Standards**: Follow consistent animation patterns and timing.
* **Iconography**: Use consistent icon system (MUI icons or custom icon library).
* **Composition Patterns**: Document and follow standard composition patterns.

## Error Handling and Reporting

* **Global Error Boundary**: Implement React error boundaries for graceful failure.
* **Fallback UI**: Show user-friendly fallback UI when errors occur.
* **Error Logging**: Log errors to monitoring service (Sentry, LogRocket, etc.).
* **Retry Mechanisms**: Provide retry mechanisms for failed operations.
* **Meaningful Error Messages**: Show meaningful error messages to users.
* **Network Error Detection**: Detect and handle network connectivity issues.
* **Error Recovery**: Help users recover from errors when possible.
* **Error Reporting**: Allow users to report errors they encounter.

## Mobile and Responsive Design

* **Mobile-First Approach**: Design and develop with mobile-first approach.
* **Touch Targets**: Use appropriately sized touch targets (minimum 44x44px).
* **Viewport Settings**: Configure viewport settings correctly.
* **Media Queries**: Use `theme.breakpoints` for responsive layouts.
* **Input Methods**: Support different input methods (touch, keyboard, pointer).
* **Orientation Changes**: Handle device orientation changes gracefully.
* **Gesture Support**: Implement intuitive touch gestures when appropriate.
* **Network Conditions**: Test under various network conditions, including offline.

## Cross-Browser Compatibility

* **Browser Support**: Support latest two versions of major browsers (Chrome, Firefox, Safari, Edge).
* **Graceful Degradation**: Implement graceful degradation for unsupported browsers.
* **Feature Detection**: Use feature detection instead of browser detection.
* **Polyfills**: Use polyfills for missing browser features only when necessary.
* **Vendor Prefixes**: Use autoprefixer to handle vendor prefixes.
* **Testing**: Test on actual devices and browsers, not just emulators.

## Documentation Requirements

* **Code Comments**: Use JSDoc comments for functions, components, and complex logic.
* **README**: Maintain comprehensive README for the project.
* **Component Documentation**: Document components with props, examples, and accessibility notes.
* **API Documentation**: Document API integration points and data models.
* **Architecture Documentation**: Document application architecture and key patterns.
* **Storybook**: Use Storybook for interactive component documentation.
* **Change Log**: Maintain a change log for tracking changes between versions.

## Development Workflow

* **Feature Branches**: Develop new features in dedicated branches.
* **Pull Requests**: Submit changes via pull requests with proper description.
* **Code Review**: Require code review before merging.
* **CI/CD**: Use continuous integration and deployment pipelines.
* **Environment Separation**: Maintain separate development, staging, and production environments.
* **Feature Flags**: Use feature flags for controlled feature rollout.
* **Version Control**: Follow conventional commits for version control.
* **Issue Tracking**: Link commits and PRs to issue tracking system.

## Performance Budgets

* **Bundle Size**: Total JS bundle size < 200KB (gzipped)
* **First Contentful Paint**: < 1.8s
* **Largest Contentful Paint**: < 2.5s
* **First Input Delay**: < 100ms
* **Cumulative Layout Shift**: < 0.1
* **Time to Interactive**: < 3.5s
* **Server Response Time**: < 200ms
* **Resource Caching**: Implement appropriate caching strategies
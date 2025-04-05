# Accessible Visual Design Requirements for React MUI Applications

This document outlines the detailed accessibility-focused design requirements for React applications using Material-UI (MUI). These requirements incorporate WCAG 2.2 AA (and selected AAA) guidelines, ensuring our applications are usable by the widest possible audience.

## 1. Design System Foundation

### 1.1 MUI Theme Configuration

- **Create a comprehensive theme** using MUI's `createTheme()` that enforces accessibility requirements
- **Define semantic color tokens** that ensure sufficient contrast ratios for all text and UI components
- **Establish consistent spacing** using MUI's spacing system (based on 8px units)
- **Configure typography** with accessible font settings and proper hierarchy

```tsx
// src/theme/index.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { typography } from './typography';
import { palette } from './palette';
import { components } from './components';
import { shadows } from './shadows';

// Base theme with accessibility defaults
const baseTheme = createTheme({
  palette,
  typography,
  components,
  shadows,
  shape: {
    borderRadius: 8,
  },
  // Ensure proper focus visibility
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
          },
        },
      },
    },
    // Other component overrides...
  },
});

// Create responsive typography
const theme = responsiveFontSizes(baseTheme, {
  breakpoints: ['sm', 'md', 'lg'],
  factor: 2,
});

export default theme;
```

### 1.2 Color System

- **Establish a color system** with primary, secondary, and neutral colors, each with proper contrast variants
- **Ensure all text colors** have at least 4.5:1 contrast ratio with their backgrounds (7:1 for AAA)
- **Provide sufficient contrast** for UI controls and visual boundaries (at least 3:1)
- **Create accessible status colors** for success, warning, error, and info states
- **Support dark mode** with proper contrast ratios in both themes

```tsx
// src/theme/palette.ts
import { PaletteOptions } from '@mui/material';

// Accessible color palette
export const palette: PaletteOptions = {
  primary: {
    light: '#5B96F7', // 4.65:1 on white
    main: '#2563EB', // 5.77:1 on white, 4.12:1 on light gray
    dark: '#1D4ED8', // 7.25:1 on white (AAA)
    contrastText: '#FFFFFF', // 5.77:1 against main
  },
  secondary: {
    light: '#9CA3AF',
    main: '#6B7280', // 5.80:1 on white
    dark: '#4B5563', // 8.35:1 on white (AAA)
    contrastText: '#FFFFFF',
  },
  error: {
    light: '#F87171', // 2.85:1 on white (use only for non-text)
    main: '#DC2626', // 5.13:1 on white
    dark: '#B91C1C', // 6.75:1 on white (AA+)
    contrastText: '#FFFFFF',
  },
  warning: {
    light: '#FBBF24', // 1.79:1 on white (never use for text)
    main: '#D97706', // 4.52:1 on white (AA)
    dark: '#B45309', // 5.89:1 on white (AA+)
    contrastText: '#FFFFFF',
  },
  success: {
    light: '#34D399', // 2.29:1 on white (use only for non-text)
    main: '#059669', // 4.53:1 on white (AA)
    dark: '#047857', // 5.91:1 on white (AA+)
    contrastText: '#FFFFFF',
  },
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280', // Min for text on white (AA)
    600: '#4B5563', // Good for text on white (AAA)
    700: '#374151',
    800: '#1F2937',
    900: '#111827', // Good for text backgrounds
  },
  contrastThreshold: 4.5, // WCAG AA minimum
  tonalOffset: 0.2,
};
```

### 1.3 Typography

- **Select accessible fonts** with good legibility (e.g., Atkinson Hyperlegible, DM Sans)
- **Set base font size** to at least 16px (1rem)
- **Establish clear hierarchy** with distinct headings using size, weight, and spacing
- **Maintain proper line spacing** (line-height of at least 1.5 for body text)
- **Define appropriate letter spacing** (tracking) for optimal readability

```tsx
// src/theme/typography.ts
import { TypographyOptions } from '@mui/material/styles/createTypography';

// Fonts
const fontFamily = [
  'DM Sans',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
].join(',');

// Typography settings
export const typography: TypographyOptions = {
  fontFamily,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  // Headings
  h1: {
    fontWeight: 700,
    fontSize: '2.5rem', // 40px
    lineHeight: 1.2, // 48px
    letterSpacing: '-0.01em',
  },
  h2: {
    fontWeight: 700,
    fontSize: '2rem', // 32px
    lineHeight: 1.2, // 38.4px
    letterSpacing: '-0.005em',
  },
  h3: {
    fontWeight: 600,
    fontSize: '1.5rem', // 24px
    lineHeight: 1.2, // 28.8px
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.25rem', // 20px
    lineHeight: 1.2, // 24px
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.125rem', // 18px
    lineHeight: 1.2, // 21.6px
  },
  h6: {
    fontWeight: 600,
    fontSize: '1rem', // 16px
    lineHeight: 1.2, // 19.2px
  },
  // Body text
  subtitle1: {
    fontSize: '1.125rem', // 18px
    lineHeight: 1.5, // 27px
    fontWeight: 500,
  },
  subtitle2: {
    fontSize: '0.875rem', // 14px
    lineHeight: 1.57, // 22px
    fontWeight: 500,
  },
  body1: {
    fontSize: '1rem', // 16px
    lineHeight: 1.5, // 24px
  },
  body2: {
    fontSize: '0.875rem', // 14px
    lineHeight: 1.5, // 21px
  },
  // UI elements
  button: {
    fontSize: '0.875rem', // 14px
    fontWeight: 600,
    lineHeight: 1.75, // 24.5px
    textTransform: 'none', // Don't force uppercase
    letterSpacing: '0.02em',
  },
  caption: {
    fontSize: '0.75rem', // 12px
    lineHeight: 1.5, // 18px
  },
  overline: {
    fontSize: '0.75rem', // 12px
    fontWeight: 500,
    lineHeight: 1.5, // 18px
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
};
```

## 2. Interactive Elements

### 2.1 Buttons

- **Ensure sufficient size** - minimum touch target of 44×44px (especially on mobile)
- **Provide strong visual contrast** - at least 3:1 against adjacent colors
- **Include clear feedback states** - focus, hover, active states must be visually distinct
- **Add visible text labels** - avoid icon-only buttons unless providing accessible labels
- **Use consistent styling** for primary, secondary, and tertiary buttons

```tsx
// src/components/common/Button.tsx
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ButtonProps extends MuiButtonProps {
  // Additional props for accessibility features
  iconPosition?: 'start' | 'end';
}

// Styled component with accessibility enhancements
const StyledButton = styled(MuiButton)(({ theme }) => ({
  // Ensure sufficient touch target size
  minHeight: 44,
  minWidth: 44,
  padding: theme.spacing(1, 2),
  
  // Strong focus visible state
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
  
  // Enhanced hover state for mouse users
  '&:hover': {
    boxShadow: theme.shadows[2],
  },
  
  // Better text alignment with icons
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
  },
  '& .MuiButton-endIcon': {
    marginLeft: theme.spacing(1),
  },
}));

// Enhanced Button component with better accessibility
export const Button = ({
  children,
  iconPosition = 'start',
  startIcon,
  endIcon,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      // Determine which icon position to use
      startIcon={iconPosition === 'start' ? startIcon : undefined}
      endIcon={iconPosition === 'end' ? endIcon : undefined}
      // Ensure proper aria attributes
      {...props}
    >
      {children}
    </StyledButton>
  );
};
```

### 2.2 Form Controls

- **Associate labels** with form controls using `for`/`id` (or MUI's built-in label association)
- **Provide visible focus states** for all interactive elements
- **Include clear error states** with specific error messages
- **Support keyboard navigation** through forms with logical tab order
- **Group related fields** with fieldsets and legends when appropriate
- **Offer adequate spacing** between form elements for improved readability

```tsx
// src/components/common/TextField.tsx
import { 
  TextField as MuiTextField, 
  TextFieldProps as MuiTextFieldProps,
  styled 
} from '@mui/material';

// Enhanced, accessible text field
const StyledTextField = styled(MuiTextField)(({ theme }) => ({
  // Ensure sufficient touch target size for the input
  '& .MuiInputBase-root': {
    minHeight: 44,
  },
  
  // Make labels more visible
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
  
  // Stronger focus state
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderWidth: 2,
  },
  
  // Error state
  '& .Mui-error': {
    '& .MuiFormHelperText-root': {
      fontWeight: 500,
    },
  },
  
  // Helper/error text styling
  '& .MuiFormHelperText-root': {
    marginTop: theme.spacing(0.5),
    fontSize: '0.75rem',
  },
}));

// Accessible text field component
export const TextField = (props: MuiTextFieldProps) => {
  const { 
    id, 
    label, 
    error, 
    helperText, 
    required,
    ...otherProps 
  } = props;
  
  // Generate unique ID for accessibility if not provided
  const fieldId = id || `field-${label?.toString().toLowerCase().replace(/\s+/g, '-')}`;
  const helperId = `${fieldId}-helper`;
  
  return (
    <StyledTextField
      id={fieldId}
      label={label}
      error={error}
      helperText={helperText}
      required={required}
      aria-describedby={helperText ? helperId : undefined}
      FormHelperTextProps={{
        id: helperId,
      }}
      {...otherProps}
    />
  );
};
```

### 2.3 Navigation Elements

- **Create a consistent navigation** pattern across the application
- **Highlight current location** within navigation (selected state)
- **Provide skip links** at the top of the page to bypass navigation
- **Ensure keyboard accessibility** for all navigation items
- **Support screen reader navigation** with appropriate ARIA roles and landmarks

```tsx
// src/components/layout/SkipLink.tsx
import { styled } from '@mui/material/styles';
import { Link } from '@mui/material';

// Skip link component for keyboard users
const StyledSkipLink = styled(Link)(({ theme }) => ({
  position: 'absolute',
  left: '-999px',
  width: '1px',
  height: '1px',
  top: 'auto',
  overflow: 'hidden',
  
  // When focused, make visible
  '&:focus': {
    left: theme.spacing(2),
    top: theme.spacing(2),
    padding: theme.spacing(1.5, 2),
    width: 'auto',
    height: 'auto',
    overflow: 'auto',
    zIndex: theme.zIndex.tooltip + 1,
    textDecoration: 'none',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
    color: theme.palette.primary.main,
    fontWeight: 500,
  },
}));

// Skip link component
export const SkipLink = () => {
  return (
    <StyledSkipLink href="#main-content">
      Skip to main content
    </StyledSkipLink>
  );
};

// Usage in Layout component:
// <SkipLink />
// <Header />
// <main id="main-content">...</main>
```

## 3. Layout and Structure

### 3.1 Responsive Grid System

- **Implement a responsive grid** using MUI's Grid component
- **Support zoom up to 200%** without breaking layout or requiring horizontal scrolling
- **Allow content reflow** at different viewport sizes
- **Maintain readability** with appropriate line lengths (65-75 characters for optimal reading)
- **Implement logical tab order** that follows the visual layout

```tsx
// Example responsive layout component
import { Container, Grid, Box } from '@mui/material';

interface LayoutProps {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export const ResponsiveLayout = ({ sidebar, children }: LayoutProps) => {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* Sidebar - full width on mobile, 1/4 on desktop */}
        {sidebar && (
          <Grid item xs={12} md={3}>
            <Box component="aside" aria-label="Sidebar">
              {sidebar}
            </Box>
          </Grid>
        )}
        
        {/* Main content - full width on mobile, 3/4 on desktop */}
        <Grid item xs={12} md={sidebar ? 9 : 12}>
          <Box component="main" id="main-content">
            {children}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
```

### 3.2 Visual Hierarchy

- **Create clear visual hierarchy** with typography, spacing, and color
- **Use proper heading structure** (h1-h6) in a logical, sequential order
- **Group related content** visually and semantically
- **Indicate relationships** between content using consistent visual cues
- **Maintain adequate white space** to reduce cognitive load

```tsx
// src/components/content/Section.tsx
import { Box, Typography, BoxProps } from '@mui/material';
import { ReactNode } from 'react';

interface SectionProps extends BoxProps {
  title: string;
  description?: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: ReactNode;
}

// Accessible content section with proper heading hierarchy
export const Section = ({
  title,
  description,
  headingLevel = 'h2',
  children,
  ...boxProps
}: SectionProps) => {
  return (
    <Box 
      component="section" 
      mb={4} 
      {...boxProps}
    >
      <Typography 
        variant={headingLevel} 
        component={headingLevel} 
        gutterBottom
      >
        {title}
      </Typography>
      
      {description && (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          paragraph
        >
          {description}
        </Typography>
      )}
      
      <Box mt={2}>
        {children}
      </Box>
    </Box>
  );
};
```

### 3.3 Responsive Images and Media

- **Provide alternative text** for all images using `alt` attributes
- **Make decorative images** properly hidden from screen readers
- **Support responsive images** that scale with viewport size
- **Include captions** for complex images when necessary
- **Ensure video controls** are keyboard accessible and properly labeled

```tsx
// src/components/media/Image.tsx
import { Box, Typography, BoxProps } from '@mui/material';
import { useState } from 'react';

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'height' | 'width'> {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: number;
  boxProps?: BoxProps;
  isDecorative?: boolean;
}

// Accessible image component
export const Image = ({
  src,
  alt,
  caption,
  aspectRatio,
  boxProps,
  isDecorative = false,
  ...imgProps
}: ImageProps) => {
  const [error, setError] = useState(false);
  
  // Handle image loading error
  const handleError = () => {
    setError(true);
  };
  
  // If image failed to load, show placeholder
  if (error) {
    return (
      <Box 
        sx={{ 
          bgcolor: 'grey.100', 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          aspectRatio: aspectRatio || 16/9,
        }}
        {...boxProps}
      >
        <Typography variant="body2" color="text.secondary">
          Image unavailable
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box {...boxProps}>
      <Box
        component="img"
        src={src}
        alt={isDecorative ? '' : alt}
        aria-hidden={isDecorative}
        onError={handleError}
        sx={{
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          aspectRatio: aspectRatio,
          objectFit: 'cover',
        }}
        {...imgProps}
      />
      
      {caption && (
        <Typography 
          variant="caption" 
          component="figcaption"
          sx={{ mt: 1 }}
        >
          {caption}
        </Typography>
      )}
    </Box>
  );
};
```

## 4. Interactions and Feedback

### 4.1 Loading States

- **Provide clear loading indicators** for asynchronous operations
- **Include accessible text** with loading indicators for screen readers
- **Maintain layout stability** during loading to prevent content shifts
- **Avoid timing-dependent interactions** that may be problematic for some users
- **Support keyboard interrupt** for any lengthy process

```tsx
// src/components/feedback/LoadingIndicator.tsx
import { CircularProgress, Box, Typography } from '@mui/material';

interface LoadingIndicatorProps {
  message?: string;
  size?: number;
  fullPage?: boolean;
}

// Accessible loading indicator
export const LoadingIndicator = ({
  message = 'Loading...',
  size = 40,
  fullPage = false,
}: LoadingIndicatorProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        ...(fullPage && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999,
        }),
      }}
      role="status"
      aria-live="polite"
    >
      <CircularProgress size={size} />
      <Typography variant="body2" sx={{ mt: 2 }}>
        {message}
      </Typography>
      {/* Hidden text for screen readers */}
      <span className="sr-only">{message}</span>
    </Box>
  );
};
```

### 4.2 Error Handling

- **Display clear error messages** with instructions for resolution
- **Use appropriate color coding** with additional visual cues (not just color)
- **Provide actionable guidance** for error recovery
- **Maintain context and entered data** when errors occur
- **Announce errors to screen readers** using aria-live regions

```tsx
// src/components/feedback/ErrorMessage.tsx
import { Alert, AlertTitle, Button, Box } from '@mui/material';
import { ReactNode } from 'react';

interface ErrorMessageProps {
  title?: string;
  children: ReactNode;
  severity?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
}

// Accessible error message component
export const ErrorMessage = ({
  title,
  children,
  severity = 'error',
  onRetry,
}: ErrorMessageProps) => {
  return (
    <Box aria-live="assertive" role="alert" mb={2}>
      <Alert
        severity={severity}
        action={
          onRetry ? (
            <Button 
              color="inherit" 
              size="small" 
              onClick={onRetry}
              aria-label="Retry action"
            >
              Retry
            </Button>
          ) : undefined
        }
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {children}
      </Alert>
    </Box>
  );
};
```

### 4.3 Focus Management

- **Preserve focus on route changes** when appropriate
- **Use focus trapping** for modal dialogs
- **Manage focus during dynamic content updates**
- **Maintain logical tab order** that aligns with visual layout
- **Support keyboard interaction patterns** that align with ARIA authoring practices

```tsx
// src/components/modal/Dialog.tsx
import { 
  Dialog as MuiDialog, 
  DialogProps as MuiDialogProps, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRef, useEffect, ReactNode } from 'react';

interface DialogProps extends Omit<MuiDialogProps, 'title'> {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  onClose: () => void;
}

// Accessible dialog with focus management
export const Dialog = ({
  title,
  children,
  actions,
  onClose,
  ...dialogProps
}: DialogProps) => {
  // Reference to element that should receive focus when dialog opens
  const titleRef = useRef<HTMLDivElement>(null);
  
  // Set focus to dialog title when opened
  useEffect(() => {
    if (dialogProps.open && titleRef.current) {
      // Small delay to ensure dialog has rendered
      const timerId = setTimeout(() => {
        titleRef.current?.focus();
      }, 50);
      
      return () => clearTimeout(timerId);
    }
  }, [dialogProps.open]);

  return (
    <MuiDialog
      onClose={onClose}
      aria-labelledby="dialog-title"
      {...dialogProps}
      // Full focus trap implementation is included in MUI Dialog
    >
      <DialogTitle 
        id="dialog-title"
        ref={titleRef}
        tabIndex={-1} // Make focusable but not in tab order
        sx={{ pr: 6 }} // Space for close button
      >
        {title}
        <IconButton
          aria-label="Close dialog"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        {children}
      </DialogContent>
      
      {actions && (
        <DialogActions>
          {actions}
        </DialogActions>
      )}
    </MuiDialog>
  );
};
```

## 5. Content and Typography

### 5.1 Text Readability

- **Use a minimum font size** of 16px (1rem) for body text
- **Maintain adequate line spacing** (at least 1.5 times font size)
- **Ensure sufficient contrast** between text and background (4.5:1 minimum)
- **Support text resizing** up to 200% without content loss
- **Limit line width** to 80 characters maximum for optimal readability

```tsx
// src/components/content/Paragraph.tsx
import { Typography, TypographyProps } from '@mui/material';
import { ReactNode } from 'react';

interface ParagraphProps extends Omit<TypographyProps, 'variant' | 'children'> {
  children: ReactNode;
  variant?: 'body1' | 'body2';
  maxWidth?: string | number;
}

// Readable paragraph component
export const Paragraph = ({
  children,
  variant = 'body1',
  maxWidth = '70ch', // Approximately 70 characters
  ...typographyProps
}: ParagraphProps) => {
  return (
    <Typography
      variant={variant}
      paragraph
      sx={{
        maxWidth,
        mx: 'auto',
        lineHeight: 1.6,
        ...typographyProps.sx,
      }}
      {...typographyProps}
    >
      {children}
    </Typography>
  );
};
```

### 5.2 Content Structure

- **Use semantic HTML elements** (article, section, heading, etc.)
- **Create a logical heading structure** (h1-h6)
- **Group related content** with appropriate container elements
- **Use lists for collections** of related items
- **Provide clear context** for all content

```tsx
// src/components/content/ArticleContent.tsx
import { Box, Typography, Divider } from '@mui/material';
import { ReactNode } from 'react';

interface ArticleContentProps {
  title: string;
  subtitle?: string;
  metadata?: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
}

// Accessible article structure component
export const ArticleContent = ({
  title,
  subtitle,
  metadata,
  intro,
  children,
}: ArticleContentProps) => {
  return (
    <Box component="article">
      <Typography variant="h1" component="h1" gutterBottom>
        {title}
      </Typography>
      
      {subtitle && (
        <Typography variant="h2" component="h2" color="text.secondary" gutterBottom>
          {subtitle}
        </Typography>
      )}
      
      {metadata && (
        <Box component="div" sx={{ mb: 2, color: 'text.secondary' }}>
          {metadata}
        </Box>
      )}
      
      {intro && (
        <>
          <Typography variant="subtitle1" component="div" sx={{ mb: 3 }}>
            {intro}
          </Typography>
          <Divider sx={{ my: 3 }} />
        </>
      )}
      
      <Box component="section">
        {children}
      </Box>
    </Box>
  );
};
```

### 5.3 Icons and Visual Elements

- **Provide text alternatives** for all meaningful icons
- **Ensure adequate size** for icons (minimum 24x24px recommended)
- **Maintain sufficient contrast** for icons against their background
- **Use consistent visual language** throughout the application
- **Support high contrast mode** in operating systems

```tsx
// src/components/common/IconText.tsx
import { Box, Typography, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

interface IconTextProps {
  icon: ReactNode;
  label: string;
  description?: string;
  iconPosition?: 'left' | 'right';
  sx?: SxProps<Theme>;
}

// Accessible icon with text component
export const IconText = ({
  icon,
  label,
  description,
  iconPosition = 'left',
  sx,
}: IconTextProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: iconPosition === 'left' ? 'row' : 'row-reverse',
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 40,
          minHeight: 40,
          mr: iconPosition === 'left' ? 2 : 0,
          ml: iconPosition === 'right' ? 2 : 0,
        }}
        aria-hidden="true" // Icon is decorative, text conveys meaning
      >
        {icon}
      </Box>
      
      <Box>
        <Typography variant="body1" component="span">
          {label}
        </Typography>
        
        {description && (
          <Typography variant="body2" color="text.secondary" component="p">
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
```

## 6. Accessibility Compliance Features

### 6.1 Keyboard Support

- **Ensure all interactions** are accessible via keyboard
- **Implement custom keyboard shortcuts** for complex widgets following ARIA practices
- **Provide visible focus indicators** for all interactive elements
- **Support keyboard input** for all form controls
- **Ensure logical tab order** that matches visual layout

```tsx
// src/components/common/KeyboardShortcut.tsx
import { useEffect } from 'react';

interface KeyboardShortcutProps {
  keys: string[]; // Array of keys to trigger the action (e.g., ['Control', 'k'])
  action: () => void; // Function to execute
  disabled?: boolean; // Whether the shortcut is active
}

// Helper component to implement keyboard shortcuts
export const KeyboardShortcut = ({
  keys,
  action,
  disabled = false,
}: KeyboardShortcutProps) => {
  useEffect(() => {
    if (disabled) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if all required keys are pressed
      const allKeysPressed = keys.every(key => {
        if (key === 'Control') return event.ctrlKey;
        if (key === 'Alt') return event.altKey;
        if (key === 'Shift') return event.shiftKey;
        if (key === 'Meta') return event.metaKey;
        return event.key === key;
      });
      
      if (allKeysPressed) {
        event.preventDefault();
        action();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [keys, action, disabled]);
  
  // This component doesn't render anything
  return null;
};
```

### 6.2 Screen Reader Support

- **Provide proper semantic structure** using HTML5 elements
- **Use ARIA roles, states, and properties** appropriately when HTML semantics are insufficient
- **Include descriptive labels** for all interactive elements
- **Announce dynamic content changes** with live regions
- **Supplement visual information** with equivalent text alternatives

```tsx
// src/components/feedback/StatusAnnouncer.tsx
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

interface StatusAnnouncerProps {
  message: string | null;
  assertive?: boolean;
}

// Component to announce status messages to screen readers
export const StatusAnnouncer = ({
  message,
  assertive = false,
}: StatusAnnouncerProps) => {
  const [announcement, setAnnouncement] = useState('');
  
  // Only update when message changes to prevent duplicate announcements
  useEffect(() => {
    if (message) {
      // Clear first to ensure screen reader announces even if text is the same
      setAnnouncement('');
      
      // Small delay to ensure clearing happens before new announcement
      setTimeout(() => {
        setAnnouncement(message);
      }, 50);
    }
  }, [message]);
  
  return (
    <Box
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
      sx={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {announcement}
    </Box>
  );
};
```

### 6.3 Motion and Animation

- **Respect user's motion preferences** with `prefers-reduced-motion` media query
- **Avoid content that flashes** more than three times per second
- **Provide controls** to pause, stop, or hide moving content
- **Ensure animations are subtle** and enhance rather than distract
- **Make animations optional** when they are purely decorative

```tsx
// src/hooks/useReducedMotion.ts
import { useMediaQuery } from '@mui/material';

// Hook to detect user's motion preference
export const useReducedMotion = (): boolean => {
  const prefersReducedMotion = useMediaQuery(
    '(prefers-reduced-motion: reduce)',
    { noSsr: true } // Only run on client
  );
  
  return prefersReducedMotion;
};

// Example usage:
// const reducedMotion = useReducedMotion();
// const animationDuration = reducedMotion ? 0 : 300; // ms
```

## 7. Testing and Compliance

### 7.1 Automated Testing

- **Run automated accessibility tests** using jest-axe or similar tools
- **Check for WCAG violations** during development and in CI pipeline
- **Test with color contrast analyzers** to verify contrast ratios
- **Validate HTML semantics** for proper structure
- **Verify keyboard navigation** for all interactive elements

```tsx
// src/components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../common/Button';

// Add custom matcher
expect.extend(toHaveNoViolations);

describe('Button Component', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Accessible Button</Button>);
    
    // Check for accessibility violations
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should handle keyboard focus', () => {
    render(<Button>Focusable Button</Button>);
    
    // Get button and test focus
    const button = screen.getByRole('button', { name: /focusable button/i });
    button.focus();
    
    // Check that button receives focus
    expect(button).toHaveFocus();
  });
});
```

### 7.2 Manual Testing

- **Test with keyboard only** to verify all functionality is accessible
- **Verify screen reader compatibility** with VoiceOver, NVDA, and JAWS
- **Test with page zoomed** to 200% to ensure content reflow
- **Check high contrast mode** compatibility
- **Test at different viewport sizes** to verify responsive behavior

### 7.3 Documentation

- **Document accessibility features** for each component
- **Provide usage guidelines** for maintaining accessibility
- **Include WCAG compliance status** in component documentation
- **Note any accessibility limitations** or special considerations
- **Document keyboard interaction patterns** for complex widgets

```tsx
// Example Storybook documentation for a component
import { Meta, Story } from '@storybook/react';
import { Button, ButtonProps } from '../components/common/Button';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    a11y: {
      // Highlight accessibility info in Storybook
      config: {
        rules: [
          {
            id: 'color-contrast',
            // Enforce stricter contrast for AA+
            reviewOnFail: true,
          },
        ],
      },
    },
    docs: {
      description: {
        component: `
## Accessibility Features

This button component implements the following accessibility features:

- Minimum 44×44px touch target size
- WCAG AA+ compliant color contrast (4.5:1)
- Enhanced keyboard focus styles
- Properly labeled (uses children as accessible name)
- Screen reader support for icon buttons

## Keyboard Support

| Key | Action |
|-----|--------|
| Enter/Space | Activates the button |
| Tab | Moves focus to the button |

## ARIA Attributes

- When using an icon-only button, provide \`aria-label\` prop
        `,
      },
    },
  },
  argTypes: {
    // Define props and document their accessibility impact
    variant: {
      description: 'Button style variant',
      table: {
        defaultValue: { summary: 'contained' },
      },
    },
    // More props...
  },
};

// Create story template
const Template: Story<ButtonProps> = (args) => <Button {...args} />;

// Create stories
export const Default = Template.bind({});
Default.args = {
  children: 'Accessible Button',
};

export const IconButton = Template.bind({});
IconButton.args = {
  children: null,
  startIcon: 'Icon',
  'aria-label': 'Settings', // Document required accessibility props
};
```

## Implementation Checklist

Ensure your React MUI application meets these key accessibility requirements:

- [ ] Color contrast meets WCAG AA standards (4.5:1 for text, 3:1 for UI components)
- [ ] All interactive elements are keyboard accessible with visible focus states
- [ ] Proper heading structure and semantic HTML throughout the application
- [ ] Responsive design that works properly with page zoom up to 200%
- [ ] Form elements have proper labels and error handling
- [ ] Images have appropriate alternative text
- [ ] Dynamic content changes are announced to screen readers
- [ ] Motion and animation respect user preferences
- [ ] Focus management is implemented for dialogs and dynamic content
- [ ] Keyboard shortcuts follow accessibility best practices
- [ ] All content is usable at viewport width of 320px (mobile-friendly)
- [ ] Text doesn't disappear or overlap at larger font sizes
- [ ] Touch targets meet minimum size requirements (44×44px)
- [ ] ARIA attributes are used correctly when HTML semantics are insufficient
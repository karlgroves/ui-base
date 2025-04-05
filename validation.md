# Client-Side Validation

This document describes the client-side validation requirements for React applications using Material-UI and ensuring WCAG conformance.

## Validation Strategy

Client-side validation serves multiple purposes:

1. Improve user experience by providing immediate feedback
2. Reduce server load by preventing invalid requests
3. Ensure accessibility by providing clear error messages
4. Support internationalization by using configurable validation messages
5. Maintain security by validating all inputs

## Form Validation Architecture

### Validation Libraries

Use a schema-based validation library to define validation rules. The recommended options are:

1. **Yup with Formik**: A comprehensive validation library with excellent TypeScript support
2. **Zod with React Hook Form**: A TypeScript-first schema validation library with strong type inference

### Implementation Pattern

```tsx
// src/validation/schemas/userSchema.ts
import * as Yup from 'yup';

export const userValidationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email address format')
    .max(255, 'Email must be at most 255 characters'),
  
  password: Yup.string()
    .when('isNewUser', {
      is: true,
      then: (schema) => schema
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
      otherwise: (schema) => schema
    }),
  
  passwordConfirmation: Yup.string()
    .when('password', {
      is: (val: string) => val && val.length > 0,
      then: (schema) => schema
        .required('Password confirmation is required')
        .oneOf([Yup.ref('password')], 'Passwords must match')
    }),
  
  role: Yup.string()
    .required('Role is required')
    .oneOf(['user', 'admin', 'editor'], 'Invalid role selected'),
  
  agreeToTerms: Yup.boolean()
    .required('You must agree to the terms and conditions')
    .oneOf([true], 'You must agree to the terms and conditions')
});

// Export TypeScript type derived from the schema
export type UserFormValues = Yup.InferType<typeof userValidationSchema>;
```

## Validation Components with Material-UI

### TextField with Validation

```tsx
// src/components/common/FormTextField.tsx
import { TextField, TextFieldProps } from '@mui/material';
import { useField } from 'formik';
import { memo } from 'react';

interface FormTextFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  label: string;
  helperText?: string;
}

export const FormTextField = memo(({ 
  name, 
  label, 
  helperText,
  required,
  ...rest 
}: FormTextFieldProps) => {
  const [field, meta] = useField(name);
  const errorText = meta.touched && meta.error ? meta.error : '';
  const hasError = Boolean(errorText);
  
  // Generate a unique ID for accessibility
  const id = `field-${name}`;
  const errorId = hasError ? `${id}-error` : undefined;
  
  return (
    <TextField
      {...field}
      {...rest}
      id={id}
      label={label}
      variant="outlined"
      fullWidth
      required={required}
      error={hasError}
      helperText={errorText || helperText}
      aria-describedby={errorId}
      aria-invalid={hasError}
      aria-required={required}
      FormHelperTextProps={{
        ...(hasError && { id: errorId }),
      }}
    />
  );
});
```

### Select with Validation

```tsx
// src/components/common/FormSelect.tsx
import { 
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps 
} from '@mui/material';
import { useField } from 'formik';
import { memo } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface FormSelectProps extends Omit<SelectProps, 'name'> {
  name: string;
  label: string;
  options: Option[];
  helperText?: string;
}

export const FormSelect = memo(({
  name,
  label,
  options,
  helperText,
  required,
  ...rest
}: FormSelectProps) => {
  const [field, meta] = useField(name);
  const errorText = meta.touched && meta.error ? meta.error : '';
  const hasError = Boolean(errorText);
  
  // Generate a unique ID for accessibility
  const id = `select-${name}`;
  const labelId = `${id}-label`;
  const errorId = hasError ? `${id}-error` : undefined;
  const helperId = helperText ? `${id}-helper` : undefined;
  
  return (
    <FormControl 
      fullWidth 
      error={hasError} 
      required={required}
      variant="outlined"
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        {...field}
        {...rest}
        id={id}
        labelId={labelId}
        label={label}
        aria-describedby={
          errorId 
            ? errorId 
            : helperId 
              ? helperId 
              : undefined
        }
        aria-invalid={hasError}
        aria-required={required}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {(hasError || helperText) && (
        <FormHelperText id={hasError ? errorId : helperId}>
          {errorText || helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
});
```

### Checkbox with Validation

```tsx
// src/components/common/FormCheckbox.tsx
import { 
  Checkbox, 
  CheckboxProps, 
  FormControl, 
  FormControlLabel, 
  FormHelperText 
} from '@mui/material';
import { useField } from 'formik';
import { memo } from 'react';

interface FormCheckboxProps extends Omit<CheckboxProps, 'name'> {
  name: string;
  label: string;
  helperText?: string;
}

export const FormCheckbox = memo(({
  name,
  label,
  helperText,
  required,
  ...rest
}: FormCheckboxProps) => {
  const [field, meta] = useField({ name, type: 'checkbox' });
  const errorText = meta.touched && meta.error ? meta.error : '';
  const hasError = Boolean(errorText);
  
  // Generate a unique ID for accessibility
  const id = `checkbox-${name}`;
  const errorId = hasError ? `${id}-error` : undefined;
  
  return (
    <FormControl required={required} error={hasError}>
      <FormControlLabel
        control={
          <Checkbox
            {...field}
            {...rest}
            id={id}
            checked={field.value}
            aria-describedby={errorId}
            aria-invalid={hasError}
            aria-required={required}
          />
        }
        label={label}
      />
      {(hasError || helperText) && (
        <FormHelperText id={errorId}>
          {errorText || helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
});
```

## Complete Form Example with Accessibility

```tsx
// src/components/UserForm.tsx
import { useEffect, useRef } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { 
  Button, 
  Grid, 
  Typography, 
  Paper, 
  Box, 
  CircularProgress,
  Alert,
  AlertTitle,
  Stack,
  Divider
} from '@mui/material';
import { FormTextField } from '../common/FormTextField';
import { FormSelect } from '../common/FormSelect';
import { FormCheckbox } from '../common/FormCheckbox';
import { userValidationSchema, UserFormValues } from '../../validation/schemas/userSchema';
import { useMutation } from 'react-query';
import { createUser } from '../../services/userService';
import { useErrorHandler } from '../../hooks/useErrorHandler';

interface UserFormProps {
  onSuccess?: () => void;
}

const initialValues: UserFormValues = {
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  role: 'user',
  agreeToTerms: false,
  isNewUser: true
};

export const UserForm: React.FC<UserFormProps> = ({ onSuccess }) => {
  const formRef = useRef<HTMLDivElement>(null);
  const firstErrorRef = useRef<HTMLElement | null>(null);
  const submittedOnce = useRef(false);
  
  const { handleError, getFieldErrors, isValidationError } = useErrorHandler();
  
  const { mutate, isLoading, isError, error, isSuccess } = useMutation(
    createUser,
    {
      onSuccess: () => {
        // Call onSuccess callback if provided
        onSuccess?.();
      },
      onError: (error) => {
        handleError(error);
      }
    }
  );
  
  // For screen readers to announce the result
  useEffect(() => {
    if (isSuccess || isError) {
      // Focus the form container to trigger screen reader announcement
      formRef.current?.focus();
    }
  }, [isSuccess, isError]);
  
  const handleSubmit = async (
    values: UserFormValues,
    { setSubmitting, setErrors, setTouched }: FormikHelpers<UserFormValues>
  ) => {
    try {
      submittedOnce.current = true;
      await mutate(values);
    } catch (error) {
      // Handle server validation errors
      if (isValidationError(error)) {
        const fieldErrors = getFieldErrors(error);
        setErrors(fieldErrors as any);
        
        // Mark fields with errors as touched
        const touchedFields: Record<string, boolean> = {};
        Object.keys(fieldErrors).forEach(field => {
          touchedFields[field] = true;
        });
        setTouched(touchedFields);
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  // Focus the first field with an error after submission
  const focusFirstError = (errors: Record<string, string>) => {
    if (submittedOnce.current && Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(`field-${firstErrorField}`);
      
      if (element && element !== firstErrorRef.current) {
        firstErrorRef.current = element;
        element.focus();
        
        // Announce to screen readers
        const statusElement = document.getElementById('form-status');
        if (statusElement) {
          statusElement.textContent = `Form has ${Object.keys(errors).length} error${
            Object.keys(errors).length > 1 ? 's' : ''
          }. Please correct them and resubmit.`;
        }
      }
    }
  };
  
  const roleOptions = [
    { value: 'user', label: 'Regular User' },
    { value: 'editor', label: 'Editor' },
    { value: 'admin', label: 'Administrator' }
  ];
  
  return (
    <Paper>
      <Box 
        p={3} 
        ref={formRef}
        tabIndex={-1}
        aria-live="polite"
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Create New User
        </Typography>
        
        {isSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <AlertTitle>Success</AlertTitle>
            User created successfully!
          </Alert>
        )}
        
        {isError && !isValidationError(error) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            Failed to create user. Please try again.
          </Alert>
        )}
        
        {/* Hidden status for screen readers */}
        <div 
          id="form-status" 
          className="sr-only" 
          aria-live="assertive" 
          aria-atomic="true"
        ></div>
        
        <Formik
          initialValues={initialValues}
          validationSchema={userValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, dirty, isValid }) => {
            // Focus first error when form is submitted
            useEffect(() => {
              if (submittedOnce.current) {
                focusFirstError(errors as Record<string, string>);
              }
            }, [errors, touched]);
            
            return (
              <Form noValidate>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormTextField
                      name="name"
                      label="Full Name"
                      required
                      autoFocus
                      helperText="Enter your first and last name"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormTextField
                      name="email"
                      label="Email Address"
                      type="email"
                      required
                      autoComplete="email"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormTextField
                      name="password"
                      label="Password"
                      type="password"
                      required
                      autoComplete="new-password"
                      helperText="Must be at least 8 characters and include uppercase, lowercase, number, and special character"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormTextField
                      name="passwordConfirmation"
                      label="Confirm Password"
                      type="password"
                      required
                      autoComplete="new-password"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormSelect
                      name="role"
                      label="User Role"
                      options={roleOptions}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormCheckbox
                      name="agreeToTerms"
                      label="I agree to the terms and conditions"
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ mb: 2 }} />
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button type="reset" variant="outlined">
                        Reset
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting || (!dirty || !isValid)}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                      >
                        {isSubmitting ? 'Creating...' : 'Create User'}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Paper>
  );
};
```

## Real-Time Validation

For better user experience, implement real-time validation for:

1. Password strength indicators
2. Email format checking
3. Username availability checking

### Password Strength Indicator

```tsx
// src/components/common/PasswordStrengthIndicator.tsx
import { useState, useEffect } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { useField } from 'formik';

interface PasswordStrengthIndicatorProps {
  name: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ name }) => {
  const [field] = useField(name);
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  useEffect(() => {
    const calculateStrength = (password: string): [number, string] => {
      if (!password) return [0, ''];
      
      let score = 0;
      let message = '';
      
      // Length check
      if (password.length >= 8) score += 20;
      
      // Complexity checks
      if (/[A-Z]/.test(password)) score += 20; // Uppercase
      if (/[a-z]/.test(password)) score += 20; // Lowercase
      if (/[0-9]/.test(password)) score += 20; // Numbers
      if (/[^A-Za-z0-9]/.test(password)) score += 20; // Special chars
      
      // Feedback message
      if (score < 20) {
        message = 'Very weak';
      } else if (score < 40) {
        message = 'Weak';
      } else if (score < 60) {
        message = 'Fair';
      } else if (score < 80) {
        message = 'Good';
      } else {
        message = 'Strong';
      }
      
      return [score, message];
    };
    
    const [newStrength, newFeedback] = calculateStrength(field.value);
    setStrength(newStrength);
    setFeedback(newFeedback);
  }, [field.value]);
  
  // Don't show indicator for empty passwords
  if (!field.value) return null;
  
  // Determine color based on strength
  const getColor = () => {
    if (strength < 40) return 'error';
    if (strength < 70) return 'warning';
    return 'success';
  };
  
  return (
    <Box mt={1}>
      <LinearProgress
        variant="determinate"
        value={strength}
        color={getColor()}
        sx={{ height: 8, borderRadius: 4 }}
        aria-label="Password strength indicator"
        aria-valuetext={`Password strength: ${feedback}`}
      />
      <Typography 
        variant="caption" 
        color="textSecondary"
        sx={{ display: 'block', mt: 0.5 }}
      >
        Password strength: {feedback}
      </Typography>
    </Box>
  );
};
```

## Field-Specific Validation Requirements

### Text Fields

- Enforce meaningful minimum and maximum lengths
- Strip leading/trailing whitespace
- Check for malicious content patterns
- Apply consistent formatting (capitalization, etc.)

### Email Fields

- Validate format using a comprehensive regex pattern or email-validator library
- Check for common typos in domain names (e.g., "gmail.con" vs "gmail.com")
- Normalize before submission (lowercase, remove spaces)

### Password Fields

- Enforce minimum strength requirements
- Visually indicate password strength
- Check against common password lists
- Support showing/hiding password content

### Phone Numbers

- Support international formats with country code selection
- Format as user types with proper spacing/parentheses
- Enable copy/paste of formatted numbers

### Dates

- Use date pickers with keyboard navigation
- Support multiple input formats (MM/DD/YYYY, DD/MM/YYYY)
- Validate against logical constraints (birth date in past, etc.)

### Currency/Numeric Fields

- Localize number formatting (commas, decimal points)
- Support currency symbols
- Enforce min/max value constraints
- Allow only valid numeric input

## Validation UX Best Practices

1. **Show validation as users type, but delay error messages** until:
   - The user has finished typing (debounce)
   - The field loses focus (blur event)
   - The form is submitted

2. **Clear error messages** as soon as the user starts fixing the issue

3. **Validate related fields together** (e.g., password and confirmation)

4. **Use positive validation** to confirm correct input:
   ```tsx
   // In your form component
   <FormControl>
     <FormTextField 
       name="email" 
       label="Email"
       InputProps={{
         endAdornment: isEmailValid ? (
           <CheckCircleIcon color="success" fontSize="small" />
         ) : null
       }}
     />
   </FormControl>
   ```

5. **Group related validation messages** instead of showing multiple errors for one field

## Accessibility Requirements

To ensure WCAG compliance for form validation:

1. **Error identification** (WCAG 3.3.1):
   - Clearly identify form errors
   - Use `aria-invalid="true"` on fields with errors
   - Link error messages to input fields with `aria-describedby`

2. **Error suggestion** (WCAG 3.3.3):
   - Provide clear suggestions for fixing errors
   - Use specific, actionable error messages

3. **Error prevention** (WCAG 3.3.4):
   - Allow users to review and correct information before submission
   - Implement confirmation for important actions

4. **Status messages** (WCAG 4.1.3):
   - Use ARIA live regions to announce validation status changes
   - Make validation success/failure accessible to screen readers

5. **Focus management**:
   - Move focus to the first field with an error after submission
   - Ensure all form controls are keyboard accessible

## Server-Side Validation Integration

Even with client-side validation, always validate on the server. Handle server validation errors by:

1. Mapping server errors to form fields:
   ```tsx
   // Example error response handling
   interface ApiErrorResponse {
     error: {
       code: string;
       message: string;
       params?: Array<{
         param: string;
         message: string;
       }>;
     };
   }
   
   // In your form submission handler
   try {
     await submitForm(values);
   } catch (error) {
     if (axios.isAxiosError(error)) {
       const apiError = error as AxiosError<ApiErrorResponse>;
       
       if (apiError.response?.status === 400 && apiError.response.data.error.params) {
         // Map API validation errors to form fields
         const formErrors: Record<string, string> = {};
         
         apiError.response.data.error.params.forEach(param => {
           formErrors[param.param] = param.message;
         });
         
         // Set form errors
         formik.setErrors(formErrors);
       }
     }
   }
   ```

2. Focus the first field with an error
3. Display a summary of errors at the top of the form for accessibility

## Internationalization of Validation Messages

For multilingual applications:

1. Store validation messages in translation files:
   ```tsx
   // src/i18n/en/validation.ts
   export default {
     required: '{{field}} is required',
     email: 'Please enter a valid email address',
     minLength: '{{field}} must be at least {{min}} characters',
     maxLength: '{{field}} must be at most {{max}} characters',
     passwordMatch: 'Passwords must match',
     // ...
   };
   ```

2. Integrate with validation schemas:
   ```tsx
   // Using i18next with Yup
   import { useTranslation } from 'react-i18next';
   import * as Yup from 'yup';
   
   export const useUserValidationSchema = () => {
     const { t } = useTranslation();
     
     // Set Yup locale
     Yup.setLocale({
       mixed: {
         required: t('validation:required', { field: '${path}' }),
       },
       string: {
         email: t('validation:email'),
         min: t('validation:minLength', { field: '${path}', min: '${min}' }),
         max: t('validation:maxLength', { field: '${path}', max: '${max}' }),
       },
       // ...
     });
     
     return Yup.object({
       // Schema definition...
     });
   };
   ```

## Performance Considerations

1. **Debounce validation** for fields with expensive validation checks
2. **Validate conditionally** - only validate dependent fields when needed
3. **Lazy load validation schemas** for large forms
4. **Memoize form components** to prevent unnecessary re-renders

## Mobile-Specific Validation

For mobile users:

1. Use appropriate keyboard types (email, numeric, tel)
2. Show inline validation without hiding the keyboard
3. Ensure error messages are visible when a field is focused
4. Make touch targets large enough (44x44px minimum)

## Validation Testing

Comprehensive testing should include:

1. **Unit tests** for validation functions and schemas
2. **Component tests** for form fields with validation
3. **Integration tests** for complete forms
4. **Accessibility tests** with tools like Axe or WAVE
5. **Manual testing** with screen readers and keyboard navigation

Example test for validation schema:

```tsx
// src/validation/schemas/__tests__/userSchema.test.ts
import { userValidationSchema } from '../userSchema';

describe('User Validation Schema', () => {
  test('should validate a valid user', async () => {
    const validUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecureP@ss1',
      passwordConfirmation: 'SecureP@ss1',
      role: 'user',
      agreeToTerms: true,
      isNewUser: true
    };
    
    await expect(userValidationSchema.validate(validUser)).resolves.not.toThrow();
  });
  
  test('should require name', async () => {
    const invalidUser = {
      name: '',
      email: 'john@example.com',
      password: 'SecureP@ss1',
      passwordConfirmation: 'SecureP@ss1',
      role: 'user',
      agreeToTerms: true,
      isNewUser: true
    };
    
    await expect(userValidationSchema.validate(invalidUser))
      .rejects.toThrow('Name is required');
  });
  
  // More test cases...
});
```
# Client-Side API Operations and Responses

## API Integration Overview

This document outlines how the React client application should handle API operations and responses. The client-side code should follow these guidelines when interacting with RESTful APIs.

## HTTP Status Codes

The client application should be prepared to handle the following HTTP status codes from API responses:

* `200` is returned with status `OK` for successful `GET`, `PUT`, and `HEAD` operations
* `201` is returned with status `Created` for successful `POST` operations
* `202` is returned with status `Accepted` for long-running operations that will take longer than 500ms
* `204` is returned with status `No Content` for successful `DELETE` operations
* `400` is returned with status `Bad Request` for validation failures (missing/invalid parameters)
* `401` is returned with status `Unauthorized` for authentication/permission failures
* `402` is returned with status `Payment Required` when attempting operations that require a subscription
* `404` is returned with status `Not Found` when a resource doesn't exist
* `405` is returned with status `Method Not Allowed` for unsupported HTTP methods
* `422` is returned with status `Unprocessable Entity` when trying to create duplicate unique records
* `429` is returned with status `Too Many Requests` for rate limiting
* `500` is returned with status `Internal Server Error` for server-side issues

## Client-Side Response Handling

### Success Response Handling

#### GET Requests

```tsx
// Using React Query
const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>('/api/users');
  return response.data;
};

// In component
const { data: users, isLoading, error } = useQuery(['users'], fetchUsers, {
  onSuccess: (data) => {
    // Handle success, e.g., update UI or show notification
    toast.success('Users loaded successfully');
  }
});

// Render based on state
if (isLoading) {
  return <CircularProgress aria-label="Loading users" />;
}

if (error) {
  return <ErrorMessage error={error} />;
}

return (
  <UserList users={users} />
);
```

#### POST Requests

```tsx
// Using React Query
const createUser = async (newUser: UserInput): Promise<User> => {
  const response = await axios.post<User>('/api/users', newUser);
  return response.data;
};

// In component
const { mutate, isLoading } = useMutation(createUser, {
  onSuccess: (data) => {
    // Handle successful creation
    toast.success('User created successfully');
    // Invalidate queries to refetch data
    queryClient.invalidateQueries(['users']);
    // Navigate or update UI
    navigate('/users');
  },
  onError: (error) => {
    // Handle error
    handleApiError(error);
  }
});

// Usage in form submission
const handleSubmit = (values: UserInput) => {
  mutate(values);
};
```

#### PUT Requests

```tsx
// Using React Query
const updateUser = async ({ id, data }: { id: string, data: UserInput }): Promise<User> => {
  const response = await axios.put<User>(`/api/users/${id}`, data);
  return response.data;
};

// In component
const { mutate, isLoading } = useMutation(updateUser, {
  onSuccess: (data) => {
    toast.success('User updated successfully');
    queryClient.invalidateQueries(['users']);
    navigate('/users');
  },
  onError: (error) => {
    handleApiError(error);
  }
});
```

#### DELETE Requests

```tsx
// Using React Query
const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`/api/users/${id}`);
};

// In component
const { mutate, isLoading } = useMutation(deleteUser, {
  onSuccess: () => {
    toast.success('User deleted successfully');
    queryClient.invalidateQueries(['users']);
    navigate('/users');
  },
  onError: (error) => {
    handleApiError(error);
  }
});

// Usage with confirmation
const handleDelete = () => {
  // Show confirmation dialog
  setDialogOpen(true);
};

// In confirmation dialog
const confirmDelete = () => {
  mutate(userId);
  setDialogOpen(false);
};
```

### Error Response Handling

Create a centralized error handler to process API errors consistently:

```tsx
// src/utils/errorHandling.ts
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface ApiError {
  error: {
    code: string;
    message: string;
    params?: {
      param: string;
      message: string;
    }[];
  };
}

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    
    // Handle different status codes
    switch (axiosError.response?.status) {
      case 400:
        // Display validation errors
        const validationErrors = axiosError.response?.data.error.params;
        if (validationErrors?.length) {
          validationErrors.forEach(err => {
            toast.error(`${err.param}: ${err.message}`);
          });
        } else {
          toast.error(axiosError.response?.data.error.message || 'Invalid request');
        }
        break;
        
      case 401:
        toast.error('You need to log in to perform this action');
        // Redirect to login page
        window.location.href = '/login';
        break;
        
      case 403:
        toast.error('You do not have permission to perform this action');
        break;
        
      case 404:
        toast.error('The requested resource was not found');
        break;
        
      case 422:
        toast.error(axiosError.response?.data.error.message || 'Cannot process this request');
        break;
        
      case 429:
        toast.error('Too many requests. Please try again later');
        break;
        
      case 500:
        toast.error('An unexpected error occurred. Please try again later');
        // Log to monitoring service
        logErrorToMonitoring(axiosError);
        break;
        
      default:
        toast.error('An error occurred. Please try again');
        break;
    }
  } else {
    // Handle non-Axios errors
    toast.error('An unexpected error occurred');
    console.error(error);
  }
};

const logErrorToMonitoring = (error: AxiosError) => {
  // Integration with error monitoring service like Sentry
  // Sentry.captureException(error);
  console.error('Logging error to monitoring service:', error);
};
```

## Loading States and UI Feedback

Implement consistent loading and error states across the application:

```tsx
// src/components/common/LoadingState.tsx
import { CircularProgress, Box, Typography } from '@mui/material';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      p={3}
    >
      <CircularProgress aria-label={message} />
      <Typography variant="body2" mt={2}>
        {message}
      </Typography>
    </Box>
  );
};
```

```tsx
// src/components/common/ErrorMessage.tsx
import { Alert, AlertTitle, Button, Box } from '@mui/material';

interface ErrorMessageProps {
  error: unknown;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  onRetry 
}) => {
  let message = 'An unexpected error occurred';
  
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    message = axiosError.response?.data.error.message || message;
  } else if (error instanceof Error) {
    message = error.message;
  }
  
  return (
    <Box my={2}>
      <Alert 
        severity="error"
        action={
          onRetry ? (
            <Button 
              color="inherit" 
              size="small" 
              onClick={onRetry}
            >
              Retry
            </Button>
          ) : undefined
        }
      >
        <AlertTitle>Error</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
};
```

## Pagination and Filtering

Implement standardized pagination and filtering components:

```tsx
// src/components/common/Pagination.tsx
import { TablePagination } from '@mui/material';
import { useMemo } from 'react';

interface PaginationProps {
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalCount,
  page,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  // Calculate total pages
  const totalPages = useMemo(() => 
    Math.ceil(totalCount / limit), 
    [totalCount, limit]
  );

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onLimitChange(parseInt(event.target.value, 10));
    onPageChange(0); // Reset to first page
  };

  return (
    <TablePagination
      component="div"
      count={totalCount}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={limit}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[10, 25, 50, 100]}
      labelDisplayedRows={({ from, to, count }) => 
        `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
      }
      aria-label="Pagination controls"
    />
  );
};
```

## Request Cancellation

Implement request cancellation for components that might unmount before requests complete:

```tsx
// Using Axios with React Query
const fetchUserDetails = async (userId: string) => {
  const source = axios.CancelToken.source();
  
  const promise = axios.get<User>(`/api/users/${userId}`, {
    cancelToken: source.token
  })
  .then(response => response.data);
  
  // @ts-ignore - Adding cancel method to the promise
  promise.cancel = () => {
    source.cancel('Request canceled due to component unmount');
  };
  
  return promise;
};

// In component
const { data, isLoading, error } = useQuery(
  ['user', userId],
  () => fetchUserDetails(userId),
  {
    // Enable cancellation
    cancelRefetch: true,
    // Don't refetch on window focus for this query
    refetchOnWindowFocus: false
  }
);
```

## Accessibility Considerations

Ensure all API interaction components meet accessibility requirements:

1. Loading states must be announced to screen readers:
```tsx
<div aria-live="polite" aria-atomic="true">
  {isLoading && <span className="sr-only">Loading data, please wait.</span>}
</div>
```

2. Error messages must be properly announced:
```tsx
<div aria-live="assertive" aria-atomic="true">
  {error && <span>Error: {errorMessage}</span>}
</div>
```

3. Success confirmations should be announced:
```tsx
<div aria-live="polite" aria-atomic="true">
  {isSuccess && <span>User was successfully created.</span>}
</div>
```

4. Progress indicators should include proper ARIA roles:
```tsx
<CircularProgress 
  aria-label="Loading content" 
  role="progressbar" 
  aria-valuetext="Loading, please wait"
/>
```

## Form Submission Guidelines

Follow these guidelines for form submission:

1. Disable submit button during submission to prevent duplicate requests
2. Show loading feedback during submission
3. Validate inputs on the client side before sending to API
4. Display specific validation errors from API next to respective fields
5. Focus on the first field with an error after failed submission

```tsx
// Example form with proper error handling
const UserForm: React.FC<UserFormProps> = ({ onSubmit, initialData }) => {
  const formik = useFormik({
    initialValues: initialData || {
      name: '',
      email: '',
      role: 'user'
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      role: Yup.string().oneOf(['user', 'admin'], 'Invalid role')
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await onSubmit(values);
        // Success is handled by parent component
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ApiError>;
          
          // Map API validation errors to form fields
          if (axiosError.response?.status === 400 && axiosError.response.data.error.params) {
            const apiErrors = axiosError.response.data.error.params;
            const formikErrors: { [key: string]: string } = {};
            
            apiErrors.forEach(err => {
              formikErrors[err.param] = err.message;
            });
            
            setErrors(formikErrors);
          } else {
            // General error handling
            toast.error(axiosError.response?.data.error.message || 'Form submission failed');
          }
        } else {
          toast.error('An unexpected error occurred');
        }
      } finally {
        setSubmitting(false);
      }
    }
  });
  
  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <TextField
        id="name"
        name="name"
        label="Name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
        fullWidth
        margin="normal"
        required
        inputProps={{
          'aria-required': 'true',
          'aria-invalid': formik.touched.name && Boolean(formik.errors.name),
          'aria-describedby': formik.errors.name ? 'name-error' : undefined
        }}
      />
      
      {formik.errors.name && (
        <div id="name-error" className="sr-only">
          {formik.errors.name}
        </div>
      )}
      
      {/* Additional fields similarly structured */}
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={formik.isSubmitting}
        startIcon={formik.isSubmitting ? <CircularProgress size={20} /> : null}
      >
        {formik.isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
};
```

## API Client Configuration

Create a centralized API client configuration:

```tsx
// src/services/api.ts
import axios from 'axios';

// Create axios instance
export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Add accepted language from browser or user preference
    config.headers['Accept-Language'] = localStorage.getItem('language') || navigator.language || 'en';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      // Check if it's a token expiration error based on the error message
      if (error.response.data.error?.code === 'token_expired') {
        // Redirect to login page or refresh token
        localStorage.removeItem('auth_token');
        window.location.href = '/login?expired=true';
      }
    }
    
    return Promise.reject(error);
  }
);
```

## Security Considerations

Ensure API requests follow security best practices:

1. Never store sensitive data in localStorage or sessionStorage
2. Use HTTPS for all API requests
3. Implement CSRF token handling for relevant requests
4. Sanitize all data received from the API before rendering, especially user-generated content
5. Implement proper token refresh mechanisms
6. Log out users when security-related errors occur
# Client-Side API Requests

This document describes how React client-side applications should make API requests and handle responses when interacting with RESTful services.

## API Request Strategy

### Configuration

Set up a centralized API client configuration:

```tsx
// src/services/api.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Type for API error responses
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    params?: Array<{
      param: string;
      message: string;
    }>;
  };
}

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor for auth headers, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add language preference
    config.headers['Accept-Language'] = 
      localStorage.getItem('language') || 
      navigator.language || 
      'en';
      
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for common error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      if (error.response.data.error?.code === 'token_expired') {
        // Redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login?expired=true';
      }
    }
    
    return Promise.reject(error);
  }
);

// Generic request function with TypeScript type safety
export async function apiRequest<T>(
  config: AxiosRequestConfig
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await apiClient(config);
    return response.data;
  } catch (error) {
    // Handle or transform error
    throw error;
  }
}
```

### Request Structure

All API requests should follow consistent patterns based on the HTTP method:

## GET Requests

`GET` requests are used to retrieve data from the API. They should be structured as follows:

```tsx
// src/services/userService.ts
import { apiRequest } from './api';
import { User, PaginatedResponse } from '../types';

// Function to get users with pagination
export async function getUsers(
  params: {
    limit?: number;
    offset?: number;
    order?: string;
    dir?: 'asc' | 'desc';
    expand?: boolean;
    q?: string;
  } = {}
): Promise<PaginatedResponse<User>> {
  return apiRequest<PaginatedResponse<User>>({
    method: 'GET',
    url: '/users',
    params
  });
}

// Function to get a single user by ID
export async function getUserById(
  id: string,
  expand: boolean = false
): Promise<User> {
  return apiRequest<User>({
    method: 'GET',
    url: `/users/${id}`,
    params: { expand }
  });
}
```

### Component Implementation with React Query

```tsx
// src/components/UserList.tsx
import { useQuery } from 'react-query';
import { getUsers } from '../services/userService';
import { 
  CircularProgress, 
  Alert, 
  Typography, 
  TablePagination 
} from '@mui/material';
import { useState } from 'react';

export const UserList: React.FC = () => {
  const [queryParams, setQueryParams] = useState({
    limit: 10,
    offset: 0,
    order: 'createdAt',
    dir: 'desc' as const
  });
  
  const { data, isLoading, error, refetch } = useQuery(
    ['users', queryParams],
    () => getUsers(queryParams),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false
    }
  );
  
  // Loading state
  if (isLoading) {
    return (
      <>
        <CircularProgress 
          aria-label="Loading users" 
          role="progressbar" 
        />
        <div aria-live="polite" className="sr-only">
          Loading users, please wait.
        </div>
      </>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div aria-live="assertive">
        <Alert severity="error">
          Failed to load users. Please try again.
        </Alert>
      </div>
    );
  }
  
  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({
      ...prev,
      offset: page * prev.limit
    }));
  };
  
  const handleLimitChange = (limit: number) => {
    setQueryParams(prev => ({
      ...prev,
      limit,
      offset: 0
    }));
  };
  
  return (
    <>
      {/* Display users */}
      <TablePagination
        component="div"
        count={data?.total || 0}
        page={Math.floor(queryParams.offset / queryParams.limit)}
        onPageChange={(e, page) => handlePageChange(page)}
        rowsPerPage={queryParams.limit}
        onRowsPerPageChange={(e) => handleLimitChange(parseInt(e.target.value))}
        labelDisplayedRows={({ from, to, count }) => (
          `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
        )}
        rowsPerPageOptions={[10, 25, 50, 100]}
        aria-label="Pagination controls"
      />
    </>
  );
};
```

## POST Requests

`POST` requests are used to create new resources. They should include appropriate validation:

```tsx
// src/services/userService.ts
export interface UserCreateInput {
  name: string;
  email: string;
  role: string;
  // other fields...
}

export async function createUser(data: UserCreateInput): Promise<User> {
  return apiRequest<User>({
    method: 'POST',
    url: '/users',
    data
  });
}
```

### Component Implementation with React Query

```tsx
// src/components/CreateUserForm.tsx
import { useMutation, useQueryClient } from 'react-query';
import { createUser, UserCreateInput } from '../services/userService';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  CircularProgress, 
  Box, 
  Alert 
} from '@mui/material';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../services/api';

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  role: Yup.string().required('Role is required')
});

export const CreateUserForm: React.FC = () => {
  const queryClient = useQueryClient();
  const [serverErrors, setServerErrors] = useState<{[key: string]: string}>({});
  
  const { mutate, isLoading, isError, error, isSuccess } = useMutation(
    createUser,
    {
      onSuccess: () => {
        // Invalidate users query to refetch the list
        queryClient.invalidateQueries('users');
        
        // Reset form
        formik.resetForm();
        
        // Show success message
        // This could be via toast or state management
      },
      onError: (error: AxiosError<ApiErrorResponse>) => {
        // Handle validation errors from the server
        if (error.response?.status === 400 && error.response.data.error.params) {
          const fieldErrors: {[key: string]: string} = {};
          error.response.data.error.params.forEach(param => {
            fieldErrors[param.param] = param.message;
          });
          setServerErrors(fieldErrors);
        }
      }
    }
  );
  
  const formik = useFormik<UserCreateInput>({
    initialValues: {
      name: '',
      email: '',
      role: 'user'
    },
    validationSchema,
    onSubmit: (values) => {
      setServerErrors({});
      mutate(values);
    }
  });
  
  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate>
      {isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          User created successfully!
        </Alert>
      )}
      
      {isError && !Object.keys(serverErrors).length && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to create user. Please try again.
        </Alert>
      )}
      
      <TextField
        id="name"
        name="name"
        label="Name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          (formik.touched.name && Boolean(formik.errors.name)) || 
          Boolean(serverErrors.name)
        }
        helperText={
          (formik.touched.name && formik.errors.name) || 
          serverErrors.name
        }
        fullWidth
        margin="normal"
        required
        aria-required="true"
        aria-invalid={Boolean(formik.errors.name || serverErrors.name)}
        aria-describedby={
          formik.errors.name || serverErrors.name ? "name-error" : undefined
        }
      />
      
      {/* Other fields follow the same pattern */}
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
        sx={{ mt: 2 }}
      >
        {isLoading ? 'Creating...' : 'Create User'}
      </Button>
      
      {/* Accessibility support for form status */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isLoading && 'Creating user, please wait.'}
        {isSuccess && 'User created successfully.'}
        {isError && 'Error creating user. Please check the form for errors.'}
      </div>
    </Box>
  );
};
```

## PUT Requests

`PUT` requests are used to update existing resources. They should include proper validation and error handling:

```tsx
// src/services/userService.ts
export interface UserUpdateInput {
  name?: string;
  email?: string;
  role?: string;
  // other optional fields...
}

export async function updateUser(
  id: string, 
  data: UserUpdateInput
): Promise<User> {
  return apiRequest<User>({
    method: 'PUT',
    url: `/users/${id}`,
    data
  });
}
```

## DELETE Requests

`DELETE` requests should include confirmation UIs to prevent accidental deletions:

```tsx
// src/services/userService.ts
export async function deleteUser(id: string): Promise<void> {
  return apiRequest({
    method: 'DELETE',
    url: `/users/${id}`
  });
}
```

```tsx
// src/components/DeleteUserButton.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { deleteUser } from '../services/userService';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle 
} from '@mui/material';

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
}

export const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ 
  userId, 
  userName 
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { mutate, isLoading } = useMutation(
    () => deleteUser(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        setOpen(false);
      }
    }
  );
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDelete = () => mutate();
  
  return (
    <>
      <Button 
        variant="outlined" 
        color="error" 
        onClick={handleOpen}
        aria-label={`Delete user ${userName}`}
      >
        Delete
      </Button>
      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete User
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete {userName}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose} 
            autoFocus
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
```

## Search and Filter Implementation

To implement search and filtering in list views:

```tsx
// src/components/UserSearch.tsx
import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';

interface UserSearchProps {
  onSearch: (params: { q?: string; role?: string }) => void;
}

export const UserSearch: React.FC<UserSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      q: searchTerm || undefined,
      role: role || undefined
    });
  };
  
  const handleReset = () => {
    setSearchTerm('');
    setRole('');
    onSearch({});
  };
  
  return (
    <Box 
      component="form" 
      onSubmit={handleSearch}
      sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}
    >
      <TextField
        label="Search users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        variant="outlined"
        size="small"
        sx={{ flexGrow: 1, minWidth: '200px' }}
        aria-label="Search users"
      />
      
      <FormControl 
        size="small" 
        sx={{ minWidth: '150px' }}
      >
        <InputLabel id="role-filter-label">Role</InputLabel>
        <Select
          labelId="role-filter-label"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          label="Role"
        >
          <MenuItem value="">All roles</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </Select>
      </FormControl>
      
      <Button 
        type="submit" 
        variant="contained"
      >
        Search
      </Button>
      
      <Button 
        type="button" 
        variant="outlined" 
        onClick={handleReset}
      >
        Reset
      </Button>
    </Box>
  );
};
```

## Request State Management

Use React Query to manage API request states consistently across the application:

```tsx
// src/context/queryClient.tsx
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
};
```

## Accessibility Considerations

Ensure all API request components are accessible:

1. All error messages must be announced to screen readers
2. Loading states must be clearly indicated
3. Focus must be properly managed during form submissions
4. Success messages should be announced to screen readers
5. Interactive elements should have proper ARIA attributes

## Error Handling Strategy

Implement a consistent error handling approach across the application:

```tsx
// src/hooks/useErrorHandler.ts
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../services/api';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

type ValidationErrors = Record<string, string>;

interface UseErrorHandlerResult {
  handleError: (error: unknown) => void;
  getFieldErrors: (error: unknown) => ValidationErrors;
  isValidationError: (error: unknown) => boolean;
}

export function useErrorHandler(): UseErrorHandlerResult {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  
  const isAxiosError = (error: unknown): error is AxiosError<ApiErrorResponse> => {
    return (
      error != null &&
      typeof error === 'object' &&
      'isAxiosError' in error &&
      error.isAxiosError === true
    );
  };
  
  const isValidationError = (error: unknown): boolean => {
    if (!isAxiosError(error)) return false;
    return error.response?.status === 400 && !!error.response.data.error.params;
  };
  
  const getFieldErrors = (error: unknown): ValidationErrors => {
    if (!isValidationError(error)) return {};
    
    const validationErrors: ValidationErrors = {};
    const axiosError = error as AxiosError<ApiErrorResponse>;
    
    axiosError.response?.data.error.params?.forEach(param => {
      validationErrors[param.param] = param.message;
    });
    
    return validationErrors;
  };
  
  const handleError = (error: unknown) => {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const status = axiosError.response?.status;
      const errorMessage = axiosError.response?.data.error.message || 'An error occurred';
      
      // Handle different status codes
      switch (status) {
        case 400:
          // If it's a validation error, don't show a toast - let the form handle it
          if (!isValidationError(error)) {
            enqueueSnackbar(errorMessage, { variant: 'error' });
          }
          break;
          
        case 401:
          enqueueSnackbar('Your session has expired. Please log in again.', { variant: 'warning' });
          navigate('/login');
          break;
          
        case 403:
          enqueueSnackbar('You do not have permission to perform this action.', { variant: 'error' });
          break;
          
        case 404:
          enqueueSnackbar('The requested resource was not found.', { variant: 'error' });
          break;
          
        case 422:
          enqueueSnackbar(errorMessage, { variant: 'error' });
          break;
          
        case 429:
          enqueueSnackbar('Too many requests. Please try again later.', { variant: 'warning' });
          break;
          
        case 500:
        default:
          enqueueSnackbar('An unexpected error occurred. Please try again later.', { variant: 'error' });
          // Log to error monitoring service
          console.error('API Error:', error);
          break;
      }
    } else {
      enqueueSnackbar('An unexpected error occurred.', { variant: 'error' });
      console.error('Non-API Error:', error);
    }
  };
  
  return {
    handleError,
    getFieldErrors,
    isValidationError
  };
}
```

## Security Best Practices

1. Always validate user inputs before sending to the API
2. Sanitize data received from the API before rendering, especially user-generated content
3. Use HTTPS for all API communications
4. Implement proper token handling and refresh mechanisms
5. Do not store sensitive information in local storage
6. Protect against cross-site request forgery (CSRF) attacks
7. Implement rate limiting on the client side for form submissions
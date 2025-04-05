#!/usr/bin/env node

/**
 * UI-base Project Creator
 * 
 * Creates a new Node.js RESTful API project with UI-base standards pre-applied.
 * 
 * @author UI-base Team
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function createProjectStructure(projectDir) {
  const directories = [
    'src/components',
    'src/components/common',
    'src/components/layout',
    'src/contexts',
    'src/hooks',
    'src/pages',
    'src/services',
    'src/styles',
    'src/types',
    'src/utils',
    'src/assets/images',
    'src/assets/icons',
    'src/assets/fonts',
    'tests/unit',
    'tests/integration',
    'tests/fixtures',
    'tests/e2e',
    'docs/standards',
    'public'
  ];
  
  directories.forEach(dir => {
    const fullPath = path.join(projectDir, dir);
    fs.mkdirSync(fullPath, { recursive: true });
  });
  
  log('Created React project directory structure', colors.green);
}

function createPackageJson(projectDir, projectName) {
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    description: 'A React UI application using UI-base standards',
    private: true,
    scripts: {
      start: 'react-scripts start',
      build: 'react-scripts build',
      test: 'react-scripts test',
      eject: 'react-scripts eject',
      'lint:md': 'markdownlint "*.md" "docs/*.md"',
      'lint:ts': 'eslint --ext .js,.jsx,.ts,.tsx src',
      'lint:css': 'stylelint "src/**/*.{css,scss}"',
      'lint': 'npm run lint:md && npm run lint:ts && npm run lint:css',
      'format': 'prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,scss}"',
      'typecheck': 'tsc --noEmit',
      'test:watch': 'react-scripts test --watchAll',
      'test:coverage': 'react-scripts test --coverage',
      'test:e2e': 'cypress run',
      'cypress': 'cypress open'
    },
    keywords: [
      'react',
      'typescript',
      'ui',
      'frontend',
      'accessibility'
    ],
    author: '',
    license: 'MIT',
    dependencies: {
      '@emotion/react': '^11.11.1',
      '@emotion/styled': '^11.11.0',
      '@mui/icons-material': '^5.14.11',
      '@mui/material': '^5.14.11',
      '@tanstack/react-query': '^4.35.3',
      'axios': '^1.5.1',
      'date-fns': '^2.30.0',
      'framer-motion': '^10.16.4',
      'i18next': '^23.5.1',
      'lodash': '^4.17.21',
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      'react-error-boundary': '^4.0.11',
      'react-helmet-async': '^1.3.0',
      'react-hook-form': '^7.47.0',
      'react-i18next': '^13.2.2',
      'react-router-dom': '^6.16.0',
      'zod': '^3.22.4',
      'web-vitals': '^3.5.0'
    },
    devDependencies: {
      '@axe-core/react': '^4.7.3',
      '@storybook/addon-a11y': '^7.4.5',
      '@storybook/addon-essentials': '^7.4.5',
      '@storybook/react': '^7.4.5',
      '@testing-library/jest-dom': '^6.1.3',
      '@testing-library/react': '^14.0.0',
      '@testing-library/user-event': '^14.5.1',
      '@types/jest': '^29.5.5',
      '@types/lodash': '^4.14.199',
      '@types/node': '^20.8.2',
      '@types/react': '^18.2.24',
      '@types/react-dom': '^18.2.8',
      '@typescript-eslint/eslint-plugin': '^6.7.4',
      '@typescript-eslint/parser': '^6.7.4',
      'cypress': '^13.3.0',
      'eslint': '^8.50.0',
      'eslint-config-prettier': '^9.0.0',
      'eslint-plugin-import': '^2.28.1',
      'eslint-plugin-jsx-a11y': '^6.7.1',
      'eslint-plugin-react': '^7.33.2',
      'eslint-plugin-react-hooks': '^4.6.0',
      'husky': '^8.0.3',
      'lint-staged': '^14.0.1',
      'markdownlint-cli': '^0.37.0',
      'msw': '^1.3.1',
      'prettier': '^3.0.3',
      'react-scripts': '^5.0.1',
      'source-map-explorer': '^2.5.3',
      'stylelint': '^15.10.3',
      'stylelint-config-standard': '^34.0.0',
      'typescript': '^5.2.2'
    },
    browserslist: {
      'production': [
        '>0.2%',
        'not dead',
        'not op_mini all'
      ],
      'development': [
        'last 1 chrome version',
        'last 1 firefox version',
        'last 1 safari version'
      ]
    },
    eslintConfig: {
      'extends': [
        'react-app',
        'react-app/jest',
        'plugin:jsx-a11y/recommended',
        'prettier'
      ],
      'plugins': [
        'jsx-a11y'
      ]
    }
  };
  
  fs.writeFileSync(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf8'
  );
  
  log('Created package.json for React project', colors.green);
}

function copyStandardsFiles(projectDir, sourceDir) {
  const standardsFiles = [
    'node_structure_and_naming_conventions.md',
    'sql-standards-and-patterns.md',
    'technologies.md',
    'operations-and-responses.md',
    'request.md',
    'validation.md',
    'global-rules.md',
    'CLAUDE.md'
  ];
  
  standardsFiles.forEach(file => {
    const source = path.join(sourceDir, file);
    const destination = path.join(projectDir, 'docs', 'standards', file);
    fs.copyFileSync(source, destination);
  });
  
  log('Copied standards documentation', colors.green);
}

function copyConfigFiles(projectDir, sourceDir) {
  const configFiles = [
    ['.markdownlint.json', '.markdownlint.json'],
    ['.gitignore', '.gitignore']
  ];
  
  configFiles.forEach(([source, destination]) => {
    fs.copyFileSync(
      path.join(sourceDir, source),
      path.join(projectDir, destination)
    );
  });
  
  // Create TypeScript configuration
  const tsConfig = `{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src"
  },
  "include": ["src"]
}`;

  fs.writeFileSync(path.join(projectDir, 'tsconfig.json'), tsConfig);
  
  // Create ESLint config
  const eslintConfig = `module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:jsx-a11y/recommended',
    'prettier'
  ],
  plugins: ['jsx-a11y'],
  rules: {
    'react/jsx-filename-extension': [1, { 'extensions': ['.jsx', '.tsx'] }],
    'import/prefer-default-export': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
    'jsx-a11y/anchor-is-valid': ['error', { components: ['Link'], specialLink: ['to'] }]
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src']
      }
    }
  }
};`;

  fs.writeFileSync(path.join(projectDir, '.eslintrc.js'), eslintConfig);
  
  // Create Prettier config
  const prettierConfig = `{
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "arrowParens": "avoid"
}`;

  fs.writeFileSync(path.join(projectDir, '.prettierrc'), prettierConfig);
  
  // Create .env.example
  const envExample = `# React App Configuration
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENV=development

# Feature Flags
REACT_APP_FEATURE_DARK_MODE=true
REACT_APP_FEATURE_NOTIFICATIONS=true

# Analytics
REACT_APP_ANALYTICS_ID=

# i18n
REACT_APP_DEFAULT_LANGUAGE=en
`;

  fs.writeFileSync(path.join(projectDir, '.env.example'), envExample);
  
  // Create .env.development
  fs.writeFileSync(path.join(projectDir, '.env.development'), envExample);
  
  // Create stylelint config
  const stylelintConfig = `{
  "extends": "stylelint-config-standard",
  "rules": {
    "selector-class-pattern": null,
    "no-descending-specificity": null
  }
}`;

  fs.writeFileSync(path.join(projectDir, '.stylelintrc.json'), stylelintConfig);
  
  // Create lint-staged config
  const lintStagedConfig = `{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{css,scss}": [
    "stylelint --fix",
    "prettier --write"
  ],
  "*.{json,md}": [
    "prettier --write"
  ]
}`;

  fs.writeFileSync(path.join(projectDir, '.lintstagedrc.json'), lintStagedConfig);
  
  // Create husky pre-commit hook
  const huskyDir = path.join(projectDir, '.husky');
  fs.mkdirSync(huskyDir, { recursive: true });
  
  const preCommitHook = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
npm run typecheck
`;

  fs.writeFileSync(path.join(huskyDir, 'pre-commit'), preCommitHook);
  fs.chmodSync(path.join(huskyDir, 'pre-commit'), '755');
  
  log('Created React project configuration files', colors.green);
}

function createAppFiles(projectDir) {
  // index.tsx (React entry point)
  const indexTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ErrorBoundary } from 'react-error-boundary';

import App from './App';
import theme from './styles/theme';
import ErrorFallback from './components/common/ErrorFallback';
import './styles/index.css';
import reportWebVitals from './utils/reportWebVitals';

// Initialize axe for accessibility testing in development
if (process.env.NODE_ENV === 'development') {
  import('@axe-core/react').then(axe => {
    axe.default(React, ReactDOM, 1000);
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();
`;

  // App.tsx
  const appTsx = `import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/layout/Layout';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
`;

  // Theme file
  const themeTsx = `import { createTheme } from '@mui/material/styles';

// Brand colors
const primaryMain = '#1976d2';
const secondaryMain = '#dc004e';

// Create a responsive theme
const theme = createTheme({
  palette: {
    primary: {
      main: primaryMain,
      light: '#4791db',
      dark: '#115293',
      contrastText: '#ffffff',
    },
    secondary: {
      main: secondaryMain,
      light: '#e33371',
      dark: '#9a0036',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '*:focus': {
            outline: '2px solid #1976d2',
            outlineOffset: '2px',
          },
        },
      },
    },
  },
});

export default theme;
`;

  // HomePage.tsx
  const homePageTsx = `import React from 'react';
import { Helmet } from 'react-helmet-async';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Home Page | React App</title>
        <meta name="description" content="Welcome to our React application" />
      </Helmet>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Your React Application
          </Typography>
          <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
            <Typography variant="body1">
              This is a starter React application built with TypeScript, Material-UI, and React Router.
              It follows accessibility best practices and is set up for consuming RESTful APIs.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
`;

  // NotFoundPage.tsx
  const notFoundPageTsx = `import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | React App</title>
        <meta name="description" content="The page you requested was not found" />
      </Helmet>
      <Container maxWidth="md">
        <Box 
          sx={{ 
            my: 8, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Typography variant="h1" sx={{ fontSize: '8rem', fontWeight: 'bold', color: 'text.secondary' }}>
            404
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Page Not Found
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </Typography>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/"
            startIcon={<HomeIcon />}
          >
            Return to Home Page
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default NotFoundPage;
`;

  // Layout.tsx
  const layoutTsx = `import React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';

import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
`;

  // Header.tsx
  const headerTsx = `import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
            }}
          >
            React App
          </Typography>
          <Box>
            <Button color="inherit" component={RouterLink} to="/">
              Home
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
`;

  // Footer.tsx
  const footerTsx = `import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {currentYear} Your Company Name. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          <Link href="#accessibility" color="inherit">
            Accessibility
          </Link>
          {' | '}
          <Link href="#privacy" color="inherit">
            Privacy Policy
          </Link>
          {' | '}
          <Link href="#terms" color="inherit">
            Terms of Use
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
`;

  // ErrorFallback.tsx
  const errorFallbackTsx = `import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { FallbackProps } from 'react-error-boundary';

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 600,
          }}
        >
          <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" component="h1" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            An unexpected error has occurred. Our team has been notified and is working to fix the issue.
          </Typography>
          <Box sx={{ mt: 2, mb: 2, width: '100%', bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
            <Typography variant="body2" component="pre" sx={{ overflowX: 'auto' }}>
              {error.message}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={resetErrorBoundary}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default ErrorFallback;
`;

  // reportWebVitals.ts
  const reportWebVitalsTs = `import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
`;

  // ApiService.ts (API client)
  const apiServiceTs = `import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create a base API client instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API service class
class ApiService {
  // GET request
  static async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.get(url, config);
    return response.data;
  }

  // POST request
  static async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.post(url, data, config);
    return response.data;
  }

  // PUT request
  static async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.put(url, data, config);
    return response.data;
  }

  // PATCH request
  static async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.patch(url, data, config);
    return response.data;
  }

  // DELETE request
  static async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.delete(url, config);
    return response.data;
  }
}

export default ApiService;
`;

  // CSS file
  const indexCss = `/* Base styles */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

/* Accessibility improvements */
*:focus-visible {
  outline: 3px solid #1976d2;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Skip link for keyboard users */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background-color: #ffffff;
  z-index: 100;
  color: #000000;
  border: 2px solid #1976d2;
}

.skip-link:focus {
  top: 0;
}
`;

  // Create index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#1976d2" />
    <meta
      name="description"
      content="React application created using UI-base standards"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <title>React Application</title>
  </head>
  <body>
    <a href="#root" class="skip-link">Skip to content</a>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`;

  // Create manifest.json
  const manifestJson = `{
  "short_name": "React App",
  "name": "React Application",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#1976d2",
  "background_color": "#ffffff"
}
`;

  // Create robots.txt
  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:
`;

  // Write files
  fs.writeFileSync(path.join(projectDir, 'src', 'index.tsx'), indexTsx);
  fs.writeFileSync(path.join(projectDir, 'src', 'App.tsx'), appTsx);
  fs.writeFileSync(path.join(projectDir, 'src', 'styles', 'theme.ts'), themeTsx);
  fs.writeFileSync(path.join(projectDir, 'src', 'styles', 'index.css'), indexCss);
  
  fs.writeFileSync(path.join(projectDir, 'src', 'pages', 'HomePage.tsx'), homePageTsx);
  fs.writeFileSync(path.join(projectDir, 'src', 'pages', 'NotFoundPage.tsx'), notFoundPageTsx);
  
  fs.writeFileSync(path.join(projectDir, 'src', 'components', 'layout', 'Layout.tsx'), layoutTsx);
  fs.writeFileSync(path.join(projectDir, 'src', 'components', 'layout', 'Header.tsx'), headerTsx);
  fs.writeFileSync(path.join(projectDir, 'src', 'components', 'layout', 'Footer.tsx'), footerTsx);
  fs.writeFileSync(path.join(projectDir, 'src', 'components', 'common', 'ErrorFallback.tsx'), errorFallbackTsx);
  
  fs.writeFileSync(path.join(projectDir, 'src', 'utils', 'reportWebVitals.ts'), reportWebVitalsTs);
  fs.writeFileSync(path.join(projectDir, 'src', 'services', 'ApiService.ts'), apiServiceTs);
  
  fs.writeFileSync(path.join(projectDir, 'public', 'index.html'), indexHtml);
  fs.writeFileSync(path.join(projectDir, 'public', 'manifest.json'), manifestJson);
  fs.writeFileSync(path.join(projectDir, 'public', 'robots.txt'), robotsTxt);
  
  log('Created React application files', colors.green);
}

function createReadme(projectDir, projectName) {
  const readme = `# ${projectName}

A React UI application built following UI-base standards, designed to consume RESTful APIs.

## Getting Started

### Prerequisites

- Node.js (latest LTS)
- npm

### Installation

1. Clone this repository
2. Install dependencies: \`npm install\`
3. Copy .env.example to .env.local and update with your configuration
4. Start the development server: \`npm start\`

## Project Structure

\`\`\`
src/
├── assets/         # Static assets (images, icons, fonts)
├── components/     # React components
│   ├── common/     # Reusable components
│   └── layout/     # Layout components
├── contexts/       # React contexts
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── services/       # API services
├── styles/         # Global styles and theme
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── App.tsx         # Main App component
└── index.tsx       # Entry point
public/             # Public assets
tests/              # Test files
docs/               # Documentation
└── standards/      # UI-base standards
\`\`\`

## Development

### Available Scripts

- \`npm start\`: Start development server
- \`npm run build\`: Build for production
- \`npm test\`: Run tests
- \`npm run lint\`: Run linters (ESLint, Stylelint, and Markdownlint)
- \`npm run format\`: Format code with Prettier
- \`npm run typecheck\`: Run TypeScript type checking
- \`npm run test:coverage\`: Run tests with coverage
- \`npm run test:e2e\`: Run end-to-end tests with Cypress

## Accessibility

This project is committed to meeting WCAG 2.2 AA standards. Key accessibility features:

- Semantic HTML elements
- ARIA attributes when necessary
- Focus management
- Color contrast compliance
- Keyboard navigation
- Screen reader support
- Reduced motion support

## API Integration

This project uses Axios for API requests and React Query for data fetching, caching, and state management. The API integration is structured to:

- Handle authentication
- Manage request/response interceptors
- Provide error handling
- Support TypeScript with strong typing

## Standards

This project follows the UI-base standards. See the \`docs/standards/\` directory for details.

## License

This project is licensed under the MIT License.
`;

  fs.writeFileSync(path.join(projectDir, 'README.md'), readme);
  log('Created README.md', colors.green);
}

function initGit(projectDir) {
  try {
    process.chdir(projectDir);
    execSync('git init', { stdio: 'ignore' });
    execSync('git add .', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit with UI-base standards"', { stdio: 'ignore' });
    log('Initialized Git repository', colors.green);
  } catch (error) {
    log(`Warning: Could not initialize Git repository: ${error.message}`, colors.yellow);
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    log('Please provide a project name', colors.red);
    log('Usage: node create-project.js <project-name>', colors.yellow);
    process.exit(1);
  }
  
  const projectName = args[0];
  const projectDir = path.join(process.cwd(), projectName);
  const sourceDir = path.join(__dirname, '..');
  
  // Check if directory already exists
  if (fs.existsSync(projectDir)) {
    log(`Directory ${projectDir} already exists. Please choose another name.`, colors.red);
    process.exit(1);
  }
  
  log(`Creating new project: ${projectName}`, colors.blue);
  log('===============================', colors.blue);
  
  // Create project structure
  createProjectStructure(projectDir);
  
  // Create package.json
  createPackageJson(projectDir, projectName);
  
  // Copy standards files
  copyStandardsFiles(projectDir, sourceDir);
  
  // Copy config files
  copyConfigFiles(projectDir, sourceDir);
  
  // Create app files
  createAppFiles(projectDir);
  
  // Create README
  createReadme(projectDir, projectName);
  
  // Initialize Git repository
  initGit(projectDir);
  
  log('\nProject creation complete!', colors.green);
  log(`\nTo get started:`, colors.yellow);
  log(`  cd ${projectName}`, colors.yellow);
  log(`  npm install`, colors.yellow);
  log(`  npm run dev`, colors.yellow);
}

main();
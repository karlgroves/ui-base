#!/usr/bin/env node

/**
 * UI-base Standards Setup Script
 * 
 * This script helps incorporate UI-base standards into a Node.js project.
 * It copies configuration files and documentation, and sets up linting rules.
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

// Configuration
const config = {
  standardsFiles: [
    'node_structure_and_naming_conventions.md',
    'sql-standards-and-patterns.md',
    'technologies.md',
    'operations-and-responses.md',
    'request.md',
    'validation.md',
    'global-rules.md',
    'CLAUDE.md',
    'visual-design-requirements.md'
  ],
  configFiles: [
    '.markdownlint.json',
    '.gitignore'
  ],
  dependencies: {
    dev: [
      'markdownlint-cli',
      'eslint',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'eslint-config-prettier',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'prettier',
      'stylelint',
      'stylelint-config-standard'
    ]
  }
};

// Helper functions
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function createDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`Created directory: ${dir}`, colors.green);
  }
}

function copyFile(source, destination) {
  try {
    fs.copyFileSync(source, destination);
    log(`Copied: ${path.basename(source)} -> ${destination}`, colors.green);
  } catch (error) {
    log(`Error copying ${source}: ${error.message}`, colors.red);
  }
}

function updatePackageJson(targetDir) {
  const packageJsonPath = path.join(targetDir, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    log('No package.json found. Please run npm init first.', colors.red);
    return false;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add scripts
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts['lint:md'] = 'markdownlint "*.md" "docs/**/*.md"';
    packageJson.scripts['lint:ts'] = 'eslint --ext .js,.jsx,.ts,.tsx src';
    packageJson.scripts['lint:css'] = 'stylelint "src/**/*.{css,scss}"';
    packageJson.scripts.lint = 'npm run lint:md && npm run lint:ts && npm run lint:css';
    packageJson.scripts.format = 'prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,scss}"';
    packageJson.scripts.typecheck = 'tsc --noEmit';
    
    // Write updated package.json
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      'utf8'
    );
    
    log('Updated package.json with linting scripts', colors.green);
    return true;
  } catch (error) {
    log(`Error updating package.json: ${error.message}`, colors.red);
    return false;
  }
}

function installDependencies(dependencies) {
  try {
    const command = `npm install --save-dev ${dependencies.join(' ')}`;
    log(`Installing dev dependencies: ${dependencies.join(', ')}`, colors.blue);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`Error installing dependencies: ${error.message}`, colors.red);
    return false;
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const targetDir = args[0] || '.';
  const standardsDir = path.join(targetDir, 'docs', 'standards');
  const scriptsDir = path.join(__dirname, '..');

  log('UI-base Standards Setup', colors.blue);
  log('=========================', colors.blue);
  
  // Create directories
  createDirectory(path.join(targetDir, 'docs'));
  createDirectory(standardsDir);
  
  // Copy standards files
  config.standardsFiles.forEach(file => {
    const source = path.join(scriptsDir, file);
    const destination = path.join(standardsDir, file);
    copyFile(source, destination);
  });
  
  // Copy config files
  config.configFiles.forEach(file => {
    const source = path.join(scriptsDir, file);
    const destination = path.join(targetDir, file);
    copyFile(source, destination);
  });
  
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

  fs.writeFileSync(path.join(targetDir, '.eslintrc.js'), eslintConfig);
  log('Created .eslintrc.js', colors.green);
  
  // Update package.json
  const packageUpdated = updatePackageJson(targetDir);
  
  // Install dependencies
  if (packageUpdated) {
    installDependencies(config.dependencies.dev);
  }
  
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

  fs.writeFileSync(path.join(targetDir, 'tsconfig.json'), tsConfig);
  log('Created tsconfig.json', colors.green);
  
  // Create Prettier config
  const prettierConfig = `{
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "arrowParens": "avoid"
}`;

  fs.writeFileSync(path.join(targetDir, '.prettierrc'), prettierConfig);
  log('Created .prettierrc', colors.green);
  
  // Create stylelint config
  const stylelintConfig = `{
  "extends": "stylelint-config-standard",
  "rules": {
    "selector-class-pattern": null,
    "no-descending-specificity": null
  }
}`;

  fs.writeFileSync(path.join(targetDir, '.stylelintrc.json'), stylelintConfig);
  log('Created .stylelintrc.json', colors.green);

  log('\nSetup complete! Standards have been incorporated into your project.', colors.green);
  log('To get started with the React frontend standards, run:', colors.yellow);
  log('  1. npm install', colors.yellow);
  log('  2. npm run lint', colors.yellow);
  log('  3. npm start', colors.yellow);
}

main();
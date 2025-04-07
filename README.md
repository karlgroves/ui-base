# UI Base

An opinionated standard for React frontend applications that consume RESTful APIs.

## Purpose

This repository contains comprehensive standards, guidelines, and conventions for building React frontend applications
with TypeScript and Material-UI.
It serves as a starting point and reference for teams wanting to establish consistent practices across frontend projects
that consume RESTful APIs.

## Contents

- **Architecture & Structure**: Guidelines for React project structure, component organization, and code patterns
- **Coding Standards**: Detailed style guides for TypeScript/React development
- **UI Components**: Conventions for building accessible, reusable components with Material-UI
- **API Integration**: Patterns for consuming RESTful APIs with Axios and React Query
- **Accessibility**: Requirements and patterns for meeting WCAG 2.2 AA standards
- **Security**: Guidelines for implementing secure frontend applications

## Using These Standards in Your Projects

There are several ways to incorporate these standards into your projects:

### Option 1: Use the NPM Package (Recommended)

1. Install this package globally:

   ```bash
   npm install -g git+https://github.com/karlgroves/ui-base.git
   ```

2. Create a new React project with all standards pre-applied:

   ```bash
   ui-base-create my-react-app
   ```

3. Or apply standards to an existing React project:

   ```bash
   cd existing-react-project
   ui-base-setup
   ```

### Option 2: Clone and Copy

1. Clone this repository:

   ```bash
   git clone https://github.com/karlgroves/ui-base.git
   ```

2. Copy the relevant documentation files into your React project:

   ```bash
   mkdir -p my-react-project/docs/standards
   cp ui-base/*.md my-react-project/docs/standards/
   ```

### Option 3: Use as a Template Repository

1. Click the "Use this template" button on GitHub to create a new repository based on this one.
2. Customize the standards to fit your specific project's needs.

## Running the Scripts Locally

If you've cloned this repository, you can also use the scripts directly:

```bash
# Create a new React project
npm run create-project my-react-app

# Setup standards in an existing React project
npm run setup-standards ../path/to/existing-react-project
```

## Standards Files

The key standards files in this repository are:

- `node_structure_and_naming_conventions.md` - TypeScript/React coding standards
- `technologies.md` - Approved frontend technologies and dependencies
- `operations-and-responses.md` - API interaction patterns
- `request.md` - API request handling
- `validation.md` - Input validation requirements
- `global-rules.md` - Project-wide standards
- `visual-design-requirements.md` - UI and design standards
- `CLAUDE.md` - Guide for AI assistants working with the codebase

## Contributing

Contributions are welcome. Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# React Structure and Naming Conventions

## On the Applicability of these Standards

All work performed on the project shall conform to these standards, without exception. Failure to conform to these standards will result in denial of the work delivered until the delivered code conforms to these standards.

## Readability Comes Before Anything

In order to streamline the development process, avoid bugs, and ease maintenance of the system, developers should ensure that - above all - readability matters most. Almost all of the items listed in this document relate to improving the readability of the code so that it can be more easily read by others (including yourself). A good guide to keep in mind is to ask someone to take a quick glance at the code. If even a marginally experienced developer can't understand what's happening, something is wrong.

## JavaScript/TypeScript Code Style

React code should follow modern ES6+/TypeScript standards with consistent styling. When working with React, leveraging modern JavaScript/TypeScript features is encouraged, including:

* Arrow functions
* Destructuring assignments
* Template literals
* Async/await for asynchronous operations
* Optional chaining and nullish coalescing
* TypeScript interfaces and types
* React hooks

For compatibility reasons, always be aware of which browser versions you're targeting, as some features may require polyfills.

## Comments

Informative documentation is the cornerstone of easier maintenance and repair of the system. For that reason, developers should take a rather liberal approach to commenting their code. A general rule of thumb is that if you look at a section of code and think "Wow, I don't want to try and describe that", you need to comment it before you forget how it works. Comments should document decisions. At every point where you had a choice of what to do place a comment describing which choice you made and why.

All documentation blocks ("docblocks") must be compatible with the JSDoc format. Describing the JSDoc format is beyond the scope of this document. For more information, visit: https://jsdoc.app/

### File Level Document Block

Every file that contains JavaScript/TypeScript code must have a header block at the top of the file. The header block should contain these items, at minimum:

* Short description for the file
* Long description of the file
* JSDoc for author

```tsx
/**
 * Short description for file
 *
 * (optional) Long description for file ...
 *
 * @author 	author name 
 */
```

### Component Documentation Block

Every React component must have a documentation block above the component. The documentation block should contain these items, at a minimum:

* Description of the component
* Props
* Return value

```tsx
/** 
 * UserProfile component that displays user information and settings
 * @param {UserProfileProps} props - Component props
 * @returns {JSX.Element} A user profile component with settings controls
 */
```

### Accessibility Documentation

Additionally, every component should include accessibility information:

```tsx
/**
 * Modal dialog component for confirmation actions
 * @param {ModalProps} props - Component props
 * @returns {JSX.Element} Modal dialog component
 * 
 * @a11y This component traps focus when open and returns focus when closed
 * @a11y Uses aria-labelledby to associate the title with the dialog
 * @a11y Implements keyboard escape key to close
 */
```

### Inline Comments

JavaScript style comments (`// single-line` and `/* multi-line */`) are both fine. Use of hash-style comments (`#`) should not be used, even though newer JavaScript versions support them. The primary convention is to use `//` for single-line comments and `/* */` for multi-line comments (with `/**` being used as the marker for the top of the multi-line comment).

#### Examples:

```tsx
// single line comment

/**
 * This is a 
 * multi-line
 * comment
 */
```

### Comment Your "Gotchas"

Developers should ensure that all those places where something happens which may trip up future developers has been commented clearly and that you make these comments much easier to notice by others than normal comments.

* @TODO means there's more to be done to finish/ improve/ repair that section.
* :BUG: means there's a known bug in that section of code.
* :KLUDGE: means you've done something ugly, inefficient, or inideal. Explain how you would do it differently next time if you had more time.
* :WARNING: Tells others that the following code is very tricky so don't go changing it without thinking.
* :A11Y: Indicates an accessibility consideration that must be maintained.

*Committing @TODO code to master is a pretty terrible idea and should be avoided if possible. If you have a @TODO comment, it **must** also have a JIRA ticket associated with it. i.e.:*

```tsx
// @TODO Jira ticket XYZ-123 add aria-live region for status updates
```

#### Formatting of a "Gotcha" Comment Block

Make the gotcha keyword the first symbol in the comment. If you have a keyword you feel is more appropriate than any of the ones listed above, feel free to make up your own.

Comments may consist of multiple lines, but the first line should be a self-containing, meaningful summary.

The writer's name and the date of the remark (in YY-MM-DD format) should be part of the comment. This information is in the source repository, but it can take a quite a while to find out when and by whom it was added. Often gotchas stick around longer than they should. Embedding date information allows other programmer to make this decision. Embedding who information lets us know who to ask. If, during your inquiry, you discover the issue has been resolved, please add that to the comments as "FIXED"

#### Example "Gotcha" blocks

```tsx
/**
 * :A11Y: klg 07-11-02: focus management needs improvement
 * We need to better handle focus return when modal is closed.
 * Should implement focus trap within modal when open.
 */
```

```tsx
/**
 * :BUG: klg 07-11-02: screen reader announcement not working in Safari
 * The aria-live region is not announcing updates in Safari
 * with VoiceOver. Works in Chrome/NVDA and Firefox/JAWS.
 *
 * FIXED klg 07-11-09: changed polite to assertive for critical
 * updates and improved announcement timing
 */
```

## Editor Settings

### Tabs vs. Spaces

Developers must use spaces all the time. Developers should set their editors to format "tabs" as 2 spaces, which is the standard for React and JavaScript projects.

### Line Length

The target line length is 100 characters for basic code lines but readability is the primary consideration in determining how and when lines should wrap.

### Linefeeds

The three major operating systems (Unix, Windows and Mac OS) use different ways to represent the end of a line. Unix systems use the newline character (\n), Mac systems use a carriage return (\r), and Windows systems use a carriage return followed by a line feed (\r\n).

Developers should use simple newlines (Unix/LF style), as this is the standard for all React projects. If you develop on Windows, be sure to set up your editor to save files in Unix format.

### Always Use Braces

Braces must be included when writing code using if, for, while etc. blocks. There are no exceptions to this rule, even if the braces could be omitted per language syntax. Leaving out braces makes code harder to maintain in the future and can also cause bugs that are very difficult to track down.

### Placement of Braces

For JavaScript/TypeScript, braces should follow the "K&R style" (Kernighan and Ritchie) convention. The opening brace is placed on the same line as the statement, with one space before it:

```tsx
if (condition) {
  // do something
}
```

NOT

```tsx
if (condition)
{
  // do something
}
```

### Spaces Between Tokens

There must be one space on either side of a token in expressions, statements etc. The only exceptions are commas (which should have one space after, but none before), semi-colons (which should not have spaces on either side if they are at the end of a line, and one space after otherwise).

Variable assignment:

```tsx
const i = 0;
```

Function with arguments:

```tsx
foo(a, b, c);
```

Ternary Operator:

```tsx
const i = (j < 5) ? j : 5;
```

Loop:

```tsx
for (let i = 1; i <= 10; i++) {
  console.log(i);
}
```

### Operator Precedence (parens)

Even though operator precedence in JavaScript follows established standards, it's not reasonable to expect everyone to know the exact precedence of all operators. Always use brackets or parentheses to make your intentions absolutely clear. This makes maintainability much easier for anyone reviewing the code later.

## Variables

### Variable Naming

Variable names should suggest a property or noun clearly indicating what sort of information will be stored in the value. For instance, `username` clearly indicates that the value stored in that variable will be a username.

Hungarian notation should never be used in the naming of variables, functions, classes, or anything else.

### Exception: Loops

Variables within loops, being only local to that particular loop, can (and should) be short.

```tsx
for (let i = 0; i < 5; i++) {
  // do stuff
}
```

Or:

```tsx
array.forEach((item, index) => {
  // do stuff
});
```

Or when working with objects:

```tsx
Object.entries(myObject).forEach(([key, value]) => {
  // do stuff
});
```

There are, however certain conventions to consider when naming variables within loops:

* `i`, `j`, and `k` are often used as generic names for integer variables in nested loops
* When working with arrays, `item` or a descriptive singular noun is preferable as the iterated value

Do not use the variable `l` (lowercase 'L') in any of your code as it looks too much like the number 'one'.

### Abbreviations and Acronyms

Abbreviations and acronyms should not be used unless the abbreviation or acronym is likely to be universally understood among all other developers likely to be working on the system. For example 'WCAG' is an acronym likely to be understood by all team members as "Web Content Accessibility Guidelines", whereas 'SBC' (Small Block Chevy) is a bit less likely to be understood by those same employees.

### Private Variables and Methods

In modern TypeScript/React code, use TypeScript's access modifiers (private, protected, public) when applicable, or follow conventions for indicating private members with an underscore (`_`) prefix:

```tsx
// In a class component
class MyComponent extends React.Component<Props, State> {
  // Private class property
  private _internalState = 'private';
  
  // Private method
  private _handleInternalEvent() {
    // implementation
  }
}

// In a functional component
const MyComponent: React.FC<Props> = (props) => {
  // Naming convention for "private" helper function in functional component
  const _formatData = (data: any) => {
    // implementation
  };
  
  return (
    // JSX
  );
};
```

### Initialize Variables

Always initialize variables before using them. Use `const` for variables that won't be reassigned, and `let` for variables that will change. Avoid using `var` which has problematic scoping behavior.

```tsx
const user = '';  // Preferred for constants
let count = 0;    // For variables that will change
```

### Variable Declaration

Always use `const` or `let` to declare variables - never rely on variables implicitly becoming global. Using `const` by default and `let` only when needed is preferred to show intent and prevent accidental reassignment.

### Uppercase For Constants

Constants should be declared using all uppercase letters with underscores as separators:

```tsx
const MAX_USERS = 100;
const API_KEY = 'abcdef123456';
```

This only applies to "true" constants - values that are known at creation time and never change. Configuration values that are loaded at runtime but don't change during execution should use camelCase.

### Boolean Variable Values

Use the actual boolean values `true` and `false` (lowercase), not strings like 'true' or 'false'. 

#### Comparisons against booleans

When creating a comparison against a boolean, use the simplest form:

```tsx
if (isValid) {
  // do something when valid
}

if (!isExpired) {
  // do something when not expired
}
```

For non-boolean values, use triple equals (`===`) for strict equality checking:

```tsx
if (value === null) {
  // handle null case
}
```

## React Components

### Naming Components

Use PascalCase (first letter of each word capitalized) for component names:

```tsx
function UserProfile() {
  // component implementation
}

// or

const UserProfile: React.FC<UserProfileProps> = (props) => {
  // component implementation
};
```

### One Component Per File

All components should be separated into their own files. The name of the file should follow the convention of matching the component name: `UserProfile.tsx`.

### Component Organization

Organize your components in a logical structure, grouping related components together:

```
src/
  components/
    common/              # Reusable components
      Button/
        Button.tsx
        Button.test.tsx
        Button.styles.ts
    layout/              # Layout components
      Header/
      Footer/
      Sidebar/
    features/            # Feature-specific components
      UserProfile/
      Dashboard/
  hooks/                 # Custom hooks
  context/               # React context providers
  utils/                 # Utility functions
  pages/                 # Page components
  types/                 # TypeScript types/interfaces
  styles/                # Global styles
  api/                   # API client code
```

### Functional vs Class Components

Prefer functional components with hooks over class components. Use TypeScript interfaces for props and state:

```tsx
interface UserProfileProps {
  userId: string;
  userName: string;
  isAdmin?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, userName, isAdmin = false }) => {
  return (
    <div>
      <h2>{userName}</h2>
      {isAdmin && <span>Administrator</span>}
    </div>
  );
};
```

### Props Destructuring

Destructure props in the function parameter to make it clear which props are being used:

```tsx
// Good
const UserCard: React.FC<UserCardProps> = ({ name, email, role }) => {
  return (
    // JSX
  );
};

// Avoid
const UserCard: React.FC<UserCardProps> = (props) => {
  const { name, email, role } = props;
  return (
    // JSX
  );
};
```

### Avoid Inline Styles

Avoid using inline styles in JSX. Use Material-UI's styling system with emotion or styled-components:

```tsx
// With MUI styled API
import { styled } from '@mui/material/styles';

const StyledButton = styled('button')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
}));

// Usage
<StyledButton>Click Me</StyledButton>
```

### Component State Management

For simple component state, use React's useState hook:

```tsx
const [isOpen, setIsOpen] = useState(false);
```

For complex state, use useReducer:

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

For application-wide state, consider using React Context API or a state management library like Redux.

## Functions

### Naming

Like variables, functions and methods should be named in a way that is clear and concise. In general that means the name of the function should be as accurate a description of what the function does as possible:

* If a function prints user information to the screen the name of the function should be `printUserInformation`.
* If a function validates that an e-mail address is formatted properly it should be called `isValidEmail()`.
* In general functions that return a boolean value should start with `is` or `has`
* Functions should use camelCase (first letter lowercase, subsequent words capitalized)
* Functions should be stateless and as a general rule *never* rely on global information not directly passed to the function
* Private functions or methods (not exported) should begin with underscore `_calculateTotal()`

### Arguments

Argument names should be chosen with the same care as variable names.

Arguments with default values should go at the end of the argument list:

```tsx
function greet(name: string, greeting = 'Hello'): string {
  return `${greeting}, ${name}!`;
}
```

For functions that accept many options, use an options object:

```tsx
interface SearchOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
}

function searchUsers(query: string, { limit = 20, offset = 0, sortBy = 'name' }: SearchOptions = {}) {
  // implementation
}
```

### Be wary of writing functions without a return value

A common practice is making functions that perform side effects without returning a value. While sometimes necessary, this can limit reusability. Consider the following:

```tsx
function mySum(numX: number, numY: number): void {
  const total = numX + numY;
  console.log(total); 
}
```

In the case of the example above, there's only one thing the `mySum` function can do: log the results of a simple addition. While, on the surface, that might not be a big deal, it creates two problems:

* It keeps the function from being able to be included as part of another function or bigger process.
* Any remediation to this function (to make it return, rather than log its result) will break all already-existing code which uses this function.

A better approach would be to ensure all functions return some value, even if that value is a primitive or a boolean. Doing so makes for much more robust & reusable code which also enables you to do better error handling and provide greater usability for the end user. The example function can be modified as follows:

```tsx
function mySum(numX: number, numY: number): number {
  const total = numX + numY;
  return total; 
}
```

The function can now also be modified further to do some basic type checking to make sure the input parameters are indeed numbers (and set to return NaN if they're not) and the function can also be used elsewhere, such as within other functions.

```tsx
// Example usage
const total = mySum(10, 10);
if (!isNaN(total)) {
  console.log(total);
}
```

## Control Structures

### Switch Statements

Control statements written with the `switch` construct must have a single space before the opening parenthesis of the conditional statement, and also a single space after the closing parenthesis.

All content within the `switch` statement must be indented as described elsewhere in this document.

```tsx
switch (numPeople) {
  case 1:
    break;

  case 2:
    break;

  default:
    break;
}
```

The `default` case must not be omitted from a switch statement.

NOTE: It is sometimes useful to write a case statement which falls through to the next case by not including a break or return in that case. To distinguish these cases from bugs, any case statement where break or return are omitted must contain the comment `// break intentionally omitted`.

### if/else/elseif

Control statements based on the if and else constructs must have a single space before the opening parenthesis of the conditional, and a single space after the closing parenthesis.

Within the conditional statements between the parentheses, operators must be separated by spaces for readability. Inner parentheses are encouraged to improve logical grouping of larger conditionals.

The opening brace is written on the same line as the conditional statement. The closing brace is always written on its own line. Any content within the braces must be indented two spaces.

```tsx
if (a !== 2) {
  a = 2;
}
```

For "if" statements that include "else if" or "else", the formatting must be as in these examples:

```tsx
if (a !== 2) {
  a = 2;
} else {
  a = 7;
}
```

```tsx
if (a !== 2) {
  a = 2;
} else if (a === 3) {
  a = 4;
} else {
  a = 7;
}
```

JavaScript/TypeScript allows for these statements to be written without braces in some circumstances. The coding standard makes no differentiation and all "if", "else if" or "else" statements must use braces.

### Ternary Operators

In general don't use ternary operators - use the longer form if / else statements. The exception would be cases where the ternary operation is painfully obvious or for simple assignments or JSX conditionals:

```tsx
// Acceptable use of ternary
const displayName = user.name ? user.name : 'Anonymous';

// In JSX
return (
  <div>
    {isLoggedIn ? <UserProfile /> : <LoginButton />}
  </div>
);
```

### Loops and Iteration

Modern JavaScript provides multiple ways to iterate through arrays and objects. Prefer these modern approaches over traditional `for` loops when possible:

```tsx
// Preferred for arrays
array.forEach(item => {
  // process item
});

// For transforming arrays
const newArray = array.map(item => transformItem(item));

// For filtering arrays
const filteredArray = array.filter(item => meetsCriteria(item));

// For object properties
Object.keys(obj).forEach(key => {
  const value = obj[key];
  // process key and value
});
```

### Condition Format

When comparing a variable to a literal value, put the variable on the left hand side:

```tsx
if (userId === 6) { /* do stuff */ }
```

## Strings

### String Literals

String literals in modern JavaScript should use template literals (backticks) for strings that include variables or span multiple lines, and single quotes for simple strings:

```tsx
// Simple string
const name = 'Karl';

// String with variable interpolation
const greeting = `Hello, ${name}!`;

// Multiline string
const message = `This is a long message
that spans multiple
lines`;
```

### Variable Strings

For string interpolation, use template literals (backticks) rather than concatenation:

```tsx
// Preferred
const message = `User ${userId} is missing in action.`;

// Avoid
const message = 'User ' + userId + ' is missing in action.';
```

### String Concatenation

If you need to concatenate strings rather than use template literals, strings may be concatenated using the `+` operator. A space must always be added before and after the `+` operator to improve readability:

```tsx
const name = 'Karl' + ' ' + 'Groves';
```

### Concatenating Long Strings

When concatenating strings with the `+` operator, it is permitted to break the statement into multiple lines to improve readability. In these cases, each successive line should be padded with whitespace such that the `+` operator is aligned under the `=` operator:

```tsx
const query = "SELECT id, name FROM people "
             + "WHERE name = 'Karl' "
             + "ORDER BY name ASC ";
```

However, template literals are usually a better choice for multiline strings:

```tsx
const query = `
  SELECT id, name 
  FROM people
  WHERE name = 'Karl'
  ORDER BY name ASC
`;
```

## Arrays

### Declaring Arrays

Always use the literal notation for array declarations (unless there's a good reason not to):

```tsx
// Preferred
const names = ['Karl', 'Joe', 'Bob'];

// Avoid
const names = new Array('Karl', 'Joe', 'Bob');
```

### Array Methods

Modern JavaScript provides powerful array methods that should be preferred over manual iteration:

```tsx
// Finding an element
const user = users.find(u => u.id === userId);

// Check if array contains an element
const hasAdmin = users.some(user => user.role === 'admin');

// Transform all elements
const userNames = users.map(user => user.name);

// Filter elements
const activeUsers = users.filter(user => user.isActive);

// Reduce to a single value
const totalAge = users.reduce((sum, user) => sum + user.age, 0);
```

### Numerically Indexed Arrays

Negative numbers are not permitted as indices.

An indexed array may be started with any non-negative number, however this is discouraged and it is recommended that all arrays have a base index of 0.

When declaring arrays with the literal syntax, a trailing space must be added after each comma delimiter to improve readability:

```tsx
const sampleArray = ["Foo", "Bar", "Bat", "Baz"];
```

It is also permitted to declare multiline indexed arrays. In this case, each successive line must be padded with spaces such that beginning of each line aligns as shown below:

```tsx
const sampleArray = [1, 2, 3, "Foo", "Bar",
                    a, b, c,
                    56.44, d, 500];
```

### Objects (Associative Arrays)

When declaring objects with the literal syntax, it is encouraged to break the statement into multiple lines for readability. In this case, each successive line must be padded with whitespace such that both the keys and the values are aligned:

```tsx
const sampleObject = {
  firstKey:  'firstValue',
  secondKey: 'secondValue'
};
```

Objects can also be declared one property at a time. In JavaScript, property names should be camelCase by convention, with exceptions for specific scenarios like API integrations:

```tsx
const user = {};
user.firstName = 'John';
user.lastName = 'Doe';
```

For accessing properties, use dot notation when the property name is known and fixed. Use bracket notation only when the property name is dynamic or non-standard:

```tsx
// Preferred for known properties
const name = user.firstName;

// For dynamic properties
const fieldName = 'firstName';
const name = user[fieldName];
```

## Debugging

### Error Handling

Always use proper error handling with try/catch blocks, especially for asynchronous operations:

```tsx
// For promises
myPromise()
  .then(result => {
    // handle success
  })
  .catch(error => {
    // handle errors
    console.error('Operation failed:', error);
  });

// For async/await
async function doSomething() {
  try {
    const result = await myPromise();
    // handle success
  } catch (error) {
    // handle errors
    console.error('Operation failed:', error);
  }
}
```

### Logging

Use appropriate logging levels for different types of information. Never use `console.log` in production code - use a proper logging library instead:

```tsx
// Example with a logging library
import logger from './logger';

// Different log levels
logger.debug('Detailed debug information');
logger.info('Something noteworthy happened');
logger.warn('Warning: something might be wrong');
logger.error('Error occurred', err);
```

### Validation

Validate all inputs, especially from API requests. Use validation libraries like Yup, Zod, or Formik validation:

```tsx
// Example with Yup
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

// In a form
const { values, errors, handleSubmit } = useFormik({
  initialValues,
  validationSchema,
  onSubmit: (values) => {
    // Submit form
  }
});
```

## File Formats

All files must:

* Be stored as UTF-8 encoded text files
* Be Unix formatted "Unix formatted" means lines must end only with a line feed (LF). Line feeds are represented as ordinal 10, octal 012 and hex 0A. Do not use carriage returns (CR) like Macintosh computers do or the carriage return/line feed combination (CRLF) like Windows computers do.

### Extensions for files

* `.js` for JavaScript files
* `.jsx` for React JSX files
* `.ts` for TypeScript files
* `.tsx` for TypeScript React files
* `.json` for JSON configuration files
* `.md` for Markdown documentation
* `.css` for CSS files
* `.scss` for SASS files
* `.module.css` for CSS modules
* `.module.scss` for SCSS modules
* `.test.tsx` or `.spec.tsx` for test files
* `.stories.tsx` for Storybook stories

### Naming Conventions for files and directories

All names for files and directories must make sense when read. Ensure that the name indicates the type of content/structure which it contains. This is just as important for developers as it is the audience.

### File and directory naming casing

For React projects, follow these conventions:

* Use kebab-case (lowercase with hyphens) for directories: `user-authentication/`
* Use PascalCase for React component files: `UserProfile.tsx`, `LoginForm.tsx`
* Use camelCase for utility functions, hooks, and other non-component files: `useAuth.ts`, `formatDate.ts`
* Use UPPER_SNAKE_CASE for constants files: `DEFAULT_CONSTANTS.ts`
* Use lowercase for configuration files: `package.json`, `.eslintrc.js`

Exception: Files containing components should mirror the casing of the component. For instance, a `UserService` class file would be `UserService.ts`.

### File and Directory Names Must Not Contain Spaces

Do not, under any circumstances, use spaces in file names of any kind.

## Directory structure

### React Application Structure

For a React application, follow this general structure:

```
project-root/
├── public/              # Static files
│   ├── index.html       # HTML template
│   ├── favicon.ico      # Favicon
│   └── assets/          # Other static assets
├── src/                 # Source code
│   ├── assets/          # Application assets
│   │   ├── images/      # Image files
│   │   └── styles/      # Global styles
│   ├── components/      # Reusable components
│   │   ├── common/      # Shared UI components
│   │   ├── layout/      # Layout components
│   │   └── features/    # Feature-specific components
│   ├── hooks/           # Custom React hooks
│   ├── context/         # React context providers
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript type definitions
│   ├── theme/           # MUI theme configuration
│   ├── App.tsx          # Main application component
│   └── index.tsx        # Application entry point
├── tests/               # Test files
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   └── fixtures/        # Test fixtures
├── .storybook/          # Storybook configuration
├── node_modules/        # Dependencies (git ignored)
├── .env                 # Environment variables (git ignored)
├── .env.example         # Example environment variables
├── .eslintrc.js         # ESLint configuration
├── .prettierrc          # Prettier configuration
├── .gitignore           # Git ignore file
├── package.json         # Project metadata and dependencies
├── package-lock.json    # Locked dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

### Component Structure

For larger components, organize related files in a directory:

```
Button/
├── Button.tsx           # Component implementation
├── Button.test.tsx      # Component tests
├── Button.stories.tsx   # Storybook stories
├── Button.styles.ts     # Component styles
└── index.ts             # Re-export the component
```

## Accessibility

### Screen Reader Support

All components must be properly labeled for screen readers:

```tsx
// Bad
<button onClick={handleClose}>X</button>

// Good
<button 
  onClick={handleClose}
  aria-label="Close dialog"
>
  <CloseIcon />
</button>
```

### Focus Management

Ensure proper focus management for interactive elements:

```tsx
// Modal dialog component with focus management
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Focus trap implementation
  useEffect(() => {
    const modalElement = modalRef.current;
    if (isOpen && modalElement) {
      // Save previous focus
      const previouslyFocused = document.activeElement as HTMLElement;
      
      // Focus the modal
      modalElement.focus();
      
      // Return focus on cleanup
      return () => {
        previouslyFocused?.focus();
      };
    }
  }, [isOpen]);
  
  return (
    isOpen ? (
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        // Rest of implementation
      >
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
  );
};
```

### Semantic HTML and ARIA

Always use semantic HTML elements when possible, and only use ARIA attributes when necessary:

```tsx
// Bad - div soup
<div onClick={handleClick}>Click me</div>

// Good - semantic HTML
<button onClick={handleClick}>Click me</button>

// Only use ARIA when needed
<div role="tablist">
  <button role="tab" aria-selected={activeTab === 'profile'}>Profile</button>
  <button role="tab" aria-selected={activeTab === 'settings'}>Settings</button>
</div>
```

### Color Contrast

Ensure all UI elements meet WCAG 2.1 AA color contrast requirements (4.5:1 for normal text, 3:1 for large text and UI components):

```tsx
// Using MUI's accessibility features
import { alpha } from '@mui/material/styles';

// In theme.ts
const theme = createTheme({
  palette: {
    primary: {
      main: '#0062cc', // Has sufficient contrast with white text
    },
    // Define more accessible colors
  },
  components: {
    MuiButton: {
      styleOverrides: {
        // Ensure focus state is visible
        root: {
          '&:focus-visible': {
            outline: '2px solid #000',
            outlineOffset: '2px',
          },
        },
      },
    },
  },
});
```

### Keyboard Navigation

All interactive elements must be keyboard accessible:

```tsx
// Ensure custom components can receive focus and handle keyboard events
const CustomButton: React.FC<CustomButtonProps> = ({ onClick, children, ...props }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick();
      e.preventDefault();
    }
  };
  
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );
};
```

## Security

### Input Sanitization

All user inputs must be sanitized to prevent XSS attacks:

```tsx
// Using DOMPurify to sanitize HTML content
import DOMPurify from 'dompurify';

// When rendering user-generated content
const UserContent: React.FC<{ html: string }> = ({ html }) => {
  const sanitizedHtml = DOMPurify.sanitize(html);
  
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};
```

### Environment Variables

Sensitive information like API keys should never be hardcoded. Use environment variables:

```tsx
// Access environment variables
const apiKey = process.env.REACT_APP_API_KEY;

// Never expose sensitive environment variables to the client
// All REACT_APP_* variables are included in the build
```

Create a `.env.example` file with placeholder values, never commit actual `.env` files to version control.

### Error Handling

Implement proper error handling throughout the application. Never expose detailed error information to users in production:

```tsx
// API service with error handling
const fetchUserData = async (userId: string) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      // Log detailed error for debugging
      console.error('Error fetching user data:', response.statusText);
      
      // User-facing error is generic
      throw new Error('Unable to load user information');
    }
    
    return await response.json();
  } catch (error) {
    // Log the full error
    console.error('User data fetch error:', error);
    
    // Return user-friendly error
    throw new Error('Something went wrong. Please try again later.');
  }
};
```
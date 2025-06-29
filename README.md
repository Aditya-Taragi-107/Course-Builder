# Course Builder Application

A React.js application that allows users to create and manage online courses by adding modules and resources. This application is built with Vite, React, and CSS.

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm (v9 or newer recommended)

### Installation

1. Clone the repository or download the source code:

```bash
git clone <repository-url>
# or
# download and extract the project
```

2. Navigate to the project directory:

```bash
cd toddle-test-app
```

3. Install the dependencies:

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`.

### Linting and Formatting

To check for linting errors:

```bash
npm run lint
```

To automatically fix linting errors (when possible):

```bash
npm run lint:fix
```

To format your code using Prettier:

```bash
npm run format
```

### Building for Production

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```
## Folder Structure

```
my-react-app/
├── eslint.config.js     # ESLint configuration
├── .prettierrc          # Prettier configuration
├── .prettierignore      # Files to ignore by Prettier
├── .vscode/             # VS Code settings
├── public/              # Public assets
├── src/                 # Source files
│   ├── assets/          # Static assets
│   ├── components/      # React components (add as needed)
│   ├── App.jsx          # Root component
│   └── main.jsx         # Entry point
└── index.html           # HTML template
```

```
src/
  ├── components/
  │   ├── modules/
  │   │   ├── CourseBuilder.jsx     # Main component that orchestrates the application
  │   │   ├── ModuleCard.jsx        # Component for displaying individual modules
  │   │   ├── ModuleModal.jsx       # Modal for creating/editing modules
  │   │   ├── ModuleItem.jsx        # Component for displaying module items (links, files)
  │   │   ├── LinkModal.jsx         # Modal for adding links to modules
  │   │   └── UploadModal.jsx       # Modal for uploading files to modules
  │   └── ui/
  │       ├── Header.jsx            # Application header with search and dropdown
  │       └── EmptyState.jsx        # Shown when no modules exist
  ├── assets/
  ├── App.jsx                       # App entry point
  ├── App.css                       # Application styling
  ├── main.jsx
  └── index.css
```

## Application Architecture

### Component Hierarchy

```
App
└── CourseBuilder
    ├── Header
    ├── EmptyState (conditionally rendered)
    ├── ModuleCard (multiple instances)
    │   └── ModuleItem (multiple instances)
    ├── ModuleModal
    ├── LinkModal
    └── UploadModal
```

## Handoff Notes for Candidates

When extending this application:

1. Follow the established component structure and naming conventions
2. Maintain consistent styling with the existing UI, Try to make the UI consistent with the Figma design
3. Use React state appropriately for new features
4. Ensure responsive behavior works on all screen sizes
5. Add appropriate comments for complex logic

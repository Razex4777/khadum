# Technology Stack

## Core Technologies
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript with relaxed configuration
- **Vite** - Fast build tool and development server
- **Node.js** - Runtime environment

## UI & Styling
- **shadcn/ui** - High-quality, accessible React components built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful icon library
- **next-themes** - Theme switching support

## State Management & Data
- **TanStack Query (React Query)** - Server state management and caching
- **React Hook Form** - Performant form handling with validation
- **Zod** - TypeScript-first schema validation

## Routing & Navigation
- **React Router DOM** - Client-side routing

## Development Tools
- **ESLint** - Code linting with React-specific rules
- **TypeScript ESLint** - TypeScript-aware linting
- **SWC** - Fast TypeScript/JavaScript compiler
- **Lovable Tagger** - Development-mode component tagging

## Common Commands

### Development
```bash
npm run dev          # Start development server on port 8080
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Package Management
- Uses npm with package-lock.json
- Bun lockfile present (bun.lockb) for faster installs

## Build Configuration
- **Vite config** includes path aliases (@/ -> ./src/)
- **TypeScript** configured with project references
- **Tailwind** configured with custom theme and animations
- **PostCSS** for CSS processing
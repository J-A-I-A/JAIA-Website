# Development Guide

This guide is for developers who want to contribute to or customize the JAIA website. It covers the technical details, architecture, and development workflow.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Development Setup](#development-setup)
- [Available Commands](#available-commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Adding Features](#adding-features)
- [Styling Guide](#styling-guide)
- [API Development](#api-development)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Code Style](#code-style)

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v3.4** - Utility-first CSS framework
- **shadcn/ui** - Component library
- **Lucide React** - Icon library
- **React Router v7** - Client-side routing
- **React Hook Form** - Form handling

### Backend
- **Express** - Web framework
- **TypeScript** - Type safety
- **tsx** - TypeScript execution and watch mode

## Project Architecture

### How It Works

```
Browser (Frontend)  →  Express Server (Backend)  →  Data/APIs
   Port 5173              Port 3000
```

**Development Mode**: Frontend and backend run separately
- Frontend: Vite dev server on port 5173
- Backend: Express server on port 3000
- Vite proxies `/api/*` requests to the backend

**Production Mode**: Express serves everything
- Express serves the built React app as static files
- Same server handles both frontend and API endpoints
- Single port (3000) for the entire application

## Development Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm (comes with Node.js)
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd JAIA-Website

# Install all dependencies (root, frontend, and backend)
npm run install:all

# Or install manually
npm install              # Root
cd frontend && npm install
cd ../backend && npm install
```

## Available Commands

### Root Level Scripts

```bash
# Development
npm run dev              # Run both frontend + backend with hot reload
npm run dev:frontend     # Run frontend only (port 5173)
npm run dev:backend      # Run backend only (port 3000)

# Building
npm run build            # Build both frontend + backend
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only

# Production
npm start                # Start production server (port 3000)

# Installation
npm run install:all      # Install all dependencies
```

### Frontend Scripts (from frontend/ directory)

```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build locally
npm run lint             # Run ESLint
```

### Backend Scripts (from backend/ directory)

```bash
npm run dev              # Start with hot reload (tsx watch)
npm run build            # Compile TypeScript to JavaScript
npm start                # Run compiled server
```

## Environment Variables

### Backend (.env)

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Add your environment variables here
# DATABASE_URL=your_database_url
# API_KEY=your_api_key
```

See `.env.example` for all available options.

### Frontend

Frontend environment variables go in `frontend/.env`:

```env
# API URL (optional in development, uses proxy)
VITE_API_URL=http://localhost:3000
```

Vite requires the `VITE_` prefix for variables accessible in the browser.

## Project Structure

```
JAIA-Website/
├── frontend/                 # React application
│   ├── public/              # Static assets
│   │   ├── team/           # Team member photos
│   │   └── *.png, *.svg    # Icons and images
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/         # shadcn UI components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   └── textarea.tsx
│   │   │   ├── sections/   # Page sections
│   │   │   │   ├── Navigation.tsx
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── Services.tsx
│   │   │   │   ├── Projects.tsx
│   │   │   │   ├── About.tsx
│   │   │   │   ├── Team.tsx
│   │   │   │   ├── Events.tsx
│   │   │   │   ├── Contact.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── ScrollToTop.tsx
│   │   ├── pages/          # Full page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   └── ProjectTemplate.tsx
│   │   ├── data/
│   │   │   └── projects/   # Project content
│   │   │       ├── index.ts         # Project metadata
│   │   │       ├── finance-bot.md
│   │   │       ├── lawbot.md
│   │   │       ├── music-filter.md
│   │   │       └── patois-speech.md
│   │   ├── lib/
│   │   │   └── utils.ts    # Utility functions
│   │   ├── App.tsx         # Main app with routing
│   │   ├── main.tsx        # Entry point
│   │   └── index.css       # Global styles + Tailwind
│   ├── components.json      # shadcn configuration
│   ├── tailwind.config.ts   # Tailwind configuration
│   ├── vite.config.ts       # Vite configuration
│   └── package.json
│
├── backend/                 # Express server
│   ├── src/
│   │   └── index.ts        # Express app + API routes
│   ├── dist/               # Compiled JavaScript (gitignored)
│   ├── .env                # Environment variables
│   └── package.json
│
├── docs/                    # Documentation
│   ├── getting-started.md  # Setup guide
│   └── development-guide.md # This file
│
└── package.json            # Root package.json with scripts
```

## Adding Features

### Adding a New UI Component

This project uses [shadcn/ui](https://ui.shadcn.com/). To add a component:

```bash
cd frontend
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add tabs
```

### Adding a New Page Section

1. Create a new component in `frontend/src/components/sections/`:

```tsx
// frontend/src/components/sections/NewSection.tsx
export function NewSection() {
  return (
    <section id="new-section" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">New Section</h2>
        {/* Your content */}
      </div>
    </section>
  );
}
```

2. Import and add to `frontend/src/pages/HomePage.tsx`:

```tsx
import { NewSection } from '@/components/sections/NewSection';

// Add to the component
<NewSection />
```

### Adding a New Project

1. Create a markdown file in `frontend/src/data/projects/`:

```markdown
<!-- frontend/src/data/projects/my-project.md -->
# My Project

Description of your project...
```

2. Add metadata to `frontend/src/data/projects/index.ts`:

```typescript
export const projects = [
  // ... existing projects
  {
    id: 'my-project',
    title: 'My Project',
    description: 'Short description',
    icon: '🚀',
    tags: ['AI', 'Web'],
    date: '2025'
  }
];
```

The project will automatically appear on the Projects page!

### Adding a New API Endpoint

In `backend/src/index.ts`:

```typescript
// GET endpoint
app.get('/api/your-endpoint', (req, res) => {
  res.json({ message: 'Hello from API' });
});

// POST endpoint
app.post('/api/your-endpoint', (req, res) => {
  const data = req.body;
  // Process data
  res.json({ success: true });
});
```

## Styling Guide

### Jamaican Color Theme

The site uses Jamaica's national colors:

```css
/* Gold (Primary) */
--primary: 45 93% 47%

/* Green (Secondary) */
--secondary: 153 100% 31%

/* Black (already in theme) */
```

Usage in components:
```tsx
<Button className="bg-primary hover:bg-primary/90">Gold Button</Button>
<Button className="bg-secondary hover:bg-secondary/90">Green Button</Button>
```

### Tailwind Utilities

Common patterns used in this project:

```tsx
// Gradients
className="bg-gradient-to-r from-primary to-secondary"

// Subtle borders
className="border border-primary/10 hover:border-primary/30"

// Gradient backgrounds
className="bg-gradient-to-br from-primary/5 via-background to-secondary/5"

// Responsive design
className="text-sm md:text-base lg:text-lg"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Modifying Colors

Edit `frontend/src/index.css`:

```css
:root {
  --primary: 45 93% 47%;       /* Change primary color */
  --secondary: 153 100% 31%;   /* Change secondary color */
  --background: 0 0% 100%;     /* Change background */
  /* etc... */
}
```

Colors use HSL format without the `hsl()` wrapper for Tailwind compatibility.

## API Development

### Current Endpoints

- `GET /api/health` - Health check
- `GET /api/events` - Fetch upcoming events

### Adding Database Integration

Example with MongoDB:

```bash
cd backend
npm install mongoose
```

```typescript
// backend/src/index.ts
import mongoose from 'mongoose';

mongoose.connect(process.env.DATABASE_URL!)
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database error:', err));
```

### CORS Configuration

Already configured in `backend/src/index.ts`:

```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'your-domain.com' 
    : 'http://localhost:5173'
}));
```

## Building for Production

### Build Everything

```bash
npm run build
```

This:
1. Builds the React frontend (`frontend/dist/`)
2. Compiles TypeScript backend (`backend/dist/`)

### Test Production Build Locally

```bash
npm start
```

Visit `http://localhost:3000` - the Express server serves both the built frontend and API.

### What Gets Built

**Frontend**: 
- Optimized JavaScript bundles
- Minified CSS
- Optimized images
- Output: `frontend/dist/`

**Backend**:
- TypeScript compiled to JavaScript
- Output: `backend/dist/`

## Deployment

The JAIA website is hosted on **Fly.io** with an always-on configuration to avoid cold starts.

See the **[Deployment Guide](./deployment.md)** for:
- How the site is currently hosted
- Deployment instructions for maintainers
- Custom domain setup
- Monitoring and troubleshooting
- Scaling options

### Quick Deploy Reference

If you have access to the Fly.io organization:

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Deploy updates
flyctl deploy

# View logs
flyctl logs
```

### Environment Variables for Production

Set secrets via Fly.io CLI (never commit them!):

```bash
flyctl secrets set SECRET_NAME=secret_value
```

## Code Style

### TypeScript

- Strict mode enabled
- Use explicit types for function parameters and return values
- Avoid `any` - use `unknown` if type is truly unknown

### React

- Use functional components with hooks
- Prefer named exports over default exports for components
- Use TypeScript interfaces for props

```tsx
interface MyComponentProps {
  title: string;
  count?: number;
}

export function MyComponent({ title, count = 0 }: MyComponentProps) {
  return <div>{title}: {count}</div>;
}
```

### File Naming

- Components: PascalCase (`Hero.tsx`, `ContactForm.tsx`)
- Utilities: camelCase (`utils.ts`, `formatDate.ts`)
- Types: PascalCase (`types.ts` with `interface Project`)

### Code Organization

- Keep components small and focused
- Extract reusable logic into custom hooks
- Use the `lib/` directory for utilities
- Keep API calls in a dedicated service file if needed

## Testing

(Add your testing setup here)

```bash
# Example with Vitest
cd frontend
npm install -D vitest @testing-library/react
```

## Useful Resources

- **[React Docs](https://react.dev/)** - Official React documentation
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - Learn TypeScript
- **[Tailwind CSS Docs](https://tailwindcss.com/docs)** - Tailwind reference
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library docs
- **[Express Guide](https://expressjs.com/en/guide/routing.html)** - Express.js documentation
- **[Vite Guide](https://vitejs.dev/guide/)** - Vite documentation

## Related Documentation

- **[Getting Started Guide](./getting-started.md)** - Setup instructions for beginners
- **[Deployment Guide](./deployment.md)** - How the site is hosted and deployed
- **[Main README](../README.md)** - Project overview

## Need Help?

- 💬 [Open an issue](https://github.com/your-repo/issues)
- 💭 [Join Discord](https://discord.gg/NuVXk7yjNz)
- 📱 [WhatsApp Community](https://chat.whatsapp.com/FFzjagZ0ZxRCCHaNMjJODm)

---

**Happy developing!** 🚀


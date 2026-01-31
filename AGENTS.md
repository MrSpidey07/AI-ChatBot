# AGENTS.md

This file contains guidelines and commands for agentic coding agents working on the Eliora AI chatbot project.

## Project Overview

Eliora AI is a full-stack AI chatbot application with:
- **Frontend**: React 18 + Vite + Tailwind CSS + DaisyUI
- **Backend**: Node.js + Express + MongoDB + Groq AI
- **Architecture**: Monorepo with separate frontend/backend directories

## Build & Development Commands

### Frontend (React/Vite)
```bash
cd frontend
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend (Node.js/Express)
```bash
cd backend
npm run dev          # Start development server with nodemon (http://localhost:5001)
npm start            # Start production server
```

### Testing
Currently no test framework is configured. When adding tests:
- Use Vitest for frontend testing
- Use Jest or Mocha for backend testing
- Single test command should be: `npm test` or `npm run test:unit`

## Code Style Guidelines

### General Principles
- Use ES6+ features consistently (arrow functions, destructuring, async/await)
- Follow functional programming patterns where appropriate
- Keep components and functions small and focused
- Use descriptive variable and function names

### Import Organization
```javascript
// 1. React/Next.js imports
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

// 2. Third-party library imports
import axios from 'axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';

// 3. Local imports (relative paths)
import { Navbar } from './components/Navbar';
import { useAuthStore } from './store/useAuthStore';
import { axiosInstance } from '../lib/axios';
```

### Frontend (React/JSX)
- Use functional components with hooks
- Component files should be PascalCase (e.g., `MessageInput.jsx`)
- Use JSX for React components, not TSX unless TypeScript is added
- Props should be destructured in function signature
- Use Tailwind CSS classes for styling
- DaisyUI components for UI elements

```jsx
// Good component structure
const MessageInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      {/* JSX content */}
    </form>
  );
};
```

### State Management (Zustand)
- Use Zustand for global state
- Store files should be in `frontend/src/store/`
- Follow the pattern: `use[Feature]Store.js`

```javascript
// Zustand store pattern
export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      // API call
      set({ authUser: res.data });
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
```

### Backend (Node.js/Express)
- Use ES6 modules (`import`/`export`)
- Controller files in `backend/src/controller/`
- Route files in `backend/src/routes/`
- Model files in `backend/src/models/`
- Middleware files in `backend/src/middleware/`
- Service files in `backend/src/services/`

```javascript
// Controller pattern
export const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    
    // Validation
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Business logic
    const user = await User.create({ fullname, email, password });
    
    // Response
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Database (MongoDB/Mongoose)
- Use Mongoose schemas with timestamps
- Model files should be singular (e.g., `user.model.js`)
- Use async/await for database operations
- Include proper error handling

```javascript
// Mongoose schema pattern
const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);
```

### Error Handling
- Frontend: Use try-catch with toast notifications
- Backend: Use try-catch with proper HTTP status codes
- Always provide meaningful error messages
- Log errors for debugging

```javascript
// Frontend error handling
try {
  const res = await axiosInstance.post('/auth/login', data);
  set({ authUser: res.data });
  toast.success('Logged in successfully');
} catch (error) {
  toast.error(error.response?.data?.message || 'Login failed');
}

// Backend error handling
try {
  const user = await User.create(userData);
  res.status(201).json({ user });
} catch (error) {
  res.status(500).json({ message: error.message });
}
```

### API Patterns
- RESTful API design
- Use consistent endpoint patterns: `/api/resource`
- Include proper HTTP methods (GET, POST, PUT, DELETE)
- Use JWT for authentication
- Include CORS configuration

### Environment Variables
- Backend: Use `.env` file with `dotenv.config()`
- Frontend: Use `VITE_` prefix for environment variables
- Never commit `.env` files to version control

### File Naming Conventions
- Components: PascalCase (e.g., `MessageInput.jsx`)
- Utilities/Services: camelCase (e.g., `axios.js`, `db.js`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- Files with single export should match the export name

### Linting & Formatting
- Frontend uses ESLint with React plugin
- Run `npm run lint` before committing
- Follow the existing ESLint configuration
- No Prettier is configured - add if needed

### Security Best Practices
- Hash passwords with bcrypt
- Use JWT for authentication
- Validate all inputs
- Use HTTPS in production
- Sanitize user inputs
- Implement rate limiting for APIs

### Performance Considerations
- Use React.memo for expensive components
- Implement lazy loading for large components
- Use debouncing for search inputs
- Optimize bundle size with code splitting
- Use proper caching strategies

## Development Workflow

1. **Before starting**: Check existing code patterns and conventions
2. **During development**: Follow the established patterns above
3. **Before committing**: Run lint commands and test functionality
4. **After changes**: Update documentation if needed

## Common Patterns to Follow

- Authentication flow: Check auth status → Redirect if needed
- API calls: Try → Success → Error handling → Finally
- Component structure: Props → State → Effects → Render
- Error boundaries: Wrap components that might fail
- Loading states: Show loaders during async operations

## Tools & Libraries Used

- **Frontend**: React, Vite, Tailwind CSS, DaisyUI, Zustand, Axios, React Hot Toast
- **Backend**: Express, MongoDB, Mongoose, Groq SDK, Socket.io, JWT, bcrypt
- **Development**: ESLint, Nodemon

## Notes for Agents

- This is a JavaScript/JSX project, not TypeScript
- Both frontend and backend use ES6 modules
- The project uses a monorepo structure with separate package.json files
- Always check existing patterns before making changes
- Focus on maintainability and following established conventions
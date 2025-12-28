# AI Memory - PopKorn Machine Advertising Platform

This file serves as a memory bank for AI assistants working on this project. It contains context, patterns, and guidelines to maintain consistency and accelerate development.

## Project Context

**PopKorn Machine** is an AI Advertising Automation Platform that generates AI-powered advertising campaigns and automates their publication across social media platforms using n8n and ComfyUI.

**Current Status: MVP Functional** ✅
- Frontend fully implemented with Next.js 14 + TypeScript + TailwindCSS
- n8n webhook integration working for campaign creation
- Complete user flow: Form → AI Generation → Preview → Publish
- CORS issues resolved via Next.js API proxy routes

### Core Architecture
```
Frontend (Next.js + TypeScript)
    ↓ API Calls
n8n Webhooks (Orchestration)
    ↓ Workflow Triggers
ComfyUI (Image Generation)
    ↓ Assets
Social Media APIs (Publishing)
```

## Development Patterns

### Code Organization
- **Components**: Place in `src/app/{page}/components/` for page-specific components
- **Services**: All API integrations in `src/services/`
- **Types**: TypeScript definitions in `src/types/`
- **Configuration**: Use `.env.local` for secrets, `config.json` for app config

### Naming Conventions
- **Components**: PascalCase (e.g., `CampaignForm.tsx`)
- **Functions**: camelCase (e.g., `handleFormSubmit`)
- **Types**: PascalCase with descriptive names (e.g., `CampaignRequest`)
- **Files**: kebab-case for pages, PascalCase for components

### State Management
- Use React `useState` for component state
- Keep state as flat as possible
- Use TypeScript interfaces for state objects
- Handle loading/error states consistently

### API Integration
- All external APIs go through service classes
- Use async/await with proper error handling
- Include TypeScript types for all API responses
- Environment variables for URLs and secrets

## Common Patterns

### Component Structure
```typescript
'use client'

import { useState } from 'react'

interface ComponentProps {
  // props interface
}

export function ComponentName({ prop }: ComponentProps) {
  const [state, setState] = useState(initialState)

  // handlers
  const handleAction = () => {
    // implementation
  }

  return (
    // JSX with Tailwind classes
  )
}
```

### Service Class Pattern
```typescript
export class ServiceName {
  static async methodName(params: ParamsType): Promise<ReturnType> {
    // implementation with fetch
  }
}
```

### Error Handling
```typescript
try {
  const result = await serviceCall()
  // success handling
} catch (error) {
  // error handling with user feedback
}
```

## UI/UX Guidelines

### Colors
- Primary: Indigo (`indigo-600`, `indigo-500`)
- Success: Green (`green-600`)
- Error: Red (`red-600`)
- Background: Gray (`gray-50`, `gray-100`)

### Components
- Use `shadow-md` for cards
- Consistent padding: `p-6` for main content
- Buttons: `rounded-md` with hover states
- Forms: Standard HTML inputs with Tailwind styling

### Layout
- Max width: `max-w-4xl` for main content
- Responsive: Mobile-first with `md:` breakpoints
- Spacing: Use Tailwind space utilities consistently

## Configuration Management

### Environment Variables
- `NEXT_PUBLIC_*` for client-side variables
- API URLs and secrets in `.env.local`
- Never commit secrets to git

### App Configuration
- Feature flags and settings in `config.json`
- Platform configurations
- Extensible for future features

## Testing Strategy

### Manual Testing Checklist
- Form validation works
- API calls succeed/fail appropriately
- Loading states display correctly
- Error messages are user-friendly
- Responsive design on mobile/desktop

### Integration Testing
- Test with mock n8n responses
- Verify webhook payload structure
- Check image URL handling

## Future Considerations

### Scalability
- Modular architecture allows easy feature additions
- Service layer can be extended for new APIs
- Component composition supports complex UIs

### Performance
- Lazy loading for heavy components
- Image optimization for generated assets
- Caching strategies for repeated API calls

### Security
- Input validation on all forms
- CORS configuration for webhooks
- Secure handling of API keys

## Quick Reference

### File Structure Index
```
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   └── campaign/
│   │       ├── page.tsx        # Campaign page
│   │       └── components/     # Campaign components
│   ├── services/               # API services
│   ├── types/                  # TypeScript types
│   └── components/             # Shared components (future)
├── config.json                 # App configuration
├── .env.local                  # Environment variables
└── package.json               # Dependencies
```

### Key Dependencies
- `next`: React framework
- `react`: UI library
- `typescript`: Type safety
- `tailwindcss`: Styling

### Important Scripts
- `npm run dev`: Development server
- `npm run build`: Production build
- `npm run lint`: Code quality check

## AI Assistant Guidelines

When working on this project:

1. **Read this file first** for context and patterns
2. **Check existing code** for consistency before adding new features
3. **Follow TypeScript** strictly - no `any` types
4. **Use Tailwind** for all styling - no custom CSS unless necessary
5. **Keep components small** and focused on single responsibilities
6. **Document changes** in CHANGELOG.md
7. **Test thoroughly** - especially API integrations
8. **Maintain modularity** - easy to extend and modify

Remember: This is a production-ready application. Code quality, user experience, and maintainability are paramount.

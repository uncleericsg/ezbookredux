# Vercel Frontend & Backend Deployment Guide

## Overview
This document provides a comprehensive guide for deploying the project as separate frontend and backend services on Vercel. The deployment strategy ensures optimal performance, scalability, and maintainability.

## Prerequisites
- Vercel account
- GitHub repository access
- Node.js installed (v18+)
- Project dependencies installed (`npm install`)

## 1. Project Structure Analysis & Optimization

### Current Structure
The project follows a monorepo structure with:
- Frontend: `src/` directory
- Backend: `server/` directory
- Shared configurations: Root level files

### Recommended Adjustments
1. **Frontend Optimization**
   - Move all frontend-specific configuration to `src/config/`
   - Consolidate frontend environment variables in `src/.env`

2. **Backend Optimization**
   - Move backend-specific configuration to `server/config/`
   - Consolidate backend environment variables in `server/.env`

3. **Shared Resources**
   - Create `shared/` directory for:
     - Common types (`shared/types/`)
     - Utility functions (`shared/utils/`)
     - Constants (`shared/constants/`)

4. **Build Configuration**
   - Maintain separate `vite.config.ts` for frontend
   - Create `server/tsconfig.json` for backend

### Implementation Steps
1. Create new directories:
   ```bash
   mkdir -p src/config server/config shared/{types,utils,constants}
   ```

2. Move existing files:
   ```bash
   mv src/constants/* shared/constants/
   mv src/utils/* shared/utils/
   mv src/types/* shared/types/
   ```

3. Update import paths:
   ```bash
   find src/ server/ -type f -name "*.ts" -exec sed -i 's@src/constants/@shared/constants/@g' {} +
   find src/ server/ -type f -name "*.ts" -exec sed -i 's@src/utils/@shared/utils/@g' {} +
   find src/ server/ -type f -name "*.ts" -exec sed -i 's@src/types/@shared/types/@g' {} +
   ```

4. Update TypeScript configuration:
   ```bash
   echo '{
     "extends": "../tsconfig.json",
     "compilerOptions": {
       "outDir": "./dist",
       "rootDir": "."
     },
     "include": ["**/*"]
   }' > server/tsconfig.json
   ```

5. Update Vite configuration:
   ```bash
   sed -i 's@src/@./src/@g' vite.config.ts
   ```

This reorganization will improve:
- Code maintainability
- Deployment efficiency
- Build process separation
- Environment variable management

## 2. Environment Variables Setup
Create `.env` files for both frontend and backend:

### Frontend `.env`
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Backend `.env`
```env
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
API_PORT=3001
```

## 3. Vercel Configuration

### Frontend Configuration (`vercel.json`)
```json
{
  "build": {
    "env": {
      "VITE_API_BASE_URL": "https://api.yourdomain.com",
      "VITE_SUPABASE_URL": "@supabase-url",
      "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
    }
  },
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Backend Configuration (`vercel.json`)
```json
{
  "build": {
    "env": {
      "DATABASE_URL": "@database-url",
      "JWT_SECRET": "@jwt-secret"
    }
  },
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

## 4. Deployment Strategy

### Frontend Deployment
1. Set up new Vercel project for frontend
2. Connect GitHub repository
3. Configure build settings:
   - Framework: Vite
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Build Command: `npm run build`
4. Add environment variables
5. Deploy

### Backend Deployment
1. Set up new Vercel project for backend
2. Connect GitHub repository
3. Configure build settings:
   - Framework: Node.js
   - Output Directory: `server`
   - Install Command: `npm install`
   - Build Command: `npm run build`
4. Add environment variables
5. Deploy

## 5. Continuous Integration
Set up GitHub Actions for automated deployments:

### Frontend Workflow (`.github/workflows/frontend.yml`)
```yaml
name: Frontend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'src/**'
      - 'public/**'
      - 'vite.config.ts'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_FRONTEND_PROJECT_ID }}
```

### Backend Workflow (`.github/workflows/backend.yml`)
```yaml
name: Backend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'server/**'
      - 'package.json'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_BACKEND_PROJECT_ID }}
```

## 6. Best Practices
1. Use Vercel's environment variable management for sensitive data
2. Implement proper CORS configuration for backend
3. Set up proper caching headers for static assets
4. Use Vercel's edge functions for performance-critical routes
5. Monitor deployments using Vercel's built-in analytics

## 7. Troubleshooting
### Common Issues
1. **CORS Errors**: Ensure proper CORS configuration in backend
2. **Environment Variables**: Verify all required variables are set
3. **Build Failures**: Check Node.js version compatibility
4. **Routing Issues**: Verify Vercel's routing configuration

## 8. Maintenance
1. Regularly update dependencies
2. Monitor performance metrics
3. Implement proper logging
4. Set up alerts for critical failures

## Next Steps
1. Set up Vercel projects
2. Configure environment variables
3. Implement CI/CD pipelines
4. Perform initial deployment
5. Monitor and optimize
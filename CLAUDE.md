# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack database management application with:
- **Frontend**: Angular 19 application (`app/`) with Material UI and Tailwind CSS
- **Backend**: NestJS application (`server/`) with TypeORM and PostgreSQL integration

## Common Development Commands

### Frontend (Angular - app/)
```bash
cd app
npm start              # Start development server
npm run build          # Build for production
npm test               # Run unit tests with Karma
npm run watch          # Build and watch for changes
```

### Backend (NestJS - server/)
```bash
cd server
npm run start:dev      # Start development server with watch mode
npm run build          # Build the application
npm run start:prod     # Start production server
npm run test           # Run unit tests with Jest
npm run test:e2e       # Run end-to-end tests
npm run test:cov       # Run tests with coverage
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

## Architecture Overview

### Backend Architecture
- **Main modules**: Auth, User, UserDb, Database
- **Database connection management**: `UserDbConnectionManager` handles dynamic PostgreSQL connections per user
- **Authentication**: JWT-based auth with Passport strategy
- **Database queries**: Uses TypeORM with custom query builders for database introspection
- **Key services**:
  - `UserDbService`: Manages user database configurations
  - `UserDbConnectionManager`: Handles dynamic database connections with connection pooling
  - `AuthService`: JWT authentication and user management

### Frontend Architecture
- **State management**: Signal-based reactive state with Angular 19
- **UI components**: Angular Material + Tailwind CSS + DaisyUI
- **Routing**: Lazy-loaded routes with guards (`AuthGuard`, `DbConnectionGuard`)
- **Core services**:
  - `Auth`: Authentication state management with JWT handling
  - `UserDb`: Database connection state management
  - `DbUserService`: API communication for database operations

### Key Components
- **Dashboard**: Main database overview and table management
- **AI Generation**: Database schema generation capabilities
- **Settings**: User database connection configuration
- **Authentication**: User login/register flow

## Database Connection Pattern

The application uses a unique pattern where each user can connect to their own PostgreSQL database:
1. Users configure their database connection in `InitConnectionComponent`
2. `UserDbConnectionManager` creates and manages individual DataSource instances
3. All database operations are performed through user-specific connections
4. Connection pooling is implemented with configurable limits

## Guards and Navigation

- **AuthGuard**: Protects routes requiring authentication
- **DbConnectionGuard**: Ensures database connection is established before accessing database features
- Route structure: `/auth` → `/init-connection` → `/dashboard|/ai|/settings`

## Testing

- **Frontend**: Karma + Jasmine for unit tests
- **Backend**: Jest for unit tests and e2e testing
- Test files follow `.spec.ts` naming convention
- E2e tests located in `server/test/`

## Development Notes

- Frontend uses standalone components (Angular 19 pattern)
- Backend uses NestJS decorators and dependency injection
- Database queries are built dynamically using TypeORM query builders
- Error handling includes custom exception filters
- Both applications support hot reload in development mode
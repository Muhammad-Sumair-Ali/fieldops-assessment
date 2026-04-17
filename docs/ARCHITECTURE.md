# FieldOps - Architecture Document

## System Overview
FieldOps is a simplified Field Service Management Platform that helps manage field technicians, job assignments, and client visibility. The system supports three user roles: Admin, Technician, and Client.

The application follows a **monorepo** structure with clear separation between frontend and backend.

## Tech Stack & Justification

**Backend:**
- **NestJS** + TypeScript → Clean architecture, modular design, built-in dependency injection, and excellent TypeScript support. Chosen because it encourages good practices suitable for mid-level+ roles.
- **Prisma ORM** → Type-safe database queries, easy migrations, and excellent developer experience.
- **PostgreSQL** → Reliable relational database with good support for production-like features.
- **JWT Authentication** → Simple yet secure token-based auth for this scope.

**Frontend:**
- **Next.js 16 (App Router)** + TypeScript → Modern React framework with excellent performance, file-based routing, and server-side capabilities.
- **Tailwind CSS** → Rapid and consistent styling.
- **Axios** → Clean API integration with interceptors.

**Why this stack?**
- Full TypeScript end-to-end → Better maintainability and fewer runtime errors.
- Clear separation of concerns (Backend = NestJS, Frontend = Next.js).
- Fast development while maintaining good code quality.
- "I know it well" + strong technical reasons.

## System Design

### High-Level Architecture
- **Frontend** communicates with **Backend API** via REST.
- Authentication handled via JWT tokens stored in localStorage.
- Role-based authorization enforced on both backend (Guards) and frontend (Route Guards).

### Key Components
- **Auth Module**: Login, JWT Strategy, Role Guards
- **Jobs Module**: Job CRUD operations with role restrictions
- **Prisma Service**: Centralized database access

## Database Design

**Main Entities:**
- `User` (id, email, password, name, role)
- `Job` (id, title, description, status, scheduledDate, clientId, technicianId)
- `JobNote` (future scope)

**Key Relationships:**
- One-to-Many: User → Jobs (as client)
- One-to-Many: User → Jobs (as technician)
- Many-to-One: Job → User (client)
- Many-to-One: Job → User (technician)

**Decisions:**
- Used `cuid()` for IDs instead of UUID for better readability.
- Enum for Role and JobStatus for data integrity.

## Authentication Strategy

- JWT-based authentication
- Role-based authorization using custom `RolesGuard`
- Different permissions:
  - Admin: Can create and update jobs
  - Technician: Can only update status of assigned jobs
  - Client: Can only view their own jobs

## What I Deliberately Chose NOT to Build

1. **Job Notes / Activity Timeline**  
   Reason: Time constraint. Focused on core job flow first.

2. **Background Notifications / Email**  
   Reason: Not critical for core functionality. Can be added using BullMQ later.

3. **Pagination & Advanced Filtering**  
   Reason: Kept scope minimal to deliver a working end-to-end flow.

4. **Docker Setup**  
   Reason: Prioritized functionality and documentation over bonus tasks.

## Assumptions Made

- Registration is not needed (seed data + login only)
- No soft deletes implemented
- Simple localStorage for token (not HttpOnly cookies)
- Notifications shown via toast messages
- Same app for all roles (no separate client portal)

## Trade-offs & Limitations

- Used localStorage for JWT → Not the most secure (HttpOnly cookies would be better in production)
- No rate limiting or advanced security
- Error handling can be improved
- No unit tests written due to time limit

## Future Enhancements

- Implement audit logging
- Add job activity timeline
- Background notification queue
- Soft deletes with restore
- Docker + docker-compose
- Proper client-facing portal

---
# FieldOps - Field Service Management Platform

## Overview
A simplified Field Service Management system built as a take-home technical assessment for the **Mid-Level Full-Stack Developer** role at CodesSavvy.

The platform allows Admins to create and manage service jobs, assign them to technicians, and track progress. Technicians can update job status, while Clients can view their requested jobs.

I treated this as a real mini-project by identifying gaps in the brief, making reasonable architectural decisions, and focusing on delivering a complete working flow rather than many half-implemented features.

## Tech Stack

**Backend:**
- NestJS (Node.js + TypeScript) — Chosen for its modular architecture, built-in dependency injection, and excellent TypeScript support.
- Prisma ORM with PostgreSQL — For type-safe database access and easy migrations.
- JWT Authentication with Role-based Guards.

**Frontend:**
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Axios for API communication

**Why this stack?**  
Full TypeScript end-to-end for better developer experience and fewer runtime errors. Clear separation between frontend and backend while keeping development fast.

## Features Implemented

- Full authentication with 3 roles: **Admin**, **Technician**, and **Client**
- Role-based access control (Backend Guards + Frontend Route Protection)
- Admin can create, edit, and re-assign jobs
- Technicians can view assigned jobs and update their status
- Clients can view their own service requests
- Real-time status updates with toast notifications
- Admin dashboard with summary statistics (Total, Draft, Scheduled, In Progress, Completed, Cancelled)
- Job Activity Timeline — Admins and Technicians can view a chronological
  history of status changes and technician assignments for any job,
  displayed in a modal with color-coded status badges and relative timestamps.
- Clean and responsive UI

## Setup Instructions

### Prerequisites
- Node.js 20+
- PostgreSQL

### Backend Setup
```bash
cd backend
cp .env.example .env
# Update DATABASE_URL and JWT_SECRET in .env file
npm install
npx prisma migrate dev
npx prisma generate
npx ts-node src/prisma/seed.ts  
npm run start:dev
```

### Frontend Setup
```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

**Default Login Credentials:**
- **Admin**: `admin@fieldops.com` / `password123`
- **Technician**: `tech@fieldops.com` / `password123`
- **Client**: `client@fieldops.com` / `password123`

## Assumptions & Decisions

- **Roles & Permissions**: Admin has full control over jobs (create, edit, re-assign). Technicians can only update status of jobs assigned to them. Clients have read-only access to their own jobs.
- **Job Re-assignment**: Admin can re-assign a technician even after job creation.
- **Notifications**: Implemented in-app toast notifications for immediate feedback instead of email or webhooks (more practical for this scope and local development).
- **Authentication**: Used JWT stored in localStorage for simplicity. No refresh token implemented due to time constraints.
- **Client View**: Used the same app with role-based routing instead of a completely separate portal (keeps the project simple yet functional).

## Trade-offs & What's Missing

### What I Prioritized
- Delivering a complete, working end-to-end flow (Admin creates job → assigns technician → Technician updates status).
- Strong role-based security on both frontend and backend.
- Clean architecture and good documentation.

### Trade-offs Accepted
- Used `localStorage` for JWT tokens (simpler but less secure than HttpOnly cookies).
- Focused on core functionality instead of many bonus features.
- No real-time updates (WebSockets) — used polling + manual refresh after actions.

### What's Missing

Due to the 6–10 hour suggested time limit, the following were not implemented:
- Audit logging (who changed what and when)
- Pagination and advanced filtering on job lists
- Soft deletes with restore
- Docker + docker-compose setup
- Unit and E2E tests
- Email notifications or background job queue

If given more time, I would prioritize implementing **Docker setup** and **audit logging**.

## Future Improvements
- Implement background notifications using BullMQ
- Add rate limiting and better security
- Soft deletes and proper error handling
- Real-time updates with WebSockets

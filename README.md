# FieldOps - Field Service Management Platform

## Overview
A simplified Field Service Management system built as a take-home assessment for Mid-Level Full-Stack Developer role at CodesSavvy.

It allows Admins to create and manage jobs, assign them to technicians, and lets technicians update job status. Clients can view their jobs.

## Tech Stack

**Backend:**
- NestJS (Node.js + TypeScript)
- Prisma ORM
- PostgreSQL
- JWT Authentication + Role-based Authorization

**Frontend:**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Axios

## Features Implemented

- User authentication (3 roles: Admin, Technician, Client)
- Role-based access control
- Job creation by Admin
- Job assignment & re-assignment
- Job status updates by Technician
- Role-based dashboards
- Protected routes with automatic redirects

## Setup Instructions

### Prerequisites
- Node.js 20+
- PostgreSQL

### 1. Clone the repository
```bash
git clone https://github.com/Muhammad-Sumair-Ali/fieldops-assessment.git

cd fieldops-assessment
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Update DATABASE_URL and JWT_SECRET in .env
npm install
npx prisma migrate dev
npx prisma generate
npm run start:dev
```

### 3. Frontend Setup
```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

### Default Login Credentials
- **Admin**: `admin@fieldops.com` / `password123`
- **Technician**: `tech@fieldops.com` / `password123`
- **Client**: `client@fieldops.com` / `password123`

## Assumptions & Decisions

- Used JWT for authentication with HttpOnly not implemented (simple localStorage for speed)
- Admin can create and update jobs including re-assigning technicians
- Job statuses: DRAFT, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
- In-app notifications simulated via toasts (no email/webhook)
- Chose NestJS + Next.js for type safety and clear separation

## Trade-offs & What's Missing

**Done:**
- Core job flow (Create → Assign → Update Status)
- Role-based protection

**Missing / Could be improved with more time:**
- Job activity timeline / notes
- Proper pagination and filtering
- Audit logging
- Docker setup
- Advanced error handling & input validation
- Client portal improvements

## Future Improvements
- Background job notifications using BullMQ
- Soft deletes
- Rate limiting
- Unit + E2E tests

# Scholarship Matching AI Platform

AI-powered scholarship matching system for students.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI + Wouter (Routing) + TanStack Query (Data Fetching)
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: Replit AI Integrations (OpenAI gpt-5.1) for matching and analysis.

## Key Features
- **Eligibility Scoring**: Users fill out a profile to see matched scholarships.
- **AI Explainability**: Each match includes an AI-generated explanation of why it fits.
- **Document Checklist**: Automated list of required documents for each scholarship.
- **Missed Opportunities Score**: Advanced UI element to show potential scholarships missed.

## File Structure
- `shared/schema.ts`: Database schema and Zod validation.
- `shared/routes.ts`: API contract definitions.
- `server/routes.ts`: Backend API implementation including AI logic.
- `client/src/pages/`: Frontend pages (Home, Eligibility, Results).
- `client/src/components/`: Reusable UI components.
- `server/replit_integrations/`: AI-related utility modules.

## Deployment
The app is ready for deployment via Replit's publishing tool.

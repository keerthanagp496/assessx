# SentinelAssess

Full-stack competitive learning and online assessment platform.

## Stack
- Backend: Java 17, Spring Boot 3, Spring Data JPA, Spring Security, JWT-ready security layer
- Database: H2 development, PostgreSQL-ready properties
- Frontend: React + Vite
- Code execution: Runlet (`https://runlet.codealong.live/execute`)

## Modules
- Student Dashboard
- Proctored Assessments
- Independent Practice Arena
- Real code execution
- Competitions and Leaderboards
- Student Analytics
- Admin Management

## Critical separation
AssessmentQuestion and PracticeQuestion are independent entities.
Assessment submissions and Practice submissions are independent.

## Run
Backend:
```bash
cd backend
mvn spring-boot:run
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Backend runs on port 8080. Frontend runs on the Vite port.

Demo seed users:
- admin@sentinelassess.local / Admin@123
- student@sentinelassess.local / Student@123

Change these credentials before production use.

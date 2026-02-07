# Email Cadence Workflow (Next.js + NestJS + Temporal)

Small monorepo application that demonstrates:

• Creating an email cadence  
• Enrolling a contact into the cadence  
• Executing steps with Temporal workflows  
• Updating cadence while workflow is running  

Built with:

- Next.js (frontend)
- NestJS (API)
- Temporal.io TypeScript SDK (worker)
- pnpm workspaces
- TypeScript only

---

# 🏗 Architecture

web (Next.js)
   ↓
api (NestJS REST)
   ↓
Temporal Server
   ↓
worker (Temporal worker executes steps)

Responsibilities:

- Web → manage cadence JSON + poll status
- API → start workflows, send signals, query state
- Worker → execute steps (wait/email)
- Temporal → durability + orchestration

---

# ✅ Requirements

Install:

- Node 18+ (Node 20 recommended)
- pnpm
- Temporal server

---

# 🚀 Setup

## 1. Clone

git clone <your-repo-url>
cd email-cadence


---

## 2. Install dependencies
```bash
pnpm install
```
---

# 🔐 Environment Variables (IMPORTANT)

Each app uses its own .env file.

Before running, copy the example file:

##### macOS / Linux
```bash
cp .env.example apps/api/.env
cp .env.example apps/worker/.env
cp .env.example apps/web/.env.local
```

##### Windows (PowerShell)
```bash
copy .env.example apps/api/.env
copy .env.example apps/worker/.env
copy .env.example apps/web/.env.local
```

These files configure:
- API port
- Temporal address
- Namespace
- Task queue
- Frontend API URL

You may modify values if needed.


# Start Temporal
```bash
docker compose up -d
```

---

# ▶ Start all apps

pnpm dev

This runs:

- Web → http://localhost:3000
- API → http://localhost:3001
- Worker → background

---

# 🧪 How to test

## Using the UI

1. Open http://localhost:3000
2. Edit cadence JSON
3. Click Enroll
4. Click Poll to see workflow state update


---

## Using API manually

### Create cadence

POST http://localhost:3001/cadences

Body:
```json
{
  "id": "cad_1",
  "name": "Welcome Flow",
  "steps": [
    { "id": "1", "type": "SEND_EMAIL", "subject": "Welcome", "body": "Hello there" },
    { "id": "2", "type": "WAIT", "seconds": 5 },
    { "id": "3", "type": "SEND_EMAIL", "subject": "Follow up", "body": "Checking in" }
  ]
}
```


---

### Start enrollment

POST http://localhost:3001/enrollments

Body:
```json
{
  "cadenceId": "cad_1",
  "contactEmail": "test@test.com"
}
```


Returns:
```json
{ "id": "enrollment-xxxxx" }
```

---

### Check status

GET http://localhost:3001/enrollments/:id

Response:
```json
{
  "currentStepIndex": 1,
  "stepsVersion": 1,
  "status": "RUNNING"
}
```


---

### Update cadence while running

PUT http://localhost:3001/enrollments/:id/cadence

Body:
```json
{
  "steps": [...]
}
```

Workflow continues using new steps.


---

# 📂 Project Structure

```bash
├── web - Next.js frontend
├── api - NestJS REST server
├── worker - Temporal worker
└── shared - shared types
```

---

# 📌 Notes

- Email sending is mocked (console log only)
- No authentication
- In-memory cadence storage (no database required)
- Designed for local development/testing only

---

# 🛠 Useful Commands

Run only API:
```bash
pnpm --filter api start:dev

# Run only worker:
pnpm --filter worker dev

# Run only web:
pnpm --filter web dev

# Run docker and pull images required to local temporal
docker compose up -d
```

---

# ✅ Done

If everything is running correctly:

1. Temporal server running
2. pnpm dev running
3. Enroll a cadence
4. Worker logs show emails
5. UI shows progress

That's it 🎉

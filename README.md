# ⚙️ Bug Tracker — Backend API

Node.js + Express REST API for Bug Tracker application.

## 🌐 Live API
**Render:** `https://bug-tracker-server-1e8u.onrender.com`

> Note: `GET /` returns "Cannot GET /" — this is normal for APIs.
> Test with: `GET /api/auth/me`

---

## ⚙️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | 4 | REST API framework |
| MongoDB Atlas | Cloud | Database |
| Mongoose | 7 | MongoDB ODM |
| jsonwebtoken | 9 | JWT auth tokens |
| bcryptjs | 2 | Password hashing |
| cors | 2 | Cross-origin requests |
| dotenv | 16 | Environment variables |
| nodemon | 3 | Dev auto-restart |

---

## 📁 Folder Structure

```
server/
├── config/
│   └── db.js                 # MongoDB Atlas connection
├── controllers/
│   ├── authController.js     # register, login, getMe, updateProfile, changePassword
│   ├── projectController.js  # createProject, getProjects, updateProject, deleteProject, inviteMember, removeMember
│   ├── ticketController.js   # createTicket, getTickets, updateTicket, deleteTicket
│   ├── commentController.js  # getComments, addComment, deleteComment
│   └── sprintController.js   # getSprints, createSprint, updateSprint, deleteSprint, getSprintTickets
├── middleware/
│   └── authMiddleware.js     # JWT token verification — protects private routes
├── models/
│   ├── User.js               # name, email, password (hashed)
│   ├── Project.js            # title, description, owner, members[]
│   ├── Ticket.js             # title, description, status, priority, type, dueDate, sprint, assignee
│   ├── Comment.js            # text, ticket ref, author ref
│   └── Sprint.js             # name, goal, startDate, endDate, status, project ref
├── routes/
│   ├── authRoutes.js         # /api/auth/*
│   ├── projectRoutes.js      # /api/projects/*
│   ├── ticketRoutes.js       # /api/projects/:projectId/tickets/*
│   ├── commentRoutes.js      # /api/tickets/:ticketId/comments/*
│   └── sprintRoutes.js       # /api/projects/:projectId/sprints/*
├── .env                      # Environment variables (never commit this)
├── .gitignore
├── server.js                 # Entry point
└── package.json
```

---

## 🚀 Local Setup

```bash
# 1. Go to server folder
cd server

# 2. Install dependencies
npm install

# 3. Create .env file
```

Create `server/.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bugtracker
JWT_SECRET=your_super_secret_key_minimum_32_chars
PORT=5000
```

```bash
# 4. Start dev server
npm run dev
# Runs on http://localhost:5000
```

---

## 🗃️ Database Schemas

### User
```js
{
  name:      String (required),
  email:     String (required, unique, lowercase),
  password:  String (required, hashed with bcrypt),
  createdAt: Date
}
```

### Project
```js
{
  title:       String (required),
  description: String,
  owner:       ObjectId → User,
  members:     [ObjectId → User],
  createdAt:   Date
}
```

### Ticket
```js
{
  title:       String (required),
  description: String,
  status:      enum ['todo', 'inprogress', 'done'],
  priority:    enum ['low', 'medium', 'high'],
  type:        enum ['bug', 'feature', 'task'],
  project:     ObjectId → Project,
  assignee:    ObjectId → User,
  createdBy:   ObjectId → User,
  sprint:      ObjectId → Sprint,
  dueDate:     Date,
  order:       Number
}
```

### Comment
```js
{
  text:      String (required),
  ticket:    ObjectId → Ticket,
  author:    ObjectId → User,
  createdAt: Date
}
```

### Sprint
```js
{
  name:      String (required),
  goal:      String,
  project:   ObjectId → Project,
  startDate: Date,
  endDate:   Date,
  status:    enum ['planning', 'active', 'completed']
}
```

---

## 🌐 API Endpoints

### Auth — `/api/auth`
```
POST   /register          → Register new user
POST   /login             → Login, returns JWT token
GET    /me                → Get current user (🔒)
PUT    /profile           → Update name/email (🔒)
PUT    /change-password   → Change password (🔒)
```

### Projects — `/api/projects`
```
GET    /                  → Get all user's projects (🔒)
POST   /                  → Create new project (🔒)
GET    /:id               → Get project by ID (🔒)
PUT    /:id               → Update project (🔒)
DELETE /:id               → Delete project (🔒)
PUT    /:id/invite        → Invite member by email (🔒)
PUT    /:id/remove-member → Remove member (🔒)
```

### Tickets — `/api/projects/:projectId/tickets`
```
GET    /       → Get all tickets in project (🔒)
POST   /       → Create ticket (🔒)
PUT    /:id    → Update ticket (status, priority, etc.) (🔒)
DELETE /:id    → Delete ticket (🔒)
```

### Comments — `/api/tickets/:ticketId/comments`
```
GET    /       → Get all comments on ticket (🔒)
POST   /       → Add comment (🔒)
DELETE /:id    → Delete comment (🔒)
```

### Sprints — `/api/projects/:projectId/sprints`
```
GET    /            → Get all sprints (🔒)
POST   /            → Create sprint (🔒)
PUT    /:id         → Update sprint status (🔒)
DELETE /:id         → Delete sprint (🔒)
GET    /:id/tickets → Get sprint tickets (🔒)
```

> 🔒 = Requires `Authorization: Bearer <token>` header

---

## 🔐 Auth Middleware

Every protected route passes through `authMiddleware.js`:

```js
// How it works:
// 1. Check Authorization header for Bearer token
// 2. Verify JWT token with JWT_SECRET
// 3. Find user in DB by decoded ID
// 4. Attach user to req.user
// 5. Call next() to proceed to controller
```

---

## 🚀 Deploy to Render

### Step 1 — Push to GitHub:
```bash
git add .
git commit -m "backend ready"
git push origin main
```

### Step 2 — Render Settings:
```
Service Type:   Web Service
Root Directory: server
Build Command:  npm install
Start Command:  node server.js
```

### Step 3 — Environment Variables on Render:
```
MONGO_URI   = mongodb+srv://...
JWT_SECRET  = your_secret_key
PORT        = 5000
```

### Step 4 — Deploy!

> First deploy takes 2-3 minutes.
> Free tier spins down after inactivity — first request may take 30 seconds.

---

## 🧪 Test API with Postman

### Register:
```
POST https://bug-tracker-server-1e8u.onrender.com/api/auth/register
Body (JSON):
{
  "name": "Test User",
  "email": "test@test.com",
  "password": "123456"
}
```

### Login:
```
POST https://bug-tracker-server-1e8u.onrender.com/api/auth/login
Body (JSON):
{
  "email": "test@test.com",
  "password": "123456"
}
```

### Get My Profile (with token):
```
GET https://bug-tracker-server-1e8u.onrender.com/api/auth/me
Headers:
Authorization: Bearer <your_token_here>
```

---

## 📦 package.json scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev":   "nodemon server.js"
  }
}
```

---

## 👩‍💻 Built By
**Shishanki Vishwakarma** — MERN Stack Internship Project

# MiniTrelloApp-NguyenDinhKhanh

MiniTrelloApp-NguyenDinhKhanh is a full-stack Trello-style project management application developed with modern technologies including React, Node.js, Firebase, and GitHub OAuth. The app supports real-time collaboration, task tracking, and GitHub integration, making it ideal for teams working on agile projects.

---

## Features

* **Multi-method authentication**: via email verification (with Firebase) and GitHub OAuth.
* **Board management**: create and organize multiple project boards.
* **Card and task tracking**: nested structure allows organizing tasks within cards and boards.
* **Team collaboration**: assign users to tasks and monitor their workload.
* **Real-time updates**: Socket.IO ensures all clients are synchronized instantly.
* **Drag and Drop**: intuitive task management across Icebox, Doing, and Done columns.
* **GitHub Integration**: attach pull requests, issues, and commits directly to tasks.
* **Responsive UI**: optimized for both desktop and mobile experiences.

---

## Tech Stack

### Frontend

* React + Vite
* Tailwind CSS
* React Router DOM
* React DnD (drag-and-drop support)

### Backend

* Node.js + Express
* Firebase Firestore (NoSQL DB)
* Firebase Admin SDK (email verification & user management)
* JSON Web Token (JWT) authentication
* GitHub OAuth (third-party login)
* Socket.IO (real-time messaging)

---

## Getting Started

### Prerequisites

* Node.js >= 16
* Firebase project with Firestore & service account key
* GitHub OAuth App

### Environment Variables (create `backend/.env`):

.env
PORT=3001
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3001/auth/github/callback


### Installation

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## GitHub OAuth Setup

1. Go to [https://github.com/settings/developers](https://github.com/settings/developers) → New OAuth App
2. Fill out:

   * Application name: `MiniTrelloApp`
   * Homepage URL: `http://localhost:5173`
   * Authorization callback URL:

     ```
     http://localhost:3001/auth/github/callback
     ```
3. Copy Client ID and Client Secret to your `.env`

---

## Folder Structure

```
MiniTrelloApp-NguyenDinhKhanh/
├── backend/
│   ├── routes/          # API routes
│   ├── controllers/     # Logic handlers (optional)
│   ├── firebase/        # Firebase config and admin
│   ├── utils/           # Email & GitHub helpers
│   └── server.js        # Express + Socket.IO entry point
├── frontend/
│   ├── components/      # Reusable UI elements
│   ├── pages/           # Views and screens
│   ├── hooks/           # Custom React hooks
│   └── main.jsx         # Entry point
├── .env                 # Environment config
└── README.md            # Project documentation
```

---

## License

This project is licensed under the MIT License. Created and maintained by Nguyen Dinh Khanh, 2025.
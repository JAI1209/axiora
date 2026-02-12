# Axiora

<img width="1277" height="903" alt="image" src="https://github.com/user-attachments/assets/48064dcb-ecea-4b79-ac79-29c35abbccc6" />
<img width="751" height="628" alt="image" src="https://github.com/user-attachments/assets/01817527-40fb-427e-a6b3-2d9deda5aa28" />

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?style=flat&logo=node.js&logoColor=white)
![Electron](https://img.shields.io/badge/electron-31.x-47848F?style=flat&logo=electron&logoColor=white)
![MongoDB](https://img.shields.io/badge/mongodb-8.x-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/jwt-auth-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-0A0A0A?style=flat)

Production-grade hybrid authentication stack for the Axiora Electron app with a Node.js + Express backend and MongoDB.

## Overview

Axiora is a secure, multi-user desktop app with a modular backend API and an Electron frontend. It ships with JWT authentication, refresh token rotation, encrypted local token storage, and strict data isolation per user.

If you have ideas to improve the product, the UX, or the architecture, you are welcome to share them and contribute.

## Architecture

- Electron frontend with `contextIsolation: true` and `nodeIntegration: false`
- Backend API with Express + Mongoose
- JWT auth with refresh token rotation
- Encrypted local token storage via `electron-store`
- Multi-user task isolation enforced server-side

## Repository Structure

```
backend/
  config/db.js
  middleware/
    authMiddleware.js
    errorHandler.js
  models/
    Task.js
    User.js
  routes/
    auth.js
    tasks.js
  server.js
  package.json
  .env.example

electron/
  apiService.js
  authService.js
  main.js
  preload.js
  renderer.js
  secureStore.js
  login.html
  register.html
  index.html
  styles.css
  package.json
  .env.example
```

## Backend Setup

1. Install dependencies:

```
cd backend
npm install
```

2. Create `.env` from example:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/axiora
JWT_SECRET=replace_with_a_strong_secret
JWT_REFRESH_SECRET=replace_with_another_strong_secret
```

3. Run the server:

```
npm start
```

### API Endpoints

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/profile`

Tasks (protected):
- `POST /api/tasks`
- `GET /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Electron Setup

1. Install dependencies:

```
cd electron
npm install
```

2. Optional: set API base URL (defaults to `http://localhost:5000`):

```
AXIORA_API_BASE_URL=http://localhost:5000
```

3. Run the Electron app:

```
npm start
```

## Security Notes

- Access tokens are short-lived (15m) and refreshed with rotating refresh tokens (30d).
- Refresh tokens are hashed in MongoDB; only encrypted tokens are stored locally.
- Logout invalidates refresh tokens server-side.

## Production Notes

- Set `AXIORA_STORE_KEY` for encrypted token storage in production builds.
- Use TLS for API traffic in production.

## Contributing

Contributions are welcome. If you have ideas, improvements, or bug fixes, open an issue or submit a pull request.

Suggested contribution areas:
- UX improvements and accessibility
- Security hardening and token lifecycle
- Task workflows and productivity features
- Performance and reliability improvements

Please keep changes focused and add brief notes in your PR describing the motivation and any tradeoffs.

## License

MIT

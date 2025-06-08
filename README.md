# KYC Management Application

A full-stack web application for managing user KYC (Know Your Customer) profiles with **Role-Based Access Control (RBAC)**.
This app supports two roles:

- **User**: View/edit their own profile and KYC information.
- **Officer**: View all profiles, review and approve/reject user KYC.

---

## 🚀 Tech Stack

### Frontend

- React v18 + TypeScript
- Tailwind CSS
- Ant Design
- Redux Toolkit
- React Router v6
- React Hook Form
- Vite

### Backend

- NestJS (Node.js framework)
- REST APIs for auth, profile, and KYC
- Role-Based Guards
- PostgreSQL

---

## 📦 Folder Structure

```bash
.
├── FrontEnd/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── utils/
│   │   └── App.tsx
│   └── Dockerfile
├── BackEnd/                 # NestJS backend
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── kyc/
│   │   ├── common/
│   │   └── main.ts
│   └── Dockerfile
└── docker-compose.yml
```

## Development

- Via docker

* If you make changes to the code and want to rebuild the containers, use the `--build` flag:

```bash
docker compose up --build
```

The app will be available at:

Frontend: http://localhost:3000

Backend: http://localhost:8080

- To view container logs, use:

```bash
docker compose logs -f
```

## Troubleshooting

- If ports `3000` or `8080` are already in use, you may need to stop the services using those ports or adjust the ports to the other port

- Ensure Docker and Docker Compose are installed and running correctly.

## Conclusion

This README file provides basic steps to run the full MVP Portal project using Docker and Docker Compose. Make sure to follow the instructions carefully, and you should have both the frontend and backend services running locally.

## Deploy Links

https://kyc-seven-xi.vercel.app/

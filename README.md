# 🎬 MovieTix - BookMyShow Clone

A full-stack movie ticket booking platform built with modern web technologies, showcasing enterprise-level architecture and scalability patterns.

## 🪄 How to view the demo:
This project is hosted on Render, so you need to access both the backend and the frontend from the provided URLs to wake the server up. This is a one time process and the server will be awake for 15 minutes from the moment of no activity.

###Backend - (https://movietix-2dsj.onrender.com/api)
###Frontend - (https://movietix-frontend-7xd2.onrender.com)

Please wait a while for Render to finish initializing the server before you can access the application from the frontend link

## 🏗️ Architecture

This is a **monorepo** managed by **Turborepo** with the following structure:

```
movietix/
├── apps/
│   ├── frontend/          # Next.js 14 (App Router)
│   └── backend/           # NestJS REST API
├── packages/
│   └── database/          # Shared Prisma Schema & Client
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Zustand** - State management
- **React Query** - Server state management
- **Framer Motion** - Animations

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Relational database
- **TypeScript** - Type safety

### Infrastructure
- **Turborepo** - Monorepo build system
- **Railway** - Deployment platform
- **pnpm** - Package manager

## 🚀 Features

- 🎥 Movie listings with filters (genre, language, city)
- 🎭 Theater and show time selection
- 💺 Interactive seat selection with real-time availability
- 🔒 Seat locking mechanism (10-minute hold)
- 💳 Mock payment gateway
- 🎫 Digital ticket generation with QR codes
- 📱 Responsive design (mobile-first)
- ⚡ Real-time seat updates

## 📋 Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL database

## 🏃 Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd movietix

# Install dependencies
pnpm install
```

### 2. Setup Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Update with your PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/movietix"
```

### 3. Setup Database

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed with sample data
pnpm db:seed

# (Optional) Open Prisma Studio
pnpm db:studio
```

### 4. Run Development Servers

```bash
# Run both frontend and backend
pnpm dev

# Or run individually
pnpm dev:frontend  # Next.js on http://localhost:3000
pnpm dev:backend   # NestJS on http://localhost:3001
```

## 📦 Project Structure

```
movietix/
├── apps/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── app/              # Next.js pages (App Router)
│   │   │   ├── components/       # React components
│   │   │   ├── lib/              # Utilities & API clients
│   │   │   ├── store/            # Zustand stores
│   │   │   └── types/            # TypeScript types
│   │   └── package.json
│   │
│   └── backend/
│       ├── src/
│       │   ├── movies/           # Movies module
│       │   ├── theaters/         # Theaters module
│       │   ├── shows/            # Shows module
│       │   ├── bookings/         # Bookings module
│       │   ├── seats/            # Seats module
│       │   ├── database/         # Prisma service
│       │   └── main.ts           # Entry point
│       └── package.json
│
└── packages/
    └── database/
        ├── prisma/
        │   ├── schema.prisma     # Database schema
        │   └── seed.ts           # Seed data
        └── src/
            └── index.ts          # Prisma client export
```

## 🎯 Key Technical Implementations

### 1. Seat Locking Mechanism
Prevents double-booking with temporary seat locks that expire after 10 minutes.

### 2. Real-time Seat Updates
Polling mechanism updates seat availability every 5 seconds during booking.

### 3. Type-Safe API Communication
Shared Prisma types ensure consistency between frontend and backend.

### 4. Modular Architecture
NestJS modules can be extracted into microservices for horizontal scaling.

## 🚢 Deployment

### Railway Deployment

1. **Create Railway Project**
   - Connect GitHub repository
   - Add PostgreSQL database
   - Create two services: Backend and Frontend

2. **Backend Service**
   ```
   Root Directory: /apps/backend
   Build Command: pnpm install && pnpm --filter @movietix/database db:generate && pnpm --filter backend build
   Start Command: pnpm --filter backend start:prod
   Port: 3001
   ```

3. **Frontend Service**
   ```
   Root Directory: /apps/frontend
   Build Command: pnpm install && pnpm --filter frontend build
   Start Command: pnpm --filter frontend start
   Port: 3000
   Environment: NEXT_PUBLIC_API_URL=<backend-url>
   ```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run all apps in dev mode |
| `pnpm dev:frontend` | Run only frontend |
| `pnpm dev:backend` | Run only backend |
| `pnpm build` | Build all apps |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:seed` | Seed database with sample data |
| `pnpm db:studio` | Open Prisma Studio |

## 🎨 Design Decisions

### Why NestJS over Next.js API Routes?
- **Scalability**: Microservices-ready architecture
- **Structure**: Enforced patterns (modules, DI, decorators)
- **Testing**: Built-in testing infrastructure
- **Enterprise**: Industry standard for large-scale applications

### Why PostgreSQL?
- **ACID compliance**: Critical for booking transactions
- **Relations**: Complex queries for movies, theaters, shows
- **Data integrity**: Foreign keys and constraints

### Why Turborepo?
- **Monorepo orchestration**: Efficient builds and caching
- **Shared code**: Database package used by both apps
- **Industry standard**: Used by Vercel, major companies

## 🔒 Security Considerations

- Input validation with class-validator (NestJS)
- SQL injection prevention (Prisma parameterized queries)
- Rate limiting with @nestjs/throttler
- CORS configuration for production
- Environment variable management

## 🎯 Future Enhancements

- [ ] WebSocket integration for real-time updates
- [ ] User authentication (NextAuth.js)
- [ ] Email confirmation with tickets
- [ ] Admin dashboard
- [ ] Payment gateway integration
- [ ] Review and rating system
- [ ] Redis caching layer
- [ ] CI/CD pipeline with GitHub Actions

## 📄 License

MIT

## 👤 Author

Built by [Your Name] as a demonstration of full-stack development capabilities.

---

**⭐ If you found this project helpful, please consider giving it a star!**



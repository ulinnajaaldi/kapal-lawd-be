# Kapal Lawd Articles API

A NestJS-based RESTful API for an articles platform with user authentication, article management, comments, and likes functionality.

## Project Structure

This project follows a modular architecture with the following structure:

```
src/
├── app/                    # Main application module
├── articles/              # Article management module
│   ├── dto/              # Data Transfer Objects
│   ├── entities/         # TypeORM entities
│   └── *.service.ts      # Business logic
├── auth/                 # Authentication & authorization
│   ├── decorators/       # Custom decorators
│   ├── dto/             # Auth DTOs
│   └── guards/          # JWT guards and strategies
├── comments/            # Comments management
├── users/               # User management
├── common/              # Shared utilities
│   ├── dto/            # Common DTOs
│   └── filters/        # Exception filters
└── config/             # Configuration files
```

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose
- **Package Manager**: pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm
- PostgreSQL (if running locally)
- Docker & Docker Compose (for containerized setup)

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=kapal_lawd_articles

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Application
PORT=3005
NODE_ENV=development
```

## Running the Project

### Option 1: Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd kapal-lawd-be
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up PostgreSQL database**
   - Install PostgreSQL locally
   - Create a database named `kapal_lawd_articles`
   - Update database credentials in `.env`

4. **Run database migrations** (if any)

   ```bash
   # TypeORM will auto-sync in development mode
   ```

5. **Start the development server**
   ```bash
   pnpm run start:dev
   ```

The API will be available at `http://localhost:3005`

### Option 2: Using Docker

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd kapal-lawd-be
   ```

2. **Run with Docker Compose**

   ```bash
   # Start all services (app + database + pgadmin)
   pnpm run docker:prod

   # Or build and start
   pnpm run docker:prod:build

   # Stop all services
   pnpm run docker:prod:down
   ```

**Services URLs:**

- API: `http://localhost:3005`
- PgAdmin: `http://localhost:8080` (admin@example.com / admin123)
- PostgreSQL: `localhost:5432`

## API Documentation

Once the server is running, you can access:

- **Swagger UI**: `http://localhost:3005/api/docs`
- **API JSON**: `http://localhost:3005/api/v1`

## Available Scripts

```bash
# Development
pnpm run start:dev      # Start in development mode
pnpm run start:debug    # Start in debug mode

# Production
pnpm run build          # Build the application
pnpm run start:prod     # Start in production mode

# Code Quality
pnpm run lint           # Run ESLint
pnpm run format         # Format code with Prettier

# Docker
pnpm run docker:prod           # Start with Docker Compose
pnpm run docker:prod:build     # Build and start with Docker Compose
pnpm run docker:prod:down      # Stop Docker services
```

## Database Schema

The application uses the following main entities:

- **Users**: User accounts and profiles
- **Articles**: Blog posts/articles with metadata
- **Comments**: Comments on articles
- **Likes**: Article likes/reactions

## Authentication

The API uses JWT-based authentication:

1. Register or login to get a JWT token
2. Include the token in the `Authorization` header: `Bearer <token>`
3. Protected routes require valid JWT tokens

## API Documentation

For detailed API endpoint documentation, see [docs/api.md](docs/api.md)

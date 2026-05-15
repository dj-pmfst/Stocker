# Internship Cup - Stocker

A full-stack inventory/stock management web application built with a TypeScript monorepo architecture.

 **Live demo:** [stocker-coral.vercel.app](https://stocker-coral.vercel.app)

## Overview
 
Stocker is a real-time warehouse and stock management app designed for cafés, bars, restaurants, and small shops. It bridges the gap between the stockroom and the point of sale — tracking what's in storage, what's behind the bar, and what's running low, all in one place.
 
Stocker offers a simple, fast UI built for non-technical users: owners, managers, bartenders, and warehouse staff.
 
## Features
 
###  Inventory Tracking
- Real-time stock levels 
- Product location tracking (zone and shelf)
- Price tracking per product
  
###  Warehouse - Bar Sync
- When a product is sold, bar stock decreases accordingly
  
###  Alerts
- **Red** — product is out of stock
- Dashboard highlights what's missing

###  User Roles
- **Admin** — full access to all features, reports, and settings
- **Worker** — can log stock movements and view current levels

###  Dashboard
- Overview of total warehouse status
- Quick summary of low/out-of-stock items
- Order recommendation list

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | TypeScript, React, CSS |
| Backend | Node.js, TypeScript, Express |
| Database | PostgreSQL 16 |
| Monorepo | Turborepo, npm workspaces |
| Containerization | Docker, Docker Compose |
| Auth | JWT |

## Project Structure

```
Stocker/
├── frontend/          # React TypeScript app
├── backend/           # Node.js REST API
├── docker-compose.yml         # Development stack
├── docker-compose.prod.yml    # Production stack
├── turbo.json                 # Turborepo config
└── .env.example               # Environment variable template
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (with npm 11+)
- [Docker](https://www.docker.com/) and Docker Compose

### Local Development (Docker)

1. Clone the repository:
   ```bash
   git clone https://github.com/dj-pmfst/Stocker.git
   cd Stocker
   ```

2. Copy and configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your own values 

3. Start all services:
   ```bash
   docker compose up --build
   ```

   This will spin up:
   - **PostgreSQL** on port `5432`
   - **Backend API** on port `3000`
   - **Frontend** on port `80`

### Local Development (without Docker)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start both frontend and backend in watch mode via Turborepo:
   ```bash
   npm run dev
   ```

   - Frontend dev server: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=changeme
POSTGRES_DB=mydb

SEED_ADMIN_PASSWORD=Admin1234!
SEED_USER_PASSWORD=User1234!

ALLOWED_ORIGINS=http://localhost:5173,http://localhost:80

JWT_SECRET=changeme
JWT_EXPIRES_IN=7d
```

## Production Deployment

Use the production Docker Compose file:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

## Authentication

The app uses JWT-based authentication. On first run, the database is seeded with an admin user and a regular user using the passwords defined in your `.env` file (`SEED_ADMIN_PASSWORD` and `SEED_USER_PASSWORD`).

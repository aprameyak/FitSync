# FitSync

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white&style=for-the-badge)
![NextAuth](https://img.shields.io/badge/NextAuth-000000?logo=nextauth&logoColor=white&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)

## About

**FitSync** is a modern fitness tracking application built with Next.js that helps users achieve their fitness goals through a simple and intuitive interface. Users can authenticate securely via **NextAuth.js**, manage personalized fitness profiles, track nutrition and activities, and receive AI-powered guidance from a **Gemini-powered chatbot**.

The app calculates **Basal Metabolic Rate (BMR)** and monitors calories consumed and burned for smarter diet and training decisions. It also supports **progressive overload** tracking, allowing users to log weights and repetitions to monitor strength development.

## Features

- **Secure Authentication**: NextAuth.js with email/password authentication
- **BMR Calculation**: Personalized metabolic rate estimation
- **Progressive Overload Tracking**: Log and monitor weight training progress
- **Nutrition & Activity Logging**: Track calories consumed and burned
- **AI-Powered Coach**: Get fitness and diet guidance using Google Gemini
- **Real-Time Sync**: Seamless updates across nutrition, fitness, and goals
- **Protected Routes**: Middleware-based route protection

## Technology Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: Google Gemini API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google Gemini API key (optional, for AI features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FitSync
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/fitsync"
DIRECT_DATABASE_URL="postgresql://username:password@localhost:5432/fitsync"

# Google Gemini API (optional)
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key-here
```

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Authentication

The app now requires users to sign up or sign in before accessing any features:

- **Sign Up**: Create a new account with email and password
- **Sign In**: Authenticate with existing credentials
- **Protected Routes**: All main app routes are protected by authentication middleware
- **Session Management**: Automatic session handling with NextAuth.js

### Database Schema

The app uses PostgreSQL with the following main models:
- **User**: Authentication and profile data
- **Workout**: Exercise sessions and routines
- **Exercise**: Individual exercises and movements
- **Nutrition**: Food and calorie tracking
- **Goal**: Fitness and nutrition goals
- **Progress**: Progress tracking and metrics

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

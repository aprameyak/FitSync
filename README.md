# FitSync - Modern Fitness Tracking App

A comprehensive fitness tracking application built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. Features include workout tracking, nutrition logging, progress monitoring, and an AI-powered fitness coach.

## Features

- 🔐 **Secure Authentication** - JWT-based authentication with NextAuth.js
- 💪 **Workout Tracking** - Log workouts, track exercises, and monitor progress
- 🍎 **Nutrition Logging** - Track daily nutrition and calorie intake
- 📊 **Progress Monitoring** - Visual progress tracking with charts and analytics
- 🤖 **AI Coach** - Personalized fitness advice powered by Google Gemini AI
- 📱 **Responsive Design** - Modern UI that works on all devices
- 🚀 **Modern Stack** - Built with Next.js 15, TypeScript, and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Authentication**: NextAuth.js
- **AI**: Google Gemini 2.5 Flash
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- Google Gemini API key

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fitsync"
DIRECT_DATABASE_URL="postgresql://username:password@localhost:5432/fitsync"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Gemini AI
GEMINI_API_KEY="your-gemini-api-key-here"

# CORS (for backend if separated)
CORS_ORIGIN="http://localhost:3000,https://your-domain.com"
```

### Getting API Keys

1. **Google Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your environment variables

2. **Database Setup**:
   - Use [Neon](https://neon.tech) for PostgreSQL hosting
   - Get your connection string and add it to environment variables

3. **NextAuth Secret**:
   - Generate a random string: `openssl rand -base64 32`
   - Add it to your environment variables

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd FitSyncOld
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

1. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

2. **Push schema to database**:
   ```bash
   npx prisma db push
   ```

3. **View database (optional)**:
   ```bash
   npx prisma studio
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
FitSyncOld/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── chat/              # AI chat page
│   ├── dashboard/         # User dashboard
│   ├── sign-in/           # Sign in page
│   ├── sign-up/           # Sign up page
│   └── ...
├── components/            # React components
│   ├── chat/             # Chat interface components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client
│   └── gemini.ts         # Gemini AI integration
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## Authentication Flow

1. **Sign Up**: Users create an account with email and password
2. **Sign In**: Users authenticate with their credentials
3. **Protected Routes**: Dashboard and chat require authentication
4. **Session Management**: NextAuth.js handles session persistence

## AI Coach Features

- **Personalized Advice**: AI provides fitness advice based on user context
- **Workout Recommendations**: Get personalized workout plans
- **Nutrition Guidance**: Receive nutrition tips and meal suggestions
- **Progress Analysis**: AI analyzes your progress and provides insights

## Deployment

### Vercel Deployment

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `DATABASE_URL` - Production database connection
- `DIRECT_DATABASE_URL` - Direct database connection for Prisma
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - Production NextAuth secret
- `GEMINI_API_KEY` - Your Gemini API key

## Security Features

- **Password Hashing**: bcrypt.js for secure password storage
- **JWT Tokens**: Secure session management
- **Protected Routes**: Middleware protection for sensitive pages
- **Environment Variables**: Secure configuration management
- **CORS Protection**: Cross-origin request protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

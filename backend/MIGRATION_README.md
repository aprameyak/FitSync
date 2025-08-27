# Migration Guide: MongoDB to Neon PostgreSQL with Prisma

## Overview
This project has been migrated from MongoDB with Mongoose to Neon PostgreSQL with Prisma.

## Key Changes Made

### 1. Database Schema Changes
- **User Model**: Now uses `id` (cuid) instead of `_id` (ObjectId)
- **Profile Model**: Added `activityLevel` and `goal` fields
- **Fitness Model**: Changed from exercise-specific fields to generic `type`, `duration`, `calories`
- **Nutrition Model**: Enhanced with `protein`, `carbs`, `fat`, `fiber` fields
- **Calories Model**: Now tracks `consumed`, `burned`, `net`, `goal` per date
- **Media Model**: Enhanced with `type`, `url`, `title`, `description`
- **Lift Model**: Changed to `sets`, `reps`, `weight` structure

### 2. API Changes
- All IDs are now strings (cuid) instead of ObjectIds
- Added new endpoints for statistics and personal records
- Enhanced filtering and date range queries
- Better error handling and validation

### 3. Environment Variables
Replace your existing `.env` file with:
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set up Neon PostgreSQL Database
1. Create a Neon account at https://neon.tech
2. Create a new project
3. Copy the connection string to your `.env` file

### 3. Initialize Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations (recommended for production)
npm run db:migrate
```

### 4. Start the Server
```bash
# Development
npm run dev

# Production
npm start
```

## New API Endpoints

### Fitness
- `GET /api/fitness/user/:userId/stats` - Get fitness statistics

### Nutrition
- `GET /api/nutrition/user/:userId/stats` - Get nutrition statistics

### Calories
- `GET /api/calories/user/:userId/stats` - Get calories statistics

### Media
- `GET /api/media/user/:userId/stats` - Get media statistics

### Lifts
- `GET /api/lift/user/:userId/stats` - Get lift statistics
- `GET /api/lift/user/:userId/records` - Get personal records

## Data Migration Notes
- Existing MongoDB data will need to be migrated manually
- Consider creating a migration script if you have existing data
- Test thoroughly with your frontend application

## Benefits of This Migration
1. **Better Performance**: PostgreSQL is generally faster for complex queries
2. **ACID Compliance**: Full transaction support
3. **Type Safety**: Prisma provides excellent TypeScript support
4. **Better Relationships**: Proper foreign key constraints
5. **Scalability**: Neon provides serverless PostgreSQL
6. **Cost Effective**: Neon's generous free tier

## Troubleshooting
- Ensure your `DATABASE_URL` is correct and includes SSL mode
- Check that all environment variables are set
- Verify Prisma client is generated: `npm run db:generate`
- Use Prisma Studio for database inspection: `npm run db:studio`

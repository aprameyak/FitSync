# FitSync

![MERN](https://img.shields.io/badge/MERN%20Stack-3C873A?logo=mongodb&logoColor=white&style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge)
![OpenAI GPT](https://img.shields.io/badge/OpenAI%20GPT-412991?logo=openai&logoColor=white&style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white&style=for-the-badge)

## About

**FitSync** is a MERN stack application that helps users achieve their fitness goals through a simple and intuitive interface. Users can authenticate securely via **JWT**, manage personalized fitness profiles, track nutrition and activities, and receive AI-powered guidance from a **GPT chatbot**.

The app calculates **Basal Metabolic Rate (BMR)** and monitors calories consumed and burned for smarter diet and training decisions. It also supports **progressive overload** tracking, allowing users to log weights and repetitions to monitor strength development.

## Features

- **Secure Authentication**: JWT-based authentication system
- **BMR Calculation**: Personalized metabolic rate estimation
- **Progressive Overload Tracking**: Log and monitor weight training progress
- **Nutrition & Activity Logging**: Track calories consumed and burned
- **AI-Powered GPT Coach**: Get fitness and diet guidance using OpenAI GPT
- **Real-Time Sync**: Seamless updates across nutrition, fitness, and goals

## Technology Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: Custom JWT Implementation
- **AI Integration**: OpenAI GPT (chatbot functionality)
- **Deployment**: Vercel (Frontend), Render (Backend)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- OpenAI API key

### Environment Variables

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=your_backend_url
```

#### Backend (.env)
```
NODE_ENV=development
PORT=5000
ATLAS_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fitsync.git
cd fitsync
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env` in the backend directory
- Copy `.env.local.example` to `.env.local` in the frontend directory
- Fill in the required environment variables

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd ../frontend
npm run dev
```

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the environment variables in Vercel dashboard
4. Deploy!

### Backend (Render)
1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your repository
4. Set the environment variables
5. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

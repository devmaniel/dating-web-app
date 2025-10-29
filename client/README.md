# Dating Web App - Development Checklist

A modern dating application built with React, TypeScript, and Vite. This document serves as a checklist to track the implementation progress of all required features.

## Table of Contents

- [Features Checklist](#features-checklist)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Building for Production](#building-for-production)

## Features Checklist

### 1. User Registration & Login

**New User Sign-Up (Web App)**
- [x] Register using email
- [x] Enter name, age, short bio (text), and upload a profile picture

**Returning User Login**
- [x] Secure login with email and password

### 2. User Profile Management

- [x] View your profile in the browser
- [x] Edit details: name, bio, profile photo

### 3. User Discovery & Matching

- [x] Browse profiles via desktop interface
- [x] Swipe (drag) right to like, left to skip
- [x] Form a match when both users like each other
- [x] Avoid showing the same profile again

**Filters (Optional/Bonus)**
- [x] Age filter
- [x] Distance filter

### 4. Messaging / Chat

- [x] Chat unlocked only after matching
- [x] Send and receive text messages

### 5. Match List

- [x] Display all current matches

**Optional/Bonus**
- [x] Allow users to unmatch (removes chat access)

### 6. Bonus Features

**Optional/Bonus**
- [x] Browser-based push notification simulation for new matches/messages
- [x] Light/dark mode UI toggle

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **Routing**: TanStack Router
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **UI Components**: Radix UI, Lucide React Icons

## Project Structure

```
src/
├── features/          # Feature-based modules
│   ├── auth/          # Authentication components
│   ├── chats/         # Messaging functionality
│   ├── match/         # Matching system
│   ├── onboarding/    # User onboarding flow
│   ├── profile/       # Profile management
│   ├── sign-in/       # Sign in components
│   └── sign-up/       # Sign up components
├── routes/            # Application routes
├── shared/            # Shared components and utilities
├── api/               # API integration layer
└── lib/               # Utility libraries
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the client directory:
   ```bash
   cd dating-web-app/client
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

## Development

- Run development server: `npm run dev`
- Lint code: `npm run lint`
- Preview production build: `npm run preview`

## Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
# Example environment variables
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Dating App
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.

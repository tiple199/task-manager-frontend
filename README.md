# Task Manager Frontend

A production-ready Next.js 14 frontend for the Task Manager Application.

## Key Technologies
- **Framework**: Next.js 14 App Router, React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (Client Auth State), React Query (Server State Tracking)
- **Forms & Validation**: React Hook Form + Zod
- **API Client**: Axios

## Prerequisites
- Node.js 18+
- Backend running on `http://localhost:3000`

## How to Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   *Note: Next.js by default runs on port 3000. However, to avoid conflicts with your local backend, we have configured `npm run dev` to start the frontend on **port 3001**.*

3. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Integration Notes
- **JWT Handling**: The frontend stores both Access Token and Refresh Token in `localStorage`. There is an Axios mechanism intercepting `401` errors, which will automatically call `POST /api/refresh-token` and retry your previous failed requests.
- **Login Response Shape**: This application actively handles the nested token path `res.data.accessToken.refreshToken` based on the backend contract.
- **Refresh Token Issue**: Currently, if Google Login does not return a refresh token, it relies solely on the emitted access token. Upon expiration, Google authenticated users will need to re-log.

## Build for Production
```bash
npm run build
npm run start
```

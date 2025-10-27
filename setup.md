# ResuMate Setup Guide

This guide will help you set up the ResuMate application with all the required dependencies and configurations.

## Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **MongoDB**
   - **Option A**: Local MongoDB
     - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
     - Start MongoDB service
   - **Option B**: MongoDB Atlas (Cloud)
     - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
     - Create a free cluster

3. **Google Gemini API Key**
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Sign in with your Google account
   - Click "Get API Key"
   - Create a new API key

## Setup Steps

### 1. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 2. Environment Configuration

Create a file named `.env` in the `backend/` directory with the following content:

```bash
# Server Configuration
PORT=5000
CORS_ORIGIN=http://localhost:5173

# Database Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/resumate

# For MongoDB Atlas, replace with your connection string:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resumate

# JWT Configuration
JWT_SECRET=your-very-strong-secret-key-here-make-it-long-and-random

# AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Start the Applications

#### Terminal 1: Start Backend Server
```bash
cd backend
npm start
```

#### Terminal 2: Start Frontend Development Server
```bash
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running (local) or connection string is correct (Atlas)
   - Check if the database name is correct

2. **CORS Errors**
   - Ensure `CORS_ORIGIN` in backend `.env` matches your frontend URL
   - Default is `http://localhost:5173`

3. **JWT Errors**
   - Ensure `JWT_SECRET` is set and is a strong, random string
   - Minimum 32 characters recommended

4. **Gemini API Errors**
   - Verify your API key is correct
   - Check if you have sufficient API quota

5. **Port Conflicts**
   - Backend runs on port 5000 by default
   - Frontend runs on port 5173 by default
   - Change ports in configuration if needed

### Development Tips

1. **Backend Development**
   - Use `npm run dev` for auto-restart on file changes
   - Check console logs for errors

2. **Frontend Development**
   - Hot reload is enabled by default
   - Check browser console for errors

3. **Database Management**
   - Use MongoDB Compass for GUI database management
   - Or use MongoDB shell for command-line access

## Production Deployment

For production deployment:

1. **Environment Variables**
   - Set production values for all environment variables
   - Use strong, unique secrets
   - Use production MongoDB instance

2. **Security**
   - Enable HTTPS
   - Set up proper CORS origins
   - Use environment-specific configurations

3. **Performance**
   - Enable MongoDB indexing
   - Set up proper error handling
   - Monitor API usage

## Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check if all services (MongoDB, etc.) are running

For additional help, refer to the main README.md file or create an issue on GitHub.

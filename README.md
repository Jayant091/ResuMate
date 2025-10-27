# ResuMate - AI-Powered Resume Builder

A modern resume builder with AI-powered features including ATS scoring and auto-structuring. Built with SvelteKit, Express.js, MongoDB, and Google Gemini AI.

## Features

### Core Features
- **Beautiful Resume Templates**: Multiple professional templates
- **Real-time Preview**: Live preview of your resume
- **PDF Export**: Download your resume as PDF
- **Responsive Design**: Works on all devices

### AI-Powered Features
- **ATS Score Checker**: Analyze resume compatibility with job descriptions
- **Auto-Fill Resume**: Extract structured data from career descriptions
- **Smart Suggestions**: Get AI-powered recommendations for resume improvement

### User Management
- **User Authentication**: Secure JWT-based authentication
- **Resume Storage**: Save and manage multiple resume versions
- **Resume History**: Access and restore previous versions

## Tech Stack

### Frontend
- **SvelteKit**: Modern web framework
- **UnoCSS**: Atomic CSS framework
- **TypeScript**: Type-safe development

### Backend
- **Express.js**: Node.js web framework
- **MongoDB**: NoSQL database with Mongoose
- **JWT**: Secure authentication
- **Google Gemini AI**: AI-powered features

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API key

### 1. Clone the Repository
```bash
git clone https://github.com/siduck/resumate.git
cd resumate
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd backend
npm install
```

### 3. Environment Setup

#### Backend Environment Variables
Create `backend/.env` with the following variables:

```bash
# Server Configuration
PORT=5000
CORS_ORIGIN=http://localhost:5173

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/resumate

# JWT Configuration
JWT_SECRET=your-strong-secret-key-here

# AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here
```

#### Get Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy the key to your `backend/.env` file

### 4. Start the Applications

#### Start the Backend Server
```bash
cd backend
npm start
# or for development
npm run dev
```

#### Start the Frontend Development Server
```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Usage

### 1. User Registration/Login
- Visit http://localhost:5173
- Click "Sign Up" to create an account
- Or click "Login" if you already have an account

### 2. Create Your Resume
- Fill in your personal details, skills, work experience, education, and projects
- Use the "Demo" button to fill with sample data

### 3. Save Your Resume
- Click "Save Resume" to save your current resume
- Give it a meaningful title
- Access saved resumes anytime

### 4. AI Features

#### ATS Score Checker
- Paste a job description in the ATS Score section
- Click "Check ATS Score" to analyze compatibility
- Review the score, missing keywords, and suggestions

#### Auto-Fill Resume
- Paste your career description in the Auto-Fill section
- Click "Auto-Fill Resume" to extract structured information
- Review and apply the extracted data to your resume

### 5. Export Your Resume
- Click "Download" to export your resume as PDF

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Resume Management
- `POST /api/resumes` - Create new resume
- `GET /api/resumes` - Get user's resumes
- `GET /api/resumes/:id` - Get specific resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### AI Features
- `POST /api/ats-score` - Get ATS compatibility score
- `POST /api/auto-structure` - Extract structured data from text

## Development

### Project Structure
```
resumate/
├── src/                    # Frontend source code
│   ├── lib/
│   │   ├── api/           # API client
│   │   ├── state/         # State management
│   │   ├── ui/            # UI components
│   │   └── editor/        # Editor components
│   └── routes/            # SvelteKit routes
├── backend/               # Backend source code
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── config/           # Configuration files
└── README.md
```

### Adding New Features
1. Create components in `src/lib/ui/`
2. Add API endpoints in `backend/routes/`
3. Implement controllers in `backend/controllers/`
4. Update state management in `src/lib/state/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:
1. Check the GitHub Issues page
2. Create a new issue with detailed information
3. Provide steps to reproduce the problem

---

**Note**: This project extends the original QuickCV with AI-powered features and backend integration while maintaining the original design and functionality. 

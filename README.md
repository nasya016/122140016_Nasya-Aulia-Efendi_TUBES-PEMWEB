# TugasKu - Task Management Application

A modern, full-stack task management application built with Python Pyramid (backend) and Next.js (frontend).

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication
- **Task Management**: Create, read, update, delete tasks with status tracking
- **Category Organization**: Organize tasks by categories
- **Search & Filter**: Advanced filtering and search capabilities
- **Dashboard Analytics**: Visual insights into task statistics
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Instant UI updates with optimistic updates
- **Status Logging**: Automatic logging of task status changes

## 🛠️ Tech Stack

### Backend
- **Python 3.11+**
- **Pyramid** - Web framework
- **SQLAlchemy** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **pytest** - Testing

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Bootstrap 5** - UI framework
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Toastify** - Notifications

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 12+
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd tugasku
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd tugasku-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install the package in development mode
pip install -e .

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
python -c "from tugasku_backend.database import init_db; init_db()"

# Run the server
pserve development.ini --reload
\`\`\`

### 3. Frontend Setup

\`\`\`bash
cd tugasku-frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# Run the development server
npm run dev
\`\`\`

### 4. Database Setup

\`\`\`sql
-- Create database
CREATE DATABASE tugasku_db;
CREATE USER tugasku_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE tugasku_db TO tugasku_user;
\`\`\`

## 🐳 Docker Setup

### Using Docker Compose

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd tugasku

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:6543

## 🧪 Testing

### Backend Tests

\`\`\`bash
cd tugasku-backend

# Run all tests
pytest

# Run with coverage
pytest --cov=tugasku_backend --cov-report=html

# Run specific test file
pytest tests/test_auth.py
\`\`\`

### Frontend Tests

\`\`\`bash
cd tugasku-frontend

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
\`\`\`

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Task Endpoints

- `GET /api/tasks` - Get tasks (with filtering)
- `POST /api/tasks` - Create task
- `GET /api/tasks/{id}` - Get task by ID
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Category Endpoints

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Dashboard Endpoint

- `GET /api/dashboard` - Get dashboard statistics

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- SQL injection prevention with SQLAlchemy ORM
- XSS protection

## 📱 Frontend Features

- Responsive design for all screen sizes
- Real-time form validation
- Loading states and error handling
- Toast notifications
- Optimistic UI updates
- Error boundaries
- TypeScript for type safety

## 🏗️ Project Structure

\`\`\`
tugasku/
├── tugasku-backend/
│   ├── tugasku_backend/
│   │   ├── models/          # Database models
│   │   ├── views/           # API endpoints
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   ├── database/        # Database configuration
│   │   └── config.py        # Configuration
│   ├── tests/               # Backend tests
│   ├── requirements.txt     # Python dependencies
│   └── setup.py            # Package setup
├── tugasku-frontend/
│   ├── app/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities and API
│   │   ├── types/           # TypeScript types
│   │   └── context/         # React context
│   ├── public/              # Static assets
│   └── package.json         # Node dependencies
└── docker-compose.yml       # Docker configuration
\`\`\`

## 🚀 Deployment

### Backend Deployment

1. Set environment variables for production
2. Use a production WSGI server (already configured with Waitress)
3. Setup PostgreSQL database
4. Configure reverse proxy (nginx)

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or any static hosting
3. Set environment variables for production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Built for Web Programming course final project
- Thanks to the open-source community for the amazing tools and libraries

# Electron - AI-Powered Marketing Tool

A comprehensive marketing automation platform built with CloudFlare's serverless stack, featuring AI-driven brand analysis, character-based content generation, and multi-format ad creation.

## 🚀 Live Demo

- **Frontend**: https://electron-frontend.pages.dev
- **Backend API**: https://electron-backend.carlos-mdtz9.workers.dev

## 📋 Features

### Phase 1: User Management & Workspaces
- Secure user registration and authentication
- JWT token-based sessions
- Multi-workspace support for organization

### Phase 2: Brand Discovery
- URL-based website analysis
- AI-powered brand intelligence extraction
- Real-time analysis status tracking

### Phase 3: Brand Voice System
- AI-generated brand characters with unique personalities
- Character approval/rejection workflow
- Personality trait storage and management

### Phase 4: Ad Creation
- Multi-format content generation (LinkedIn, Twitter, Email)
- Character-based writing with consistent voice
- Bulk content creation with quantity controls

## 🏗 Architecture

### Technology Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: CloudFlare Workers (serverless functions)
- **Database**: CloudFlare D1 (SQLite-compatible)
- **AI**: CloudFlare Workers AI (Llama-3.1-8B model)
- **Deployment**: CloudFlare Pages + Workers

### Project Structure
```
electron/
├── frontend/                 # Next.js application
│   ├── src/app/             # App router pages
│   ├── package.json
│   └── next.config.js
├── backend/                 # CloudFlare Workers
│   ├── src/index.ts         # Main worker handler
│   ├── wrangler.toml        # Worker configuration
│   ├── package.json
│   └── schema.sql           # Database schema
└── docs/                   # Documentation
    ├── tasks.md            # Development tasks
    └── changelog.md        # Change history
```

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Workspaces Table
```sql
CREATE TABLE workspaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Brand Analyses Table
```sql
CREATE TABLE brand_analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_id INTEGER NOT NULL,
    url TEXT,
    analysis_type TEXT NOT NULL,
    content TEXT,
    ai_analysis TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);
```

#### Characters Table
```sql
CREATE TABLE characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    personality TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);
```

#### Ads Table
```sql
CREATE TABLE ads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_id INTEGER NOT NULL,
    character_id INTEGER NOT NULL,
    ad_type TEXT NOT NULL,
    topic TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);
```

## 🔧 Setup & Development

### Prerequisites
- Node.js 18+
- npm or yarn
- CloudFlare account with Wrangler CLI
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd electron
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. **Configure CloudFlare**
   ```bash
   # Login to CloudFlare
   npx wrangler auth login

   # Create D1 database (if not exists)
   npx wrangler d1 create electron-db
   ```

4. **Environment Setup**
   Update `backend/wrangler.toml` with your database ID:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "electron-db"
   database_id = "your-database-id"
   ```

5. **Run locally**
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend (new terminal)
   cd frontend
   npm run dev
   ```

### Deployment

1. **Deploy Backend**
   ```bash
   cd backend
   npm run deploy
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   npm run build
   npx wrangler pages deploy out --project-name electron-frontend
   ```

## 📚 Documentation

### System Guide
For a comprehensive understanding of the Electron system, read the **[Complete System Guide](docs/SYSTEM_GUIDE.md)** which covers:
- User journey and technical workflows
- Deep architectural analysis
- Data flow patterns and state management
- Testing strategies and infrastructure
- Maintenance and extension guides
- Scaling strategies and troubleshooting

### API Reference
Complete API documentation available in **[API_REFERENCE.md](docs/API_REFERENCE.md)**

### Architecture Deep Dive
Technical architecture details in **[ARCHITECTURE.md](docs/ARCHITECTURE.md)**

### Testing Guide
Complete testing instructions in **[TESTING_GUIDE.md](docs/TESTING_GUIDE.md)**

## 📚 API Endpoints

### Authentication Endpoints

#### POST /api/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

#### POST /api/login
Authenticate and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "userId": 1
}
```

### Workspace Endpoints

#### GET /api/workspaces
Get all workspaces for authenticated user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "workspaces": [
    {
      "id": 1,
      "name": "My Brand",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/workspaces
Create a new workspace.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```json
{
  "name": "New Workspace"
}
```

### Brand Analysis Endpoints

#### GET /api/analyses?workspace_id={id}
Get brand analyses for a workspace.

#### POST /api/analyses
Start brand analysis.

**Request:**
```json
{
  "workspace_id": 1,
  "url": "https://example.com",
  "analysis_type": "url"
}
```

### Character Endpoints

#### GET /api/characters?workspace_id={id}
Get characters for a workspace.

#### POST /api/characters
Generate brand voice characters.

**Request:**
```json
{
  "workspace_id": 1,
  "brand_analysis": "analysis-id"
}
```

#### PUT /api/characters/{id}
Update character status.

**Request:**
```json
{
  "status": "approved"
}
```

### Ad Generation Endpoints

#### GET /api/ads?workspace_id={id}
Get generated ads for a workspace.

#### POST /api/ads
Generate ads using approved characters.

**Request:**
```json
{
  "workspace_id": 1,
  "character_ids": [1, 2],
  "ad_type": "linkedin_post",
  "topic": "Product Launch",
  "quantity": 3
}
```

## 🤖 AI Integration

### CloudFlare Workers AI

The application uses CloudFlare's Workers AI service with the Llama-3.1-8B model for:

1. **Brand Analysis**: Extract insights from website content
2. **Character Generation**: Create brand voice personalities
3. **Content Creation**: Generate ads matching character personalities

### AI Prompts

The system uses structured prompts to ensure consistent, high-quality AI outputs:

- **Analysis**: Marketing-focused content analysis
- **Characters**: Personality-driven brand voice creation
- **Ads**: Format-specific content generation with character consistency

## 🔒 Security

- JWT token-based authentication
- Password hashing with SHA-256
- CORS protection
- Input validation and sanitization
- User data isolation by workspace

## 📈 Performance

- Serverless architecture with global CDN
- Asynchronous AI processing
- Optimized database queries
- Static frontend deployment
- Lazy loading and code splitting

## 🚀 Scaling

The architecture is designed for horizontal scaling:

- **Workers**: Auto-scale based on demand
- **D1**: Distributed SQLite with global replication
- **Pages**: Global CDN with edge computing
- **AI**: On-demand processing without resource limits

## 🧪 Testing

The project includes a comprehensive automated test suite that validates all features end-to-end.

### Running Tests

```bash
# Run all tests
cd tests
npm test

# Run specific test suites
npm run test:auth        # Authentication tests
npm run test:workspaces  # Workspace management tests
npm run test:analysis    # Brand analysis tests
npm run test:characters  # Character generation tests
npm run test:ads         # Ad creation tests

# Show help
npm run test:help
```

### Test Structure

```
tests/
├── test_runner.js       # Main orchestrator
├── test_utils.js        # Shared utilities
├── test_auth.js         # User registration & login
├── test_workspaces.js   # Workspace CRUD operations
├── test_brand_analysis.js # URL analysis & AI processing
├── test_characters.js   # Character generation & management
├── test_ads.js          # Ad creation with characters
└── package.json         # Test scripts
```

### Test Features

- **End-to-End Testing**: Tests actual API endpoints with real data
- **Automated Cleanup**: Test users and data are automatically removed
- **Async Operation Handling**: Properly waits for AI processing completion
- **Comprehensive Coverage**: Tests all major user workflows
- **Detailed Reporting**: Clear pass/fail results with error details
- **Timeout Protection**: Prevents tests from hanging indefinitely

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper documentation
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the [Issues](https://github.com/your-repo/issues) page
- Review the [API Documentation](#api-documentation)
- Check [CloudFlare Workers Docs](https://developers.cloudflare.com/workers/)

## 🎯 Roadmap

- [ ] PDF file upload and analysis
- [ ] Additional AI models integration
- [ ] Social media scheduling
- [ ] Analytics and reporting
- [ ] Team collaboration features
- [ ] Custom character training

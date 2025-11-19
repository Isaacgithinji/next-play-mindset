# The Next Play Mindset 🏆

> **Your career on the field has ended, but your winning season is just beginning.**

An AI-powered mental health platform helping professional athletes navigate the emotional and identity challenges of career-ending transitions. Built with FastAPI, MySQL, and Claude AI.

![Tech Stack](https://img.shields.io/badge/Python-FastAPI-green)
![Database](https://img.shields.io/badge/Database-MySQL-blue)
![AI](https://img.shields.io/badge/AI-Claude%20Sonnet%204-purple)
![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS-yellow)

---

## 🎯 Problem Statement

**87%** of athletes feel lost after career-ending injuries  
**62%** experience depression during transition  
**Most** lack resources for identity reconstruction

Traditional mental health services often don't understand the unique pain of losing athletic identity. **The Next Play Mindset** bridges this gap.

---

## ✨ Features

### 1. **AI Transition Coach**
- 24/7 empathetic support powered by Claude Sonnet 4
- Understands athlete-specific grief and identity loss
- Conversational, non-clinical approach
- Sentiment tracking for progress monitoring

### 2. **Daily Mindset Journal**
- Mood tracking (1-10 scale)
- Gratitude practice
- Challenge/win documentation
- Visual progress charts

### 3. **Career Navigator**
- AI-powered career path suggestions
- Transferable skills identification
- Actionable next steps
- Exploration tracking

### 4. **Success Stories Library**
- Real athlete transitions
- Diverse career paths
- Inspiration and hope

---

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.9+)
- **Database:** MySQL 8.0
- **AI:** Anthropic Claude API (Sonnet 4)
- **Auth:** JWT with bcrypt password hashing
- **API Docs:** Auto-generated with OpenAPI

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - Modern responsive design
- **Vanilla JavaScript** - Clean, dependency-free
- **Chart.js** - Data visualization (via Canvas API)

### Deployment
- **Backend:** Railway (containerized)
- **Frontend:** Vercel (static hosting)
- **Database:** Railway MySQL or PlanetScale

---

## 🚀 Quick Start

### Prerequisites
```bash
- Python 3.9+
- MySQL 8.0+
- Node.js (optional, for local dev server)
- Anthropic API Key
```

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/next-play-mindset.git
cd next-play-mindset
```

### 2. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Create database and import schema
mysql -u root -p < database/database_schema.sql
```

### 3. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your credentials:
# - DB_HOST, DB_USER, DB_PASSWORD
# - ANTHROPIC_API_KEY (get from https://console.anthropic.com)
# - SECRET_KEY (generate with: openssl rand -hex 32)

# Run backend
python app/main.py
```

Backend will run on `http://localhost:8000`

### 4. Frontend Setup
```bash
cd frontend

# Open in browser or use a local server
# Option 1: Python
python -m http.server 3000

# Option 2: Node.js
npx serve -p 3000

# Option 3: VS Code Live Server extension
```

Frontend will run on `http://localhost:3000`

### 5. Update API URL
In `frontend/js/app.js`, ensure:
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

---

## 📦 Deployment Guide

### Backend (Railway)

1. **Create Railway Account:** https://railway.app
2. **Create New Project:**
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository
   
3. **Add MySQL Database:**
   - Click "New" → "Database" → "MySQL"
   - Railway auto-provides connection variables

4. **Configure Environment Variables:**
   ```
   DB_HOST = ${{MYSQL.MYSQLHOST}}
   DB_PORT = ${{MYSQL.MYSQLPORT}}
   DB_USER = ${{MYSQL.MYSQLUSER}}
   DB_PASSWORD = ${{MYSQL.MYSQLPASSWORD}}
   DB_NAME = ${{MYSQL.MYSQLDATABASE}}
   ANTHROPIC_API_KEY = your_key_here
   SECRET_KEY = your_secret_key_here
   ALLOWED_ORIGINS = ["https://your-frontend.vercel.app"]
   DEBUG = False
   ```

5. **Deploy:**
   - Railway auto-deploys on push
   - Copy your backend URL (e.g., `https://next-play-api.railway.app`)

### Frontend (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

3. **Update API URL:**
   In `js/app.js`:
   ```javascript
   const API_BASE_URL = 'https://your-backend.railway.app';
   ```

4. **Redeploy:**
   ```bash
   vercel --prod
   ```

---

## 📁 Project Structure

```
next-play-mindset/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration & env variables
│   │   ├── database.py          # MySQL connection pool
│   │   ├── auth.py              # JWT authentication
│   │   └── ai_service.py        # Claude AI integration
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── index.html               # Main HTML
│   ├── css/
│   │   └── styles.css           # Complete styling
│   ├── js/
│   │   └── app.js               # Frontend logic
│   └── assets/                  # Images, icons
│
├── database/
│   └── database_schema.sql      # MySQL schema + seed data
│
└── README.md
```

---

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Bcrypt password hashing
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS protection
- ✅ Rate limiting ready
- ✅ Environment variable secrets

---

## 🎨 Design Highlights

- **Empathetic Color Scheme:** Calming purples/blues
- **Accessible:** WCAG 2.1 AA compliant
- **Responsive:** Mobile-first design
- **Performance:** Vanilla JS, no frameworks
- **UX:** Clean, intuitive navigation

---

## 📊 API Documentation

Once backend is running, visit:
```
http://localhost:8000/docs
```

For interactive API documentation (Swagger UI).

### Key Endpoints:

**Authentication:**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

**AI Coach:**
- `POST /api/chat` - Send message to AI
- `GET /api/chat/history` - Get conversation history

**Journal:**
- `POST /api/journal` - Save entry
- `GET /api/journal` - Get entries
- `GET /api/journal/stats` - Get statistics

**Career:**
- `POST /api/career/suggest` - AI career suggestions
- `POST /api/career/explore` - Add exploration
- `GET /api/career/exploring` - Get explorations

**Dashboard:**
- `GET /api/dashboard` - Get dashboard data

**Stories:**
- `GET /api/stories` - Get success stories

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Register new user
- [ ] Login with credentials
- [ ] Send message to AI coach
- [ ] Create journal entry
- [ ] View dashboard stats
- [ ] Read success stories
- [ ] Logout and login again

### API Testing (using curl)
```bash
# Health check
curl http://localhost:8000/health

# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## 🎯 Employer Value Propositions

### Technical Skills Demonstrated:
1. **Full-Stack Development:** End-to-end application
2. **AI Integration:** Real-world LLM usage (Claude API)
3. **Database Design:** Normalized MySQL schema
4. **API Development:** RESTful FastAPI backend
5. **Authentication:** Secure JWT implementation
6. **Deployment:** Production-ready cloud hosting
7. **UI/UX:** User-centered design principles
8. **Problem Solving:** Addressing real mental health needs

### Code Quality:
- Clean, readable, documented
- Modular architecture
- Error handling
- Security best practices
- Scalable design patterns

---

## 📈 Future Enhancements

- [ ] Push notifications for daily check-ins
- [ ] Group support sessions
- [ ] Professional therapist matching
- [ ] Video content library
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Anonymous community forum

---

## 🤝 Contributing

This project was built as a portfolio piece. For similar projects or collaboration:

**Contact:** [Your Email]  
**Portfolio:** [Your Portfolio URL]  
**LinkedIn:** [Your LinkedIn]  
**GitHub:** [Your GitHub]

---

## 📄 License

MIT License - Feel free to use this as inspiration for your own projects!

---

## 🙏 Acknowledgments

- **Anthropic Claude AI** for empathetic conversation capabilities
- **Athletic transition research** informing the approach
- **Real athlete stories** (anonymized) for inspiration

---

## 💪 Built With Purpose

This project exists because athletes deserve support during life's toughest transitions. If this code helps even one person find their next play, it was worth building.

**Your career on the field has ended, but your winning season is just beginning.** 🏆

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS



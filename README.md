# Synora - AI Chat Application

A modern, full-stack AI chat application built with React, Node.js, Express, MongoDB, and Google's Gemini AI. Features real-time conversation history, user authentication, and a sleek dark-themed UI.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Package Explanations](#package-explanations)
- [LLM Integration](#llm-integration)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Future Enhancements](#future-enhancements)

---

## ✨ Features

- **User Authentication**: Secure JWT-based login/register system with HTTP-only cookies
- **Real-time AI Chat**: Powered by Google Gemini 2.5 Flash model
- **Conversation History**: Persistent chat threads stored in MongoDB
- **Thread Management**: Create, view, and delete conversation threads
- **Markdown Support**: Rich text rendering with syntax highlighting
- **Typing Animation**: Smooth character-by-character AI response display
- **Responsive Design**: Modern UI with collapsible sidebar
- **Protected Routes**: Frontend route guards to prevent unauthorized access

---

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Fast development build tool
- **React Markdown** - Markdown rendering
- **Rehype Highlight** - Code syntax highlighting
- **React Spinners** - Loading indicators
- **UUID** - Unique thread ID generation

### Backend

- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Google Generative AI** - Gemini API integration
- **Cookie Parser** - Parse HTTP cookies
- **CORS** - Cross-origin resource sharing

---

## 📁 Project Structure

```
Synora/
├── backend/
│   ├── middleware/
│   │   └── fetchUsers.js          # JWT authentication middleware
│   ├── models/
│   │   ├── Thread.js               # Chat thread schema
│   │   └── userSchema.js           # User schema
│   ├── routes/
│   │   ├── auth.js                 # Auth endpoints (login/register/logout)
│   │   └── Chat.js                 # Chat & thread management endpoints
│   ├── utils/
│   │   └── geminiUtils.js          # Gemini AI integration
│   ├── .gitignore
│   ├── package.json
│   └── server.js                   # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── Synora.svg           # App logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   │   ├── Chat.jsx        # Message display component
│   │   │   │   └── Chat.css
│   │   │   ├── Chatwindow/
│   │   │   │   ├── ChatWindow.jsx  # Main chat interface
│   │   │   │   └── ChatWindow.css
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.jsx     # Navigation & thread list
│   │   │   │   └── Sidebar.css
│   │   │   └── ProtectedRoute.jsx  # Auth route guard
│   │   ├── context/
│   │   │   └── MyContext.jsx       # Global state context
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Register.jsx        # Registration page
│   │   │   └── Login.css           # Auth pages styling
│   │   ├── App.jsx                 # Root component
│   │   ├── App.css                 # Global styles
│   │   ├── main.jsx                # React entry point
│   │   └── index.css
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```

---

## 🗄️ Database Schema

### User Schema (`userSchema.js`)

```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  Threads: [ObjectId] (references Thread model),
  timestamps: true (createdAt, updatedAt)
}
```

**Purpose**: Stores user credentials and references to their chat threads.

**Security**: Passwords are hashed using bcryptjs before storage.

---

### Thread Schema (`Thread.js`)

```javascript
{
  user: ObjectId (required, references User),
  threadId: String (required, unique, UUID v1),
  title: String (default: "New Chat"),
  message: [
    {
      role: String (enum: ["user", "assistant"]),
      content: String (required),
      timestamp: Date (default: Date.now)
    }
  ],
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Purpose**: Stores individual conversations with the AI.

**Key Fields**:

- `threadId`: Unique identifier for each conversation (UUID v1)
- `message`: Array of chat messages with roles (user/assistant)
- `title`: Auto-generated from first message (first 30 characters)

---

## 📦 Package Explanations

### Backend Dependencies

| Package                 | Version | Purpose                                         |
| ----------------------- | ------- | ----------------------------------------------- |
| `express`               | ^5.1.0  | Fast, unopinionated web framework for Node.js   |
| `mongoose`              | ^8.19.2 | MongoDB ODM for schema modeling and queries     |
| `@google/generative-ai` | ^0.24.1 | Official Google Gemini AI SDK                   |
| `jsonwebtoken`          | ^9.0.2  | Create and verify JWT tokens for authentication |
| `bcryptjs`              | ^3.0.3  | Hash passwords securely (alternative to bcrypt) |
| `cookie-parser`         | ^1.4.7  | Parse Cookie header and populate `req.cookies`  |
| `cors`                  | ^2.8.5  | Enable CORS with various options                |
| `dotenv`                | ^17.2.3 | Load environment variables from `.env` file     |
| `nodemon`               | ^3.1.10 | Auto-restart server on file changes (dev only)  |

**Why these packages?**

- **Express**: Industry-standard for Node.js APIs
- **Mongoose**: Provides schema validation and relationship management
- **Gemini AI**: State-of-the-art LLM with multimodal capabilities
- **JWT + bcryptjs**: Secure, stateless authentication
- **cookie-parser**: Required for reading HTTP-only cookies

---

### Frontend Dependencies

| Package            | Version | Purpose                                         |
| ------------------ | ------- | ----------------------------------------------- |
| `react`            | ^19.1.1 | Core React library                              |
| `react-dom`        | ^19.1.1 | React DOM renderer                              |
| `react-router-dom` | ^7.9.6  | Declarative routing for React apps              |
| `react-markdown`   | ^10.1.0 | Render Markdown as React components             |
| `rehype-highlight` | ^7.0.2  | Syntax highlighting for code blocks             |
| `react-spinners`   | ^0.17.0 | Loading spinner components                      |
| `uuid`             | ^13.0.0 | Generate unique identifiers (v1 for thread IDs) |

**Why these packages?**

- **react-markdown + rehype-highlight**: Display AI responses with proper formatting and syntax-highlighted code
- **react-router-dom**: Handle navigation and protected routes
- **uuid**: Generate unique, sortable thread identifiers
- **react-spinners**: Provide visual feedback during API calls

---

### Dev Dependencies

| Package                     | Purpose                                  |
| --------------------------- | ---------------------------------------- |
| `vite`                      | Lightning-fast dev server and build tool |
| `@vitejs/plugin-react`      | Enables React Fast Refresh in Vite       |
| `eslint`                    | Code linting and style enforcement       |
| `eslint-plugin-react-hooks` | Enforce React Hooks rules                |

---

## 🤖 LLM Integration (Gemini AI)

### Model: `gemini-2.5-flash`

**Why Gemini 2.5 Flash?**

- **Speed**: Optimized for low-latency responses
- **Context Window**: Large context (up to 1M tokens in some versions)
- **Multimodal**: Supports text, images, and more
- **Cost-Effective**: Excellent performance-to-cost ratio

---

### Implementation (`geminiUtils.js`)

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateGeminiResponse = async (chatHistory, userMessage) => {
  const chat = model.startChat({ history: chatHistory });
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
};
```

**How it works**:

1. Initialize the Gemini client with API key
2. Select the model (`gemini-2.5-flash`)
3. Start a chat session with conversation history
4. Send new message and receive streaming response
5. Extract text from response

---

### Context Management

The backend maintains conversation history in this format:

```javascript
[
  { role: "user", parts: [{ text: "Hello!" }] },
  { role: "model", parts: [{ text: "Hi! How can I help?" }] },
];
```

**Key Points**:

- `role: "assistant"` in DB → `role: "model"` for Gemini API
- Each message stored with timestamp
- Full history sent with each request for context continuity

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** (local or Atlas)
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

---

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd Synora/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file**

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/synora
   JWT_SECRET=your_super_secret_jwt_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

---

### Frontend Setup

1. **Navigate to frontend**

   ```bash
   cd ../frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint    | Description                  | Auth Required |
| ------ | ----------- | ---------------------------- | ------------- |
| POST   | `/register` | Create new user account      | ❌            |
| POST   | `/login`    | Login and receive JWT cookie | ❌            |
| POST   | `/logout`   | Clear authentication cookie  | ✅            |

**Request Body Examples**:

```javascript
// Register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}

// Login
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

---

### Chat & Thread Routes (`/api`)

| Method | Endpoint            | Description                        | Auth Required |
| ------ | ------------------- | ---------------------------------- | ------------- |
| GET    | `/thread`           | Get all threads for logged-in user | ✅            |
| GET    | `/thread/:threadId` | Get messages from specific thread  | ✅            |
| POST   | `/chat`             | Send message and get AI response   | ✅            |
| DELETE | `/thread/:threadId` | Delete a thread                    | ✅            |

**Request Body (POST /chat)**:

```javascript
{
  "threadId": "uuid-v1-string",
  "message": "What is React?"
}
```

**Response**:

```javascript
{
  "success": "React is a JavaScript library..."
}
```

---

## 🔐 Authentication Flow

1. **User Registration**:

   - Password hashed with bcryptjs (10 salt rounds)
   - User document created in MongoDB
   - No automatic login (must login separately)

2. **User Login**:

   - Password verified using `bcrypt.compare()`
   - JWT token generated with user ID payload
   - Token stored in HTTP-only cookie (1 hour expiry)

3. **Protected Routes**:

   - Middleware (`fetchUsers.js`) validates JWT on each request
   - Decoded user ID attached to `req.user`
   - Invalid/missing tokens return 401 Unauthorized

4. **Frontend Protection**:
   - `ProtectedRoute` component checks session on mount
   - Redirects to `/login` if unauthenticated
   - Shows loading spinner during validation

---

## 🎨 UI Features

### Theme Variables (CSS)

```css
--bg-color: #0f172a; /* Main background */
--sidebar-bg: #1e293b; /* Sidebar/card background */
--border-color: #334155; /* Borders */
--text-main: #f8fafc; /* Primary text */
--text-muted: #94a3b8; /* Secondary text */
--accent-color: #14b8a6; /* Teal accent */
--user-msg-bg: #0f766e; /* User message bubble */
--ai-msg-bg: #334155; /* AI message bubble */
```

### Key UI Components

1. **Sidebar**:

   - Collapsible (280px → 80px)
   - Thread history with delete buttons
   - Active thread highlighting

2. **Chat Window**:

   - Auto-scroll to latest message
   - Markdown rendering with syntax highlighting
   - Typing animation (20 chars per 30ms)

3. **Input Box**:
   - Floating capsule design
   - Enter key to send
   - Loading state during API calls

---

## 🚀 Future Enhancements

### Planned Features

1. **File Uploads**: Share images with Gemini (multimodal)
2. **Voice Input**: Speech-to-text integration
3. **Export Chats**: Download conversations as PDF/Markdown
4. **Shared Threads**: Collaborate with other users
5. **Custom AI Settings**: Temperature, max tokens control
6. **Dark/Light Theme Toggle**: User preference persistence
7. **Search Functionality**: Find specific messages in history
8. **Streaming Responses**: Real-time token-by-token display

---

### Performance Optimizations

- Implement message pagination (infinite scroll)
- Add Redis caching for frequent queries
- Use WebSockets for real-time updates
- Lazy load sidebar threads

---

## 📝 License

This project is open-source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 GitHub Profile

reach out at: GitHub[https://github.com/PrathameshBhosale01]
Email:[bhosaleprathamesh202@gmail.com]

---

## 🙏 Acknowledgments

- **Google Gemini AI** for the powerful LLM
- **React Community** for excellent documentation
- **MongoDB** for flexible data modeling

---

**Built with ❤️ using React, Node.js, and Gemini AI**

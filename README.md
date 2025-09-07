# Eliora AI 🤖

A modern, full-stack AI chatbot application built with React, Node.js, and powered by Groq's Llama AI models. Eliora AI provides an intuitive chat interface with real-time messaging, user authentication, and intelligent AI responses.

![Eliora AI](frontend/public/eliora.png)

## ✨ Features

- **🤖 AI-Powered Conversations**: Intelligent responses powered by Groq's Llama 3.3 70B model
- **👤 User Authentication**: Secure user registration, login, and session management
- **💬 Real-time Chat**: Instant messaging with real-time updates
- **📱 Responsive Design**: Modern UI built with React, Tailwind CSS, and DaisyUI
- **🔒 Secure**: JWT-based authentication with bcrypt password hashing
- **📝 Rich Text Support**: Markdown rendering and syntax highlighting for code
- **🎨 Beautiful UI**: Clean, modern interface with Lucide React icons
- **⚡ Fast Performance**: Built with Vite for lightning-fast development and builds

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Beautiful component library
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Elegant notifications
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code syntax highlighting
- **Lucide React** - Beautiful icons

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Groq SDK** - AI model integration
- **Socket.io** - Real-time communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image and media management
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Groq API key
- Cloudinary account (optional, for media uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MrSpidey07/AI-ChatBot.git
   cd AI-ChatBot
   ```

2. **Set up the Backend**

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:

   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GROQ_API_KEY=your_groq_api_key
   FRONTEND_URL=http://localhost:5173
   ```

3. **Set up the Frontend**

   ```bash
   cd ../frontend
   npm install
   ```

   Create a `.env` file in the frontend directory:

   ```env
   VITE_API_URL=http://localhost:5001
   ```

### Running the Application

1. **Start the Backend Server**

   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend Development Server**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5001`

## 📁 Project Structure

```
AI-Chat/
├── backend/
│   ├── src/
│   │   ├── controller/          # Request handlers
│   │   ├── lib/                 # Database connection and utilities
│   │   ├── middleware/          # Express middleware
│   │   ├── models/              # MongoDB schemas
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic and external services
│   │   ├── utils/               # Utility functions
│   │   └── app.js               # Express app configuration
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/          # Reusable React components
    │   ├── lib/                 # Frontend utilities
    │   ├── pages/               # Page components
    │   ├── store/               # Zustand state management
    │   └── App.jsx              # Main React component
    ├── public/                  # Static assets
    └── package.json
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status

### Chat

- `GET /api/chats` - Get user's chat history
- `POST /api/chat` - Send message to AI
- `DELETE /api/chat/:chatId` - Delete a chat

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Meet Bodana**

- GitHub: [@MrSpidey07](https://github.com/MrSpidey07)

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for providing fast AI inference
- [Meta](https://ai.meta.com/) for the Llama models
- [Vercel](https://vercel.com/) for inspiration on modern web development
- All the amazing open-source libraries that made this project possible

## 📈 Future Enhancements

- [ ] File upload and analysis capabilities
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Chat export functionality
- [ ] Custom AI model fine-tuning
- [ ] Mobile app development
- [ ] Integration with more AI providers

---

⭐ **Star this repository if you found it helpful!**

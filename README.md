# 💬 Chat Application — Node.js Backend

A real-time chat application backend built with **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. It supports user authentication with JWT, persistent message storage, and live bidirectional messaging via WebSockets.

---

## 🚀 Features

- 🔐 **JWT Authentication** — Secure login/signup with cookie-based token storage
- 💬 **Real-Time Messaging** — Bidirectional communication powered by Socket.IO
- 🧑‍🤝‍🧑 **User Management** — Fetch all users, view your profile, and logout
- 📦 **Message Persistence** — All messages are saved in MongoDB
- 🛡️ **Protected Routes** — Middleware-guarded REST and WebSocket endpoints
- ⚠️ **Global Error Handling** — Centralized error middleware

---

## 🛠️ Tech Stack

| Technology    | Purpose                          |
|---------------|----------------------------------|
| Node.js       | JavaScript runtime               |
| Express 5     | REST API framework               |
| MongoDB       | NoSQL database                   |
| Mongoose      | MongoDB object modeling          |
| Socket.IO     | Real-time WebSocket communication|
| JSON Web Token| Auth token generation/verification|
| bcryptjs      | Password hashing                 |
| dotenv        | Environment variable management  |
| cookie-parser | Cookie parsing middleware        |
| cors          | Cross-Origin Resource Sharing    |
| nodemon       | Dev auto-restart                 |

---

## 📁 Project Structure

```
server-node/
├── config/
│   └── db.js                  # MongoDB connection setup
├── controllers/
│   ├── authController.js      # Register & login handlers
│   ├── messageController.js   # Fetch message history
│   └── userController.js      # User profile & management
├── middleware/
│   ├── authMiddleware.js      # JWT verification middleware
│   └── errorMiddleware.js     # Global error handler
├── models/
│   ├── Message.js             # Message Mongoose schema
│   └── User.js                # User Mongoose schema
├── routes/
│   ├── authRoutes.js          # /auth endpoints
│   ├── messageRoutes.js       # /message endpoints
│   └── userRoutes.js          # /user endpoints
├── utils/
│   ├── errorHandler.js        # Custom error class
│   └── sendToken.js           # JWT generation & socket auth
├── .env                       # Environment variables
├── package.json
└── server.js                  # Entry point
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd server-node

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# Then fill in your values (see Environment Variables section)

# 4. Start the development server
npm run dev
```

The server will start on **http://localhost:5000**.

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following keys:

```env
# MongoDB connection string
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/chat-application

# Secret key for JWT signing
JWT_SECRET=your_jwt_secret_key

# Allowed frontend URLs (CORS)
CLIENT_URL=http://localhost:5173
CLIENT_URL_1=http://localhost:5174
```

> ⚠️ **Never commit your `.env` file to version control.** Add it to `.gitignore`.

---

## 📡 API Endpoints

### Auth / User Routes — `/user`

| Method | Endpoint         | Auth Required | Description              |
|--------|------------------|:-------------:|--------------------------|
| POST   | `/user/signup`   | ❌            | Register a new user      |
| POST   | `/user/login`    | ❌            | Login and receive a token|
| GET    | `/user/all`      | ✅            | Get all registered users |
| GET    | `/user/me`       | ✅            | Get current user profile |
| GET    | `/user/logout`   | ✅            | Logout current user      |

### Message Routes — `/message`

| Method | Endpoint                    | Auth Required | Description                          |
|--------|-----------------------------|:-------------:|--------------------------------------|
| GET    | `/message/:receiverId`      | ✅            | Get message history with a user      |

---

## 🔌 WebSocket Events (Socket.IO)

The server authenticates WebSocket connections via the JWT stored in cookies.

### Client → Server

| Event          | Payload                                     | Description                      |
|----------------|---------------------------------------------|----------------------------------|
| `send-message` | `{ receiverId: string, message: string }`   | Send a message to another user   |

### Server → Client

| Event             | Payload         | Description                                    |
|-------------------|-----------------|------------------------------------------------|
| `receive-message` | `Message object`| Emitted to sender and receiver upon new message|

---

## 🗄️ Data Models

### User

```js
{
  username: String,   // required
  password: String,   // required, hashed, hidden from queries
  createdAt: Date,
  updatedAt: Date
}
```

### Message

```js
{
  senderId:   ObjectId (ref: User),  // required
  receiverId: ObjectId (ref: User),  // required
  message:    String,                 // required
  createdAt:  Date,
  updatedAt:  Date
}
```

---

## 📜 Available Scripts

| Script        | Command           | Description                            |
|---------------|-------------------|----------------------------------------|
| Start         | `npm start`       | Run with Node.js (production)          |
| Dev           | `npm run dev`     | Run with nodemon (auto-reload)         |

---

## 🔒 Authentication Flow

1. User registers or logs in via `/user/signup` or `/user/login`.
2. Server generates a **JWT** and sets it as an **HTTP-only cookie**.
3. All protected REST routes validate the token via the `isAuthenticated` middleware.
4. Socket.IO connections are authenticated by reading the JWT from the cookie on the handshake request.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

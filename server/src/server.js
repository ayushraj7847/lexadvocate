require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const initializeSocket = require('./sockets/chatSocket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

initializeSocket(io);

const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('⚠️ MongoDB connection failed. Server running in disconnected mode until database is up.');
  }

  server.listen(PORT, () => {
    console.log(`🚀 LexAdvocate Server running on http://localhost:${PORT}`);
  });
};

startServer();

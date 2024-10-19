import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';  // Import Socket for typing
import connect from './config/database';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import messageRoutes from './routes/message.routes';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000, 
  transports: ['websocket', 'polling']  
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));

io.on("connection", (socket: Socket) => {
  console.log("New client connected! Socket ID:", socket.id); 

  socket.on("initializeUser", (userId: string) => {
    console.log(`User initialized: ${userId}`);
    socket.join(userId);  
  });

  socket.on("joinChat", (chatId: string) => {
    console.log(`User joined chat: ${chatId}`);
    socket.join(chatId); 
  });

  socket.on("disconnect", (reason: string) => {
    console.log(`Client disconnected. Reason: ${reason}`);
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/message', messageRoutes);

connect();

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

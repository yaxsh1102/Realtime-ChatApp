import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';  
import connect from './config/database';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import messageRoutes from './routes/message.routes';
import { IUser } from './models/user.schema';

interface User {
  name: string;
  email: string;
  avatar: string;
  _id: string;
}

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

const users: { [key: string]: Socket } = {};

io.on("connection", (socket: Socket) => {
  console.log("New client connected! Socket ID:", socket.id); 

  socket.on("initializeUser", (userId: string) => {
    console.log(`User initialized: ${userId}`);

    console.log(socket.id)

    if (users[userId]) {
      users[userId].disconnect();
      console.log(`Disconnected previous socket for user: ${userId}`);
    }

    users[userId] = socket;
    socket.join(userId);  
    console.log(`Current users: ${JSON.stringify(Object.keys(users))}`); // Log current users
  });

  socket.on("joinChat", (chatId: string) => {
    console.log(`User joined chat: ${chatId}`);
    socket.join(chatId); 
  });

  socket.on("disconnect", (reason: string) => {
    console.log(`Client disconnected. Reason: ${reason}`);
    
    for (const userId in users) {
      if (users[userId] === socket) {
        delete users[userId];
        console.log(`Removed user from tracking: ${userId}`);
        console.log(`Current users after disconnect: ${JSON.stringify(Object.keys(users))}`); // Log current users
        break;
      }
    }
  });

  socket.on("newMessage", (data) => {
    console.log("New message received:", data);
    console.log(`Current users before sending message: ${JSON.stringify(Object.keys(users))}`); 

    data.chat.members.forEach((member: User) => {
      if (member._id.toString() !== data.sender._id.toString()) {
        console.log("Sending message to:", member._id);
        socket.to(member._id).emit("receiveMessage", {
          sender: data.sender,
          content: data.content,
          createdAt: new Date().toISOString(),
        });
      }
    });
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

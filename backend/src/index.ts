import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';  
import connect from './config/database';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import messageRoutes from './routes/message.routes';
import initializeSocket from './socket'; 

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",  
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000, 
  transports: ['websocket', 'polling']  
});

initializeSocket(io);

app.use(express.json());
app.use(cors({
  origin: "*",
}));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/message', messageRoutes);

connect();

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

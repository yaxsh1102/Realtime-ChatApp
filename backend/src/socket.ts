import { Server, Socket } from "socket.io";
import { Request, Application } from 'express';
import http from "http";
import jwt from "jsonwebtoken";
import { User } from "./models/user.schema";
import app from ".";

declare module 'express' {
  interface Request {
    app: Application & {
      get(key: 'io'): Server;
    };
  }
}

export interface SocketData {
  id: string;
  name: string;
  email: string;
}

// Extend Socket type to include our custom data
interface CustomSocket extends Socket {
  data: {
    user: SocketData;
  };
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const mountJoinChatEvent = (socket: CustomSocket) => {
  socket.on("JOIN_CHAT", (chatId: string) => {
    console.log(`User joined the chat 🤝. chatId: `, chatId);
    socket.join(chatId);
  });
};

const mountParticipantTypingEvent = (socket: CustomSocket) => {
  socket.on("USER_TYPING", (chatId: string) => {
    socket.in(chatId).emit("USER_TYPING", chatId);
  });
};

const mountParticipantStoppedTypingEvent = (socket: CustomSocket) => {
  socket.on("USER_STOPPED_TYPING", (chatId: string) => {
    socket.in(chatId).emit("USER_STOPPED_TYPING", chatId);
  });
};

type JwtPayload = {
  id: string;
};

const initializeSocketIO = (io: Server) => {
  return io.on("connection", async (socket: CustomSocket) => {
    try {
      const token = socket.handshake.auth?.token;
      
      if (!token) {
        socket.emit("SOCKET_ERROR", "No token provided.");
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      const user = await User.findById(decoded.id);
      
      if (!user) {
        socket.emit("SOCKET_ERROR", "User not found.");
        return;
      }

      const userData: SocketData = {
        id: user._id as string,
        name: user.name,
        email: user.email
      };

      socket.data.user = userData;
      socket.emit("USER_CONNECTED");
      console.log("User connected 🗼. userId: ", userData.id);
      
      socket.join(userData.id);
      
      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);

    } catch (error) {
      socket.emit(
        "SOCKET_ERROR",
        "Something went wrong while connecting to the socket."
      );
    }
  });
};



const emitSocketEvent = <T>(
  req: Request,
  roomId: string,
  event: string,
  payload: T
): void => {
  const io = req.app.get('io');
  io.in(roomId).emit(event, payload);
};

export {
  initializeSocketIO,
  emitSocketEvent,
  server,
  io,
  CustomSocket,
};
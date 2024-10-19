import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<{ children: React.ReactNode; userId?: string }> = ({ children, userId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const ENDPOINT = "http://localhost:4000";

  useEffect(() => {
    const newSocket = io(ENDPOINT, {
      transports: ['websocket', 'polling'],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      if (userId) {
        newSocket.emit('initializeUser', userId);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

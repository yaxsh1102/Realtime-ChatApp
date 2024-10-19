import { io, Socket } from 'socket.io-client';

const URL = "http://localhost:4000";
const socket: Socket = io(URL, {
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('Socket connected! ID:', socket.id); 
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);  
});

// Emit events

export default socket

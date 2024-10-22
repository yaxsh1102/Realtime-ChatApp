import {  io } from 'socket.io-client';

const socket = io("http://localhost:4000" ,{
    reconnectionAttempts: 5,  // Number of reconnection attempts before giving up
    timeout: 10000,           // Timeout for connection in milliseconds
    autoConnect: true         // Automatically connect upon initializing the socket
} )


socket.on('connect', () => {
    console.log('Socket connected with ID:', socket.id);
  });

  socket.onAny((eventName, ...args) => {
    console.log('Socket Event:', eventName, 'Data:', args);
  });

export default socket

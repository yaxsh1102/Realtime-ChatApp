import {  io } from 'socket.io-client';

const socket = io("http://localhost:4000/" ,{
    reconnectionAttempts: 5,  
    timeout: 10000,          
    autoConnect: true         
} )


socket.on('connect', () => {
    console.log('Socket connected with ID:', socket.id);
  });

 

export default socket

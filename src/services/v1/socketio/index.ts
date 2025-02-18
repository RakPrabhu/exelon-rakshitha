import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

// Create Express server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow any origin for testing
    methods: ["GET", "POST"]
  },  transports: ["websocket", "polling"]
});

// Serve client-side HTML (if any)
app.use(express.static('public'));

// Handle new WebSocket connections
io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for GET_SCORE request
  // socket.on('GET_SCORE', () => {
  //   console.log('Client requested score');
  //   socket.emit('SCORE_UPDATE', { message: 'Fetching live scores...' });
  // });

  // Receive scores from scraper and send to all clients
  socket.on('SCORE_UPDATE', (matchDetails) => {
    console.log('Received match details:', matchDetails);
    io.emit('SCORE_UPDATE', matchDetails); // Broadcast to all connected clients
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

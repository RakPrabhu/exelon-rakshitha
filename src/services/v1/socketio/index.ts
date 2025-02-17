import express from 'express';
import http from 'http';
import socketIo from 'socket.io';

// Create an Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new socketIo.Server(server);

// Serve the client-side HTML from the /public directory
app.use(express.static('public'));

// Listen for incoming connections from clients
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

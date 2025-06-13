import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import boardRoutes from './routes/board.js';
import cardRoutes from './routes/cards.js';
import taskRoutes from './routes/tasks.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

io.on('connection', socket => {

  socket.on('joinBoard', boardId => {
    socket.join(boardId);
  });

  socket.on('taskUpdated', ({ boardId, task }) => {
    socket.to(boardId).emit('taskUpdated', task);
  });

  socket.on('disconnect', () => {
  });
});

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/boards', boardRoutes);
app.use('/boards/:boardId/cards', cardRoutes);
app.use('/boards/:boardId/cards/:cardId/tasks', taskRoutes);
app.use('/users', userRoutes);


server.listen(3001, () => {
  console.log('Backend running with Socket.IO at http://localhost:3001');
});

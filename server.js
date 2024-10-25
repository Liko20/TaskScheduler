const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const filtering = require('./routes/filtering');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));


mongoose.connect(   process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', socket => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/tasks' ,filtering);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

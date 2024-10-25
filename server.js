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


mongoose.connect( `mongodb+srv://liko:${process.env.ATLAS_PASS}@cluster0.9l161.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to MongoDB Atlas!');
})
.catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});;



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

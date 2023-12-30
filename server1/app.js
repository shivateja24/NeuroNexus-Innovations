const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./auth/authRoutes');
const taskRoutes = require('./task/taskRoutes');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());

mongoose.connect('mongodb+srv://tejashiva465:sqbPXzIYkhMgISnN@cluster0.jgtmhae.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
connection.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.json());

// Auth routes
 app.use('/auth', authRoutes);

// Task routes
 
app.use('/tasks', taskRoutes);  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

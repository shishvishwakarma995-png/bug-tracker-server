const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
connectDB();


app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://bug-tracker-client-8667.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true
}));


app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: 'Bug Tracker API is running' });
});


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/projects/:projectId/tickets', require('./routes/ticketRoutes'));
app.use('/api/projects/:projectId/sprints', require('./routes/sprintRoutes'));
app.use('/api/tickets/:ticketId/comments', require('./routes/commentRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
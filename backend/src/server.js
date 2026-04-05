const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const admissionMethodRoutes = require('./routes/admissionMethodRoutes');
const majorRoutes = require('./routes/majorRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const articleRoutes = require('./routes/articleRoutes');
const statisticRoutes = require('./routes/statisticRoutes');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Cho phép ông 3000 truy cập
  credentials: true
}));
// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_CONNECTIONSTRING)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admission-methods', admissionMethodRoutes);
app.use('/api/majors', majorRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/statistics', statisticRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
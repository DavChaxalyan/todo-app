const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// routes
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/profile'));
app.use('/api', require('./routes/todoLists'));
app.use('/api', require('./routes/searchUsers'));
app.use('/api', require('./routes/friends'));
app.use('/api', require('./routes/friendRequests'));

// Static serving of files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Что-то пошло не так!');
});

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

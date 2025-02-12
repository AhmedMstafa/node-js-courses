const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const httpStatusText = require('./utils/httpStatusText');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT;
const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
  console.log('mongodb server started');
});

app.use(cors());

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const coursesRouter = require('./routes/courses.routes');
const usersRouter = require('./routes/users.routes');

app.use('/api/courses', coursesRouter);

app.use('/api/users', usersRouter);

// global middleware for not foun router
app.all('*', (req, res, next) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    message: 'this resourse is not avilable',
  });
});

// global middleware for errors
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    message: error.message,
    status: error.statusText || httpStatusText.ERROR,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const MONGODB_URI =
  'mongodb+srv://federico2:mCjsqT1v0dmIEhlS@cluster0-88ugq.mongodb.net/messages?retryWrites=true&w=majority';

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const fileName =
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
    console.log('filename ', fileName);
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

//__dirname is the absolute path of the proyect
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

//settings the socket.io channels
//do not interfere with the normal requests

//this is the general error handling functionality
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  const message = error.message;
  const data = error.data; //passing the error to the frontend
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(result => {
    const server = app.listen(8080);
    const io = require('./socket').init(server);
    //setting up a listener when a connection is built between the client and the server
    io.on('connection', socket => {
      console.log('Client connected');
    });
    console.log('Connected!');
  })
  .catch(err => console.log(err));

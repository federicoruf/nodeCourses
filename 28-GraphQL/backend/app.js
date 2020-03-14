/*
A PROBAR:
* CREAR UN POST
* VER SI LOS POSTS CREADOS SE CARGAN EN EL ARRAY DEL USUARIO Q LO CREO
* AL CRAER EXITOSAMENTE EL POST VA A TIRAR UN ERROR SOBRE _ID, PERO LO VA A CREAR BIEN
*/
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const graphqlHttp = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');
const auth = require('./middleware/auth');

const { clearImage } = require('./util/file');

const MONGODB_URI =
  'mongodb+srv://federico2:mCjsqT1v0dmIEhlS@cluster0-88ugq.mongodb.net/messages?retryWrites=true&w=majority';

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const fileName =
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
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
  //in case the request is option's type, I just return an empty response with 200 status.
  //This is because graphql doesn't accept this kind of request and will responde with the error
  //method not allowed
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

//this is only to set to false if the token is not set
app.use(auth);

app.put('/post-image', (req, res, next) => {
  if (!req.isAuth) {
    throw new Error('not authenticated');
  }

  if (!req.file) {
    return res.status(200).json({ message: 'No file provided!' });
  }
  //If the post already habe an image, I'll replace it with a new one
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  return res
    .status(201)
    .json({ message: 'File stored.', filePath: req.file.filename });
});

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    customFormatErrorFn(err) {
      //with this I can customize the error thrown by graphql
      if (!err.originalError) {
        //this will just throw common errors, like missing characters
        return err;
      }
      const data = err.originalError.data;
      const messsage = err.message || 'An error occurred.';
      const code = err.originalError.code || 500;
      return { message: messsage, status: code, data: data };
    }
  })
);

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
/*
app.listen(8080);
console.log('Connected!');
*/
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(result => {
    app.listen(8080);
    console.log('Connected!');
  })
  .catch(err => console.log(err));

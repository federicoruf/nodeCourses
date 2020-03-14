const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
  'mongodb+srv://federico2:federico2@cluster0-88ugq.mongodb.net/test?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

//MULTER VARIABLES
const fileStorage = multer.diskStorage({
  //path where to storage the file
  destination: (req, file, cb) => {
    //(err, where to store)
    cb(null, 'images');
  },
  // },
  // //structure of the filenames
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(':', '-') + '-' + file.originalname
    );
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

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

//this parser is not able to transform files
app.use(bodyParser.urlencoded({ extended: false }));

//when the library is initialize, this is specified:
//  It's the same name "image", as the input that will contains the file
//  It's a single file
//{dest: 'images'} dest: This is a path where the files will be stored. It's a folder inside the proyect
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use(express.static(path.join(__dirname, 'public')));
//specifing the folder like this will look for the images inside the root folder(public) and then /images
//app.use(express.static(path.join(__dirname, 'images')));
//the solution is to force where to look for the images
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection);

//this must be after beeing configured the session
app.use(flash());

//this is add two varibles to each request exceuted so they'll accesable
//to the view
app.use((req, res, next) => {
  console.log('mid - auth');
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken(); //this is using a method addede by the csuft library
  next();
});

app.use((req, res, next) => {
  console.log('mid - user');
  //here the error is detected and handle by express
  //throw new Error('Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      //WHEN THROWING AN ERROR INSIDE ASYNC CODE IT'LL NOT REACH THE
      //ASYNC CODE, SOMETHING IS NECESARY
      //throw new Error('Dummy');

      //this is a precaution so I don't save undefined inside the req.user
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    //in this case I'm handling a tecnical issue to connect with the database
    .catch(err => {
      //it's not useful to log the error
      //console.log(err);
      //it's better to throw it
      //HERE IN THE CATCH, I WRAP THE ERROR INSIDE THE NEXT FUNCTION
      next(new Error(err));
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

//this is another kind of middleaware with 4 arguments
//special for handling error
app.use((error, req, res, next) => {
  console.log('mid - error');
  //I can also set the error status to the response
  //res.status(error.httpStatusCode).res.render(...);
  //res.redirect('/500');

  //if I redirect, it'll enter in an infinite loop because the error is been thrown inside
  //the "user middleware that is beening invoked before each incoming request"
  //console.log(req);
  console.log(error);
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    //isAuthenticated: req.session.isLoggedIn
    isAuthenticated: true
  });
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(result => {
    console.log('Connected!');
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

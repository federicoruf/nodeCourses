const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');

const app = express();

//this is adding the middleware necesary to transform the posts bodies
//after the urlencoded ends, it will automatically invoke the next();
app.use(bodyParser.urlencoded({ extended: false }));

//this is adding a filter to the routing file, so it's no need to add to the all endpoint the
//reference to /admin
app.use('/admin', adminRoute);
app.use(shopRoute);

//with this middleware each incoming request will be attended
app.use((req, res, next) => {
  console.log('middleware para todos');
  //this function will make the next middleware to be executed
  next();
});

//this is specifing the path where express can access to static files
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  //here I'm chaning the operations over the res parameter
  res.status(404).sendFile(path.join(__dirname, 'views', 'error.html'));
  //res.status(404).send('<h1>Page not found</h1>');
});

/*
//this adds a new middleware function
app.use((req, res, next) => {
  console.log('middleware');
  //this function will make the next middleware to be executed
  next();
});

app.use((req, res, next) => {
  console.log('other middleware');
  res.send('<h1>hello from express</h1>');
});
*/

//express is already creating the server when the listen function is invoked
app.listen(3000);
/*
SOOO... this code is noy any more necesary
const server = http.createServer(app);
server.listen(3000);
*/

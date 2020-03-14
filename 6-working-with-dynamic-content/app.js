const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//sets the engine because this one is not build-in
//app.engine('handlebar', handleHbs());
//now I can set the view engine
//the second attribute is also defing the extension of the template files
//app.set('view engine', 'handlebar');

//sets the template engine to use
//app.set('view engine', '');
//sets the folder where the templates views are going to locate
//app.set('views', 'views')

app.set('view engine', 'ejs');
app.set('views', 'views')

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.router);
app.use(shopRoutes);

app.use((req, res, next) => {
  //now that I define the location of the view files, it's no need to indicate it and just render the template
  //res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  //I'm setting also some parameters/dinamic content
  res.status(404).render('404', { pageTitle: 'Page Not Found'});
});

app.listen(3000);

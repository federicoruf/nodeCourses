//this middleware is just checking if there is any user loggedin
//If there is, it's comming on the request by been set in another
//middleware(I can found it in the app.js)
module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  next();
};

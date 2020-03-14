exports.getLogin = (req, res, next) => {
  // console.log(req.get('Cookie'));
  // let isLoggedIn;
  // if (req.get('Cookie')) {
  //   isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
  // }
  // console.log('isLoggedIn: ', isLoggedIn);
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    pageTitle: 'Add Product',
    path: '/login',
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  //intead of use the cookie, I use the session plugin
  //res.setHeader('Set-Cookie', 'loggedIn=true; Max-age=10; Secure');
  req.session.isLoggedIn = true;
  res.redirect('/');
};

exports.postLogout = (req, res, next) => {
  //this is deleting the session in the database
  // the destroy function is provided by the plugin
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

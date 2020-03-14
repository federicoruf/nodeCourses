const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  //Checking if the Authorization header exist
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  //I split the token beacuse it has the Bearer word
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    //verifies the token using the secret key
    decodedToken = jwt.verify(token, 'secret');
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  //decodedToken contains all the information that I set inside the object
  req.userId = decodedToken.userId;
  req.userId2 = decodedToken.userId;
  req.isAuth = true;
  next();
};

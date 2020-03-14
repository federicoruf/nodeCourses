const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  //Checking if the Authorization header exist
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
  //I split the token beacuse it has the Bearer word
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    console.log('token: ', token);
    //verifies the token using the secret key
    decodedToken = jwt.verify(token, 'secret');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
  //decodedToken contains all the information that I set inside the object
  req.userId = decodedToken.userId;
  next();
};

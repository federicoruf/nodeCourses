const express = require('express');
const rootDir = require('../util/path');
const path = require('path');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('middleware de /');
  //sendFile requires the full path location of the file is going to be use
  //__dirname => is the path to the file where is running this code
  //because of the view file is in al previous folder, the ../ is require
  //views => is entering to the views folder
  //Finally it's requering the file
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  //res.send('<h1>hello from express from default</h1>');
});

module.exports = router;

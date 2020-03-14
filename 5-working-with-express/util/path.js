const path = require('path');

//in this module i'm just returning the path of the file I'm running
module.exports = path.dirname(process.mainModule.filename);
//process.mainModule is reffering to the main file that starts the app

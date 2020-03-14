//making available some features that came with node
//if require makes reference to a file, it must starts with ./
//require automatically adds ".js" to the end of the referenced file
const http = require('http');

const routes = require('./routes');

//this request is going to be excecuted for every incomming request to the serve
const server = http.createServer(routes);
/*
  (req, res) => {


  
  //process.exit();
  //makes the program to shotdown
  //const method = req.method;
  //const url = req.url;
});
*/
//this makes the file to keep running and listening to incoming requests
server.listen(3000);

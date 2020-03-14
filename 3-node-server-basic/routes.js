const fs = require('fs');

const requestHandler = (req, res) => {
  const url = req.url;
  console.log(req.method);
  console.log(req.url);
  const method = req.method;
  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>bbbbb</title></head>');
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"/><button type="submit">Send</button></form></body>'
    );
    res.write('</html>');
    return res.end();
  }
  if (url === '/message' && method === 'POST') {
    const body = [];

    //reading the chucks of data comming into the buffer
    req.on('data', chunk => {
      console.log(chunk);
      body.push(chunk);
    });

    //here i'm interacting with all the chucks of data readed
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      const message = parsedBody.split('=')[1];
      //this will lock the code until the complete file is already readed
      fs.writeFileSync('message.txt', message);
      //this is the same operation with the simple difference that has a callback
      //this callback will be invoked after the file was written
      fs.writeFile('message.txt', message, err => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>aaaaaa</title></head>');
  res.write('<body><h1>holis</h1></body>');
  res.write('</html>');
  res.end();
};

module.exports = requestHandler;

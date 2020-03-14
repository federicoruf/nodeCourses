const express = require('express');

const feedRouter = require('./routes/feed');

const app = express();

//every incoming request that start with /feed will be handle by this middleware
app.use('/feed', feedRouter);

app.listen(8080);

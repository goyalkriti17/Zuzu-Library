var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// var cors = require('cors');
var app = express();

var PORT = parseInt("9000", 10);

var tokenMiddleware = require('./Library/middleware/token');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// app.use(cors());

mongoose.connect('mongodb://localhost:27017/zuzu');

var usersRoutes = require('./Library/routes/users');
var bookRoutes = require('./Library/routes/books');

app.use('/api/users', usersRoutes);
app.use('/api/books', bookRoutes);


var server = app.listen(PORT, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);
});

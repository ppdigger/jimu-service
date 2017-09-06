var express = require('express');
var bodyParser = require('body-parser');
var jwt = require("jwt-simple");
var logger = require('morgan');
var sd = require('silly-datetime');
var app = express();

var api = require('./routes/api');

app.set('jwtTokenSecret', 'shao')

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    console.log(time);
    next();
});

app.use('/api', api);



app.listen(3000);

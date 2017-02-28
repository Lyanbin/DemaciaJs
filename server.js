/**
 * @file 测试服务器
 * @author guoxianglin@baidu.com
 */

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const pageApp = express();

app.use(express.static('dist'));
pageApp.use(express.static(path.join(__dirname, 'page')));
app.use(bodyParser.text());
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('X-Powered-By', 'lyb');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

app.get('/apminfo', function (req, res) {
    res.send('ohyeah');
    console.log('get something!');
    console.log(req.query);
});

// app.post('/apmpost', urlencodedParser, function (req, res) {
app.post('/apminfo', function (req, res) {
    res.send('ohpost');
    console.log('post something!');
    // console.log(req);
    let reqJson = JSON.parse(req.body);
    console.log(reqJson);
    console.log(reqJson.a);
});

const server = app.listen(3000, function () {
    const host = server.address().address;
    const port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

const pageServer = pageApp.listen(3456, function () {
    const pageHost = pageServer.address().address;
    const pagePort = pageServer.address().port;

    console.log('Example page listening at http://%s:%s', pageHost, pagePort);
});

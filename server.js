/**
 * @file 测试服务器
 * @author guoxianglin@baidu.com
 */

const express = require('express');
const app = express();

app.use(express.static('dist'));

app.get('/apm.gif', function (req, res) {
    res.send('ohyeah');
    console.log(req.query);
});

const server = app.listen(3000, function () {
    const host = server.address().address;
    const port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

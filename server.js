const express = require('express');
const http = require('http');
const path = require('path');
const reload = require('reload');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookie = require('cookie-parser');
const axios = require("axios");

// 统一基准地址
const R = axios.create({baseURL: 'http://localhost:5000'})
// 响应拦截器（统一错误处理）
R.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            window.location.href = "/login";
        } else if (!error.response) {
            console.log('请求已经发出，但没有收到响应。');
        } else {
          console.log('在设置请求时发生了某些事情。');
        }
        //err.response.status = 200;
        return Promise.reject(error);
    }
);

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json()); // Parses json, multi-part (file), url-encoded

app.use('/amis', express.static('./node_modules/amis'));
app.use('/vue', express.static('./node_modules/vue'));
app.use('/history', express.static('./node_modules/history'));
app.use('/echarts', express.static('./node_modules/echarts'));
app.use('/public', express.static('./public'));
app.use('/favicon.ico', (req, res) => { res.status(200).end(); });

//function AuthMiddleware(req, res, next) {
//    console.log('auth.middleware',req);
//    if (req.url.startsWith('/login')) {
//        next()
//        return
//    }
//    if (!req.cookies.amisToken) {
//        res.redirect("/login.html")
//        return
//    }
//    next();
//}
//app.use(AuthMiddleware)

app.get('/login', function (req, res) { res.sendFile(path.join(__dirname, 'login.html')); });
app.get('/api/*', async (req, res) => { await R.get(req.originalUrl).then(response => { res.json(response.data) }) });
app.get('/*', function (req, res) { res.sendFile(path.join(__dirname, 'index.html')); });
app.post('/*', async (req, res) => { await R.post(req.originalUrl,req.body).then(response => { res.json(response.data) }) });

const server = http.createServer(app);

// Reload code here
reload(app)
    .then(function (reloadReturned) {
        // Reload started, start web server
        server.listen(app.get('port'), function () {
          console.log('Web server listening on port http://localhost:' + app.get('port') );
        });
    })
    .catch(function (err) {
        console.error('Reload could not start, could not start server/sample app', err );
    });

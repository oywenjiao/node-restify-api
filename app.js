"use strict";
const restify = require('restify');
const config = require('./app/config/env.json');
const jwt = require(process.cwd()+'/app/tool/token');


const server = restify.createServer({
    name: "node-api",
    version: "1.0.0"
});

// 解析HTTP查询字符串(如:/jobs?skills=node),解析后的内容将会在req.query里可用
server.use(restify.plugins.queryParser());
// 在服务器上自动将请求数据转换为JavaScript对象
server.use(restify.plugins.bodyParser());

// 全局get请求
server.get('/route', function (req, res) {
    return res.send(201, {
        "code": 404,
        "sub_code": "warn.required-parameter:url",
        "msg": "请使用POST方式提交数据!"
    });
});

// 注册
server.post('/route/register', function (req, res, next) {
    return res.send({'msg':'注册接口,返回token', 'token':jwt.createToken({uid:1001, aa:'232323'}, 120)});
});

server.post('/route', function (req, res, next) {
    let token = req.headers.token;
    if (!token)
        return res.send(201, {
            "code": 404,
            "sub_code": "warn.required-parameter:token",
            "msg": "token参数无效!"
        });
    console.log(req.params);
    console.log('1111',jwt.verifyToken(token));
    return res.send({'msg':'test', 'data': 'success', 'token': jwt.verifyToken(token)});
});

server.listen(config.port, function() {
    console.log('%s listening at %s', server.name, server.url);
});
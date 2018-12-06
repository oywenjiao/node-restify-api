"use strict";
/**
 * 加载相关模块
 */
const restify = require('restify');
const Promise = require('bluebird');
const config = require(process.cwd()+'/app/config/env.json');
const jwt = require(process.cwd()+'/app/tool/token');
const Helper = require(process.cwd()+'/app/tool/helper');

/**
 * 创建服务
 * @type {Server}
 */
const server = restify.createServer({
    name: "node-api",
    version: "1.0.0"
});

/**
 * 载入服务暴露的插件
 */
// 解析HTTP查询字符串(如:/jobs?skills=node),解析后的内容将会在req.query里可用
server.use(restify.plugins.queryParser());
// 在服务器上自动将请求数据转换为JavaScript对象
server.use(restify.plugins.bodyParser());


/**
 * 拦截get方式请求
 */
server.get('/route', function (req, res) {
    return res.json(Helper.jsonError("请使用POST方式提交数据!!!", 404));
});

/**
 * 登录接口
 * 用户存在则验证登录信息，不存在则注册新账号
 */
server.post('/route/login', function (req, res) {
    let login = './app/version/login.js';
    const loginController = require(login);
    Promise.using(loginController(req.params), function (ret) {
        if (ret.hasOwnProperty('code'))
            return res.json(ret);
        // 生成token
        let response = {
            'token': jwt.createToken({
                uid: ret.id,
                phone: ret.phone
            }, '7 days')
        };
        return res.json({'code':0, 'response': response});
    })
});

/**
 * 数据请求接口
 * @param req   接收请求参数
 * @param res   返回回调
 * @param next  继续执行
 */
server.post('/route', function (req, res, next) {
    // 接收header头里的token参数
    let token = req.headers.token;
    if (!token)
        return res.json(Helper.jsonError('token 参数无效'));
    // 验证token是否过期
    let verify_token = jwt.verifyToken(token);
    if(verify_token.state != 0)
        return res.json(Helper.jsonError(verify_token.msg));
    // 验证用户信息是否存在
    let verify = './app/version/verify.js';
    let verifyController = require(verify);
    Promise.using(verifyController(verify_token.decoded), function (ret) {
        if(ret.code != 0)
            return res.json(Helper.jsonError(ret.msg));
        else if(!ret.response.length)
            return res.json(Helper.jsonError('token 参数无效!!!'));
        return next();
    })
},function (req, res, next) {
    // 检测必传参数
    if(!req.params.v || !req.params.method)
        return res.json(Helper.jsonError('缺少必要的公共参数!!', 401));
    return next();
},function (req, res) {
    return res.json(req.params);
});

/**
 * 启动应用
 * 配置端口
 */
server.listen(config.port, function() {
    console.log('%s listening at %s', server.name, server.url);
});
const Promise = require('bluebird');
// 加载数据库连接池
const dbConnection = require(process.cwd()+'/app/database/db.api');
// 加载工具库
const Helper = require(process.cwd()+'/app/tool/helper');
// 加载数据库操作模块
const Model = require('../module/model');

module.exports = function (data) {
    let pwd = data.password;
    let phone = data.phone;
    if(!pwd || !phone)
        return {
            'code': 401,
            'msg': '缺少必要参数!!'
        };
    // 验证手机号
    if(!Helper.isPhoneAvailable(phone))
        return {
            'code': 401,
            'msg': '请输入正确的手机号!'
        };
    // 查询用户是否存在
    return Promise.using(dbConnection(), function (connection) {
        return Promise.using(Model
            .field(['id', 'phone', 'pwd'])
            .where('phone', phone)
            .select('auth', connection), function (result) {
                return result[0];
        }).then(function (user) {
            if (user) {
                let currentPwd = Helper.hmacSha1(pwd);
                if(currentPwd != user.pwd) {
                    return {
                        'code': '401',
                        'msg': '密码错误!!'
                    };
                }
                return user;
            }
            // 用户不存在进行注册
            let newPwd = Helper.hmacSha1(pwd);
            let created =  Date.parse(new Date())/1000;
            return Promise.using(Model.insert('auth', connection, {
                "phone": phone,
                "pwd": newPwd,
                "created": created,
                "updated": created
            }), function (result) {
                return result;
            }).then(function (user) {
                if (user.hasOwnProperty('code')) {
                    return user;
                }
                let uid = user.insertId;
                // 查询用户信息
                return Promise.using(Model.
                field(['id', 'phone']).
                where('id', uid).
                select('auth', connection), function (result) {
                    return result[0];
                })
            })
        }).then(function (response) {
            return response;
        })
    }).then(function (result) {
        return result;
    });
};
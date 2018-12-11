const Promise = require('bluebird');
// 加载数据连接池
const dbConnection = require(process.cwd()+'/app/database/db.api');
const Helper = require(process.cwd()+'/app/tool/helper');
// 加载数据库操作模块
const Model = require('../../../../../app/module/model');

module.exports = function (params) {
    let name = params['name'];
    let nick_name = params['nick_name'];
    let phone = params['phone'];
    // 验证必要参数
    if(!name || !nick_name || !phone)
        return Helper.jsonError('', 401);
    // 验证手机
    if(!Helper.isPhoneAvailable(phone))
        return Helper.jsonError('请输入正确的手机号!');
    let created =  Date.parse(new Date())/1000;
    let data = {
        "name": name,
        "nick_name": nick_name,
        "phone": phone,
        "created": created,
        "updated": created
    };
    return Promise.using(dbConnection(), function (connection) {
        // 查询手机号是否已注册
        return Promise.using(Model
            .field(['id', 'phone'])
            .wheres('phone', phone)
            .select('user', connection), function (result) {
                return result;
        }).then(function (user) {
            if (user.length)
                return Helper.jsonError('该手机号已注册!');
            // 手机号未注册，进行注册操作
            return Promise.using(Model.insert('user', connection, data), function (result) {
                return result;
            }).then(function (user) {
                if (user.hasOwnProperty('code')) {
                    return user;
                }else {
                    return Helper.jsonSuccess('注册成功!');
                }
            })
        })
    }).then(function (result) {
        return result;
    })
};
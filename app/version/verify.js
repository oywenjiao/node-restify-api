// 加载数据连接池
const dbConnection = require(process.cwd()+'/app/database/db.api');
const Promise = require('bluebird');
// 加载数据库操作模块
const Model = require('../module/model');

module.exports = function (data) {
    let uid = data['uid'];
    return Promise.using(dbConnection(), function (connection) {
        // 查询用户是否存在
        return Promise.using(Model
            .field(['id', 'phone'])
            .where('id', uid)
            .select('auth', connection), function (result) {
            return result;
        }).then(function (user) {
            return user;
        });
    }).then(function (result) {
        // 判断返回值是否包含code参数
        if (result.hasOwnProperty('code'))
            return result;
        return {'code':0, 'msg': 'success', 'response': result};
    });
};
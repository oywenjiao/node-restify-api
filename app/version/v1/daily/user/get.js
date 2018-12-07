// 加载数据连接池
const dbConnection = require(process.cwd()+'/app/database/db.api');
const Promise = require('bluebird');
const Helper = require(process.cwd()+'/app/tool/helper');
// 加载数据库操作模块
const Model = require('../../../../../app/module/model');

module.exports = function (data) {
    let uid = data['uid'];
    if (!uid)
        return Helper.jsonError('uid不能为空!', 401);
    return Promise.using(dbConnection(), function (connection) {
        return Promise.using(Model.find('user', uid, connection), function (result) {
            return result;
        })
    }).then(function (result) {
        if (result.hasOwnProperty('code'))
            return Helper.jsonError('网络繁忙，稍后再试!');
        return Helper.jsonSuccess(result[0]);
    })
};
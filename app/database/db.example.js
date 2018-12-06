const mysql = require('promise-mysql');
const config = require('../config/env.json');

/**
 * 创建mysql连接池
 * 传入mysql链接配置参数
 * poolXXX 根据库配置重定义
 * @type {pool}
 */
poolExample = mysql.createPool(config.mysql.example);

/**
 * 封装成全局可调用，且支持Promise方式的对象
 * @returns {Bluebird.Disposer<R> | * | void}
 */
function getSqlConnection() {
    return poolExample.getConnection().disposer(function(connection) {
        // 释放连接
        poolExample.releaseConnection(connection);
    });
}
module.exports = getSqlConnection;
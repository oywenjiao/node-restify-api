const Sequelize = require('sequelize');
// 引入配置文件
const config = require('../config/env.json');
// 引入log4js日志管理组件
const log4js = require('log4js');

log4js.configure({
    appenders: {
        example: {type: 'file', filename: process.cwd()+'/app/logs/example.log'}
    },
    categories: {
        default: {appenders: ['example'], level: "debug"}
    }
});

const logger = log4js.getLogger('example');


module.exports = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+08:00', // 设置时区
    logging: config.sequelize_debug ? (sql) => {info(sql)} : config.sequelize_debug,    // 配置日志输出方式
    pool: {
        max: 5, // 连接池中最大连接数量
        min: 0, // 连接池中最小连接数量
        idle: 10000 // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程。单位是毫秒
    }
});

// 调试SQL
function info(message) {
    logger.debug(message);
}

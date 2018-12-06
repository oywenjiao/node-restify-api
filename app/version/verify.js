// 加载数据连接池
const dbConnection = require(process.cwd()+'/app/database/db.api');
const Promise = require('bluebird');

module.exports = function (data) {
    let uid = data['uid'];
    return Promise.using(dbConnection(), function (connection) {
        // 查询用户是否存在
        let sql = 'select phone from auth where id = ? limit 1';
        return connection.query(sql, uid).then(function (result) {
            return result[0];
        }).then(function (user) {
            // 返回查询的用户信息
            return {"data": user};
        }).catch(function (err) {
            return {'code': 401, 'msg': 'fail' + err};
        })
    }).then(function (result) {
        // 判断返回值是否包含code参数
        if (result.hasOwnProperty('code'))
            return result;
        return {'code':0, 'msg': 'success', 'response': result};
    });
};
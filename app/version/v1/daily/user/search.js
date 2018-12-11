const Promise = require('bluebird');
// 加载数据连接池
const dbConnection = require(process.cwd()+'/app/database/db.api');
const Helper = require(process.cwd()+'/app/tool/helper');
// 加载数据库操作模块
const Model = require('../../../../../app/module/model');

module.exports = function (params) {
    let phone = params.phone;
    let name = params.name;
    let nick_name = params.nick_name;
    let status = params.status;
    let page = params.page_no;
    page = page ? page : 1;
    let size = params.page_size;
    size = size ? size : 10;
    if(!phone && !name && !status && !nick_name)
        return Helper.jsonError('搜索条件:phone、name、status、nick_name,请至少指定一个!', 401);
    return Promise.using(dbConnection(), function (connection) {
        return Promise.using(Model
            .wheres('name', 'like', name)
            .orWhere('status', 1)
            .page(page, size)
            .select('user', connection), function (result) {
                return result;
        })
    })
};

const Helper = require('../tool/helper');
function Model(){

}

let firstRow = 0;   // 分页查询起始数据
let row = 1;    // 分页查询数据条目数
let field_options = null;  // 查询数据库字段
let where_options = null;   // where表达式
let value = [];  // where表达式字段值

Model.prototype = {
    field_options,
    firstRow,
    row,
    field,
    where_options,
    value,
    where,
    limit,
    insert,
    getQuery,
    select,
    restOption,
    find,
};

/**
 * 插入数据
 * @param tab   操作的数据表
 * @param connection    数据连接池
 * @param data  数据对象
 * @returns {Bluebird<any> | * | Bluebird<R | never> | PromiseLike<T | never> | Promise<T | never>}
 * 返回值为Promise
 */
function insert(tab, connection, data) {
    let sql = this.getQuery(tab, 'add');
    let field = 'values (';
    let value = [];
    for (let i in data){
        sql += i + ',';
        field += '?,';
        value.push(data[i]);
    }
    sql = Helper.trim(sql, ',');
    field = Helper.trim(field, ',');
    sql += ') ' + field + ')';
    return connection.query(sql, value).then(function (result) {
        return result;
    }).catch(function () {
        return {'code':401, 'msg': '数据存储失败,稍后再试!'};
    })
}

/**
 * 指定查询字段
 * @param fields
 */
function field(fields){
    this.field_options = fields;
    return this;
}

/**
 * 拼接 where 条件式
 * @param column    查询字段
 * @param operator  表达式
 * @param value 字段值
 * @returns {where}
 */
function where(column, operator, value=null){
    if (value === null){
        value = operator;
        operator = '=';
    }
    if (this.where_options === null)
        this.where_options = column + ' ' + operator + ' ? ';
    else
        this.where_options += ' and ' + column + ' ' + operator + ' ? ';
    this.value.push(value);
    return this;
}

/**
 * 分页查询数据
 * @param firstRow  起始数据
 * @param row   数据条目数
 * @returns {limit}
 */
function limit(firstRow, row=null) {
    if (row === null){
        this.row = Math.abs(firstRow);
    } else {
        this.firstRow = Math.abs(firstRow);
        this.row = Math.abs(row);
    }
    return this;
}

/**
 * 根据type类型获取SQL语句
 * @param tab   数据表名称
 * @param type  操作类型
 * @returns {string}
 */
function getQuery(tab, type) {
    let query = '';
    switch (type) {
        case 'add':
            query += 'insert into ' + tab + ' (';
            break;
        case 'del':
            query += 'delete from ' + tab + ' ';
            break;
        case 'update':
            query += 'update ' + tab + ' ';
            break;
        case 'select':
            query += 'select ?? from ' + tab + ' where ';
            break;
        default :
            query += 'select ?? from ' + tab + ' where ';
            break;
    }
    return query;
}

/**
 * 执行查询操作
 * @param tab   数据表名称
 * @param connection    数据库连接池
 * @returns {*} 返回值为Promise
 */
function select(tab, connection){
    if (this.field_options === null)
        return {'code': 401, 'msg': '请指定查询字段'};
    else if (!(this.field_options instanceof Array))
        return {'code': 401, 'msg': '字段表达式必须为数组'};
    if (this.where_options === null)
        return {'code': 401, 'msg': '请指定查询条件'};
    // 获取查询语句
    let sql = this.getQuery(tab, 'select') + this.where_options;
    // 预处理赋值
    this.value.unshift(this.field_options);
    // 判断limit语句
    if (this.firstRow > 0) {
        sql += ' limit ? , ?';
        this.value.push(this.firstRow, this.row);
    } else {
        sql += ' limit ?';
        this.value.push(this.row);
    }
    // 执行SQL
    let self = this;
    return connection.query(sql, this.value).then(function (result) {
        self.restOption();
        return result;
    }).catch(function (err) {
        self.restOption();
        return {'code': 401, 'msg': '查询错误', 'sub_code': err};
    })
}

/**
 * 充值属性值
 */
function restOption(){
    this.firstRow = 0;   // 分页查询起始数据
    this.row = 1;    // 分页查询数据条目数
    this.field_options = null;  // 查询数据库字段
    this.where_options = null;   // where表达式
    this.value = [];  // where表达式字段值
}

/**
 * 通过主键ID查询数据
 * @param tab
 * @param id
 * @param connection
 * @returns {*}
 */
function find(tab, id, connection){
    if (parseFloat(id).toString() == "NaN")
        return Helper.jsonError('id 参数无效!');
    let field = '*';
    let value = [];
    if (this.field_options !== null) {
        field = '??';
        value.push(this.field_options);
    }
    let sql = 'select ' + field + ' from ' + tab + ' where id = ? limit 1';
    value.push(id);
    // 执行查询操作
    return connection.query(sql, value).then(function (result) {
        return result;
    }).catch(function (err) {
        return {'code': 401, 'msg': '查询错误', 'sub_code': err};
    })
}


module.exports = new Model();
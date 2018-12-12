const model = require('../model/product');
const Product = model.Product;
const Op = model.Op;
const Helper = require(process.cwd()+'/app/tool/helper');

module.exports = function (params) {
    let title = params.title;
    let price = params.price;
    let state = params.state;
    let order = params.order;
    // 页码数
    let page = params.page_no;
    page = page && page > 0 ? page : 1;
    // 每页条目数
    let limit = params.page_size;
    limit = limit && limit > 0 ? parseInt(limit) : 10;
    // 分页查询起始数
    let offset = parseInt(page-1) * limit;
    // 判断查询条件是否为空
    if (order != 'rand()' && (!title && !price && !state))
        return Helper.jsonError('搜索条件:title、price、state请至少指定一个!', 401);
    let where = {};
    // 搜索title匹配
    if (title)
        where.title = {[Op.like]: '%' + title + '%'};
    // 搜索价格区间
    if(price){
        if(price.indexOf(',') == -1)
            return Helper.jsonError('price搜索必须为区间');
        where.price = {[Op.between]: price.split(',')};
    }
    // 搜索产品上架状态
    if (state)
        where.state = {[Op.eq]: state};
    // 排序处理
    if(order){
        if (order.indexOf(',') == -1)
            return Helper.jsonError('排序规则错误!');
        order = order.split(',');
    }else
        order = ['id', 'desc'];
    return Product.findAndCount({
        attributes: ['id', 'title', 'price', 'state'],
        where: where,
        limit,
        offset,
        order: [order]
    }).then((result)=>{
        return Helper.jsonSuccess(result);
    }).catch((err)=>{
        return Helper.jsonError('网络繁忙，稍后再试!'+err);
    });
};
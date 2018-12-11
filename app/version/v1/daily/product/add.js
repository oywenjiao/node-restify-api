// 引入model
const Product = require('../model/product');
const Helper = require(process.cwd()+'/app/tool/helper');

module.exports = function (params) {
    let title = params.title;
    let price = params.price;
    if(!title || !price)
        return Helper.jsonError('', 401);
    return Product.create({
        title: title,
        price: price
    }).then((result)=> {
        // let insert_id = result.id;
        return Helper.jsonSuccess('数据添加成功!');
    }).catch((err) => {
        return Helper.jsonError('网络繁忙，稍后再试!');
    });
};
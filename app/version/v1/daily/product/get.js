const model = require('../model/product');
const Product = model.Product;
const Helper = require(process.cwd()+'/app/tool/helper');

module.exports = function (params) {
    let product_id = params.product_id;
    if (!product_id)
        return Helper.jsonError('商品ID不能为空!', 401);
    return Product.findByPk(product_id, {
        attributes: ['id', 'title']
    }).then((result) => {
        return result;
    }).catch((err) => {
        return Helper.jsonError('网络繁忙，稍后再试!');
    });
};
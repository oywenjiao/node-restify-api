const OrderModel = require('../model/order');
const Order = OrderModel.Order;

const OrderInfoModel = require('../model/orderInfo');
const OrderInfo = OrderInfoModel.OrderInfo;

const UserModel = require('../model/user');
const User = UserModel.User;

const ProductModel = require('../model/product');
const Product = ProductModel.Product;

module.exports = function (params) {
    return Order.findAll({
        include:[
            {
                model: OrderInfo,
                include: [Product]
            },
            {
                model: User
            }
        ]
    }).then(function (result) {
        return result;
    }).catch((err)=>{
        return err;
    })
};
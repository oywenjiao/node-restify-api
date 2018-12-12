const Sequelize = require('sequelize');
const sequelize = require('../../../../database/config.api');
// 引入时间处理组件
const moment = require('moment');
const Op = Sequelize.Op;

// 创建订单详情表
const OrderInfo = sequelize.define(
    'orderInfo',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        product_name: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: "商品名称"
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: "商品价格，单位为分"
        },
        num: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: "商品数量"
        },
        created: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        comment: "订单管理数据表", // 表注释
        timestamps: false,  // 关闭时间戳,
        underscored: true,
        freezeTableName: true,
        tableName: "order_info"
    }
);

// 获取product模型
const ProductModel = require('./product');
const Product = ProductModel.Product;

// 关联product和orderInfo
Product.hasMany(OrderInfo, {foreignKey: "product_id"}); // 一对多
OrderInfo.belongsTo(Product);   // 属于

exports.OrderInfo = OrderInfo;


const Sequelize = require('sequelize');
const sequelize = require('../../../../database/config.api');
// 引入时间处理组件
const moment = require('moment');
const Op = Sequelize.Op;

const Order = sequelize.define(
    'order',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        status: {
            type: Sequelize.INTEGER(1),
            allowNull: false,
            defaultValue: 1,
            comment: "订单状态：1未付款，2已付款，0已取消",
        },
        trade_sn: {
            type: Sequelize.STRING(50),
            allowNull: false,
            comment: "交易订单号"
        },
        payment: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: "实付款，单位为分"
        },
        pay_sn: {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: "支付单号"
        },
        pay_time: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: "支付时间"
        },
        created: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        updated: {
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
        tableName: "order"
    }
);

// 获取user模型
const UserModel = require('./user');
const User = UserModel.User;
// 定义user和order模型之间的关联关系
User.hasMany(Order);
Order.belongsTo(User);

// 获取orderInfo模型
const OrderInfoModel = require('./orderInfo');
const OrderInfo = OrderInfoModel.OrderInfo;
// 定义order和orderInfo模型之间的关联关系
Order.hasMany(OrderInfo);

exports.Order = Order;
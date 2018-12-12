const Sequelize = require('sequelize');
const sequelize = require('../../../../database/config.api');
// 引入时间处理组件
const moment = require('moment');
const Op = Sequelize.Op;

const User = sequelize.define(
    'user',
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
            comment: "账号状态：1正常，2封号",
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: "用户真实姓名"
        },
        nick_name: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: "用户昵称"
        },
        sex: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            values: [0, 1, 2],
            comment: "用户性别"
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: "用户手机号"
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
        comment: "用户管理数据表", // 表注释
        timestamps: false,  // 关闭时间戳,
        underscored: true,
        freezeTableName: true,
        tableName: "user"
    }
);

exports.User = User;
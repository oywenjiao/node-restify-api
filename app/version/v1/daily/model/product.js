const Sequelize = require('sequelize');
const sequelize = require('../../../../database/config.api');
// 引入时间处理组件
const moment = require('moment');

const Product = sequelize.define(
    'product',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: true,
            comment: "产品标题"
        },
        price: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: "产品价格，单位为分",
            allowNull: false
        },
        state: {
            type: Sequelize.INTEGER(1),
            defaultValue: 1,
            comment: "上架状态:1上架,2下架,0删除",
            allowNull: false
        },
        created: {
            type: Sequelize.DATE,
            get() {
                if(this.getDataValue('created'))
                    return moment(this.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        updated: {
            type: Sequelize.DATE,
            get() {
                if(this.getDataValue('updated'))
                    return moment(this.getDataValue('updated')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    },
    {
        tableName: 'product',   // 定义表名
        freezeTableName: true,
        // 启用时间戳！
        timestamps: true,
        createdAt: "created",
        updatedAt: "updated",
    }
);

/*
// 创建数据表
Product.sync({force: true}).then(() => {
    console.log('数据表创建成功!');
}).catch((err) => {
    console.log('出错了', err);
});
*/

module.exports = Product;
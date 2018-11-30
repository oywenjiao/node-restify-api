'use strict';
const jwt = require('jsonwebtoken');
const config = require(process.cwd()+'/app/config/env.json');
const secret = config.jwt_secret;

/**
 * 生成加密token
 * @param params
 * @param expires 该参数用来设置token有效期：1000（单位秒s)、'7 days'(7天)、'1h'(1小时)
 * @returns {*}
 */
const createToken = (params, expires) => {
    return jwt.sign(params, secret, {
        expiresIn: expires
    });
};

/**
 * 对已有的token进行解密并验证
 * @param _token
 * @returns {*}
 */
const verifyToken = (_token) => {
    return jwt.verify(_token, secret, (err, decoded) => {
        if (err){
            return {'state': 404, 'msg': 'token 失效'};
        }
        return {'state': 0, 'decoded': decoded};
    });
};

exports.createToken = createToken;
exports.verifyToken = verifyToken;
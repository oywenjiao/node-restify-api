'use strict';
const jwt = require('jsonwebtoken');
const secret = 'my-node-api-jwt-user-token';

const createToken = (params, expires) => {
    return jwt.sign(params, secret, {
        expiresIn: expires
    });
};

const verifyToken = (_token) => {
    return jwt.verify(_token, secret, (err, decoded) => {
        if (err){
            return {'state': 401, 'msg': 'token 失效'};
        }
        return decoded;
    });
};

exports.createToken = createToken;
exports.verifyToken = verifyToken;
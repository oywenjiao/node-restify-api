/**
 * 验证手机号是否正确
 * @param phone
 * @returns {boolean}
 */
function isPhoneAvailable(phone) {
    let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (!reg.test(phone)) {
        return false;
    } else {
        return true;
    }
}
exports.isPhoneAvailable=isPhoneAvailable;

/**
 * 对字符串进行hmac-sha1加密处理
 * @param str
 * @returns {string} 返回加密后的字符串
 */
function hmacSha1(str) {
    const CryptoJS = require('crypto-js');
    const config = require(process.cwd()+'/app/config/env.json');
    let response = CryptoJS.HmacSHA1(str, config.crypto_hmac_key);
    return response.toString();
}
exports.hmacSha1=hmacSha1;

/**
 * 错误提示
 * @param msg  提示信息
 * @param code 错误编码
 * @returns {{code: number, sub_code: string, msg: string, sub_msg: string}}
 */
function jsonError(msg = '', code = 402){
    let sub_code = '';
    let sub_msg = '';
    switch (code) {
        case 404:
            sub_code = 'warn.invalid-request';
            sub_msg = '非法请求!';
            break;
        case 403:
            sub_code = '';
            sub_msg = '';
            break;
        case 402:
            sub_code = 'warn.invalid-parameter';
            sub_msg = '参数无效';
            break;
        case 401:
            sub_code = 'warn.missing-necessary-parameters';
            sub_msg = '缺失必要参数!';
            break;
        default :
            sub_code = 'caution.network-busy';
            sub_msg = '网络繁忙,稍后再试!';
            break;
    }
    return {
        "code": code,
        "sub_code" : sub_code,
        "msg": msg ? msg : sub_msg,
    };
}
exports.jsonError=jsonError;

function jsonSuccess(data = {}, msg = 'success'){
    return {
        "code": 0,
        "msg": msg,
        "response": data
    };
}
exports.jsonSuccess=jsonSuccess;

function trim(str, char, type){
    if (char) {
        if (type == 'left') {
            return str.replace(new RegExp('^\\'+char+'+', 'g'), '');
        } else if (type == 'right') {
            return str.replace(new RegExp('\\'+char+'+$', 'g'), '');
        }
        return str.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
    }
    return str.replace(/^\s+|\s+$/g, '');
}
exports.trim=trim;


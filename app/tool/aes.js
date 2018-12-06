/**
 * aes 加密规则
 * @type {module:crypto}
 */

const crypto = require('crypto');

/**
 * 加密
 * @param data
 * @param key
 * @param iv
 * @returns {string}
 */
function aesEncrypt(data, key, iv) {
    let cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    return cipher.update(data, 'utf8', 'hex')+cipher.final('hex');
}
exports.aesEncrypt=aesEncrypt;

/**
 * 解密
 * @param crypted
 * @param key
 * @param iv
 * @returns {string}
 */
function aesDecrypt(crypted, key, iv) {
    let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    return decipher.update(crypted, 'hex', 'utf8')+decipher.final('utf8');
}
exports.aesDecrypt=aesDecrypt;

/*
    // 使用示例
    const aes = require(process.cwd()+'/app/tool/aes');

    const d = 'Hello, this is a secret message aa!';
    const key = '9vApxLk5G3PAsJrM';
    let iv = '1234567891234567';
    let encrypted = aes.aesEncrypt(d, key, iv);
    let decrypted = aes.aesDecrypt(encrypted, key, iv);

    console.log('Plain text: ' + d);
    console.log('Encrypted text: ' + encrypted);
    console.log('Decrypted text: ' + decrypted);
*/

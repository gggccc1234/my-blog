// 给密码加密和解密
var crypto = require('crypto')

// MD5加密钥匙
const md5key = '19961016'
const md5key2 = 'cyf'

module.exports = function (pwd) {
  var password = encrypt(encrypt(pwd.substring(0, 4) + md5key) + encrypt(md5key2 + pwd.substring(2)))
  return password
}

function encrypt (pwd) {
  var md5 = crypto.createHash('md5');
  // 创建一个哈希实例
  var password = md5.update(pwd).digest('base64');
  // 生成一个经过MD5加密的密码以base64的格式返回
  return password;
}
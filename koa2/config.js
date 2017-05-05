/**具体的规则是：

先读取config-default.js；
如果不是测试环境，就读取config-override.js，如果文件不存在，就忽略。
如果是测试环境，就读取config-test.js。
 */
// MySQL配置文件
const defaultConfig = './config/config_default.js';
// 可设定为绝对路径，如 /opt/product/config-override.js
const overrideConfig = './config/config_override.js';
const testConfig = './config/config_test.js';
const fs = require('fs');

var config = null;

if (process.env.NODE_ENV === 'test') {
    console.log(`Load ${testConfig}...`);
    config = require(testConfig);
} else {
    console.log(`Load ${defaultConfig}...`);
    config = require(defaultConfig);
    try {
        if (fs.statSync(overrideConfig).isFile()) {
            console.log(`Load ${overrideConfig}...`);
            config = Object.assign(config, require(overrideConfig));
        }
    } catch (err) {
        console.log(`Cannot load ${overrideConfig}.`);
    }
}

module.exports = config;

// start.js

const app = require('./app');

app.listen(3000);
console.log('app started at port 3000...');
//这个koa应用和前面的koa应用稍有不同的是，app-httptest.js只负责创建app实例，并不监听端口：
//这样做的目的是便于后面的测试。


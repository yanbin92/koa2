//-- 初始化数据库
const model = require('./model');
model.sync();

console.log('init db ok.');
//process.exit(0);

/**
 注意到我们其实不需要创建表的SQL，因为Sequelize提供了一个sync()方法，可以自动创建数据库。这个功能在开发和生产环境中没有什么用，但是在测试环境中非常有用。测试时，我们可以用sync()方法自动创建出表结构，而不是自己维护SQL脚本。这样，可以随时修改Model的定义，并立刻运行测试。开发环境下，首次使用sync()也可以自动创建出表结构，避免了手动运行SQL的问题。

init-db.js的代码非常简单：

const model = require('./model.js');
model.sync();

console.log('init db ok.');
process.exit(0);
它最大的好处是避免了手动维护一个SQL脚本。
 */
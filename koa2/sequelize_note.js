//第一步,创建一个sequelize对象实例：
const Sequelize = require('sequelize');
const config = require('./config');

var sequelize=new Sequelize(config.database,config.username,config.password,{
    host:config.host,
    dialect:"mysql",
    pool:{
        max:5,
        min:0,
        idle:30000
    }
})
sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });
//// Or you can simply use a connection uri
//var sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');
//第二步，定义模型Pet，告诉Sequelize如何映射数据库表：
/**用sequelize.define()定义Model时，传入名称pet，默认的表名就是pets。
 * 第二个参数指定列名和数据类型，如果是主键，需要更详细地指定。
 * 第三个参数是额外的配置，我们传入{ timestamps: false }是为了关闭Sequelize的自动添加timestamp的功能。
 * 所有的ORM框架都有一种很不好的风气，总是自作聪明地加上所谓“自动化”的功能，
 * 但是会让人感到完全摸不着头脑。
 */
var Pet=sequelize.define('pet',{
    id:{
        type:Sequelize.STRING(50),
        primaryKey:true
    },
    name: Sequelize.STRING(100),
    gender: Sequelize.BOOLEAN,
    birth: Sequelize.STRING(10),
    createdAt: Sequelize.BIGINT,
    updatedAt: Sequelize.BIGINT,
    version: Sequelize.BIGINT
},
{timestamps: false}
    );
/**接下来，我们就可以往数据库中塞一些数据了。我们可以用Promise的方式写： */
var now=Date.now();
/** 
Pet.create({
    id: 'g-' + now,
    name: 'Gaffey',
    gender: false,
    birth: '2007-07-07',
    createdAt: now,
    updatedAt: now,
    version: 0
}).then(function (p) {
    console.log('created.' + JSON.stringify(p));
}).catch(function (err) {
    console.log('failed: ' + err);
});
*/
//也可以用await写：
(async () => {
    var dog = await Pet.create({
        id: 'd-' + now,
        name: 'Odie',
        gender: false,
        birth: '2008-08-08',
        createdAt: now,
        updatedAt: now,
        version: 0
    });
    console.log('created: ' + JSON.stringify(dog));
})();

(async () => {
    var pets = await Pet.findAll({
        where: {
            name: 'Gaffey'
        }
    });
    console.log(`find ${pets.length} pets:`);
    for (let p of pets) {
        console.log(JSON.stringify(p));
    }
})();
/**
查询数据时，用await写法如下：

(async () => {
    var pets = await Pet.findAll({
        where: {
            name: 'Gaffey'
        }
    });
    console.log(`find ${pets.length} pets:`);
    for (let p of pets) {
        console.log(JSON.stringify(p));
    }
})();
如果要更新数据，可以对查询到的实例调用save()方法：

(async () => {
    var p = await queryFromSomewhere();
    p.gender = true;
    p.updatedAt = Date.now();
    p.version ++;
    await p.save();
})();

如果要删除数据，可以对查询到的实例调用destroy()方法：

(async () => {
    var p = await queryFromSomewhere();
    await p.destroy();
})();
 */
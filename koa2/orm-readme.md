/**
 我们选择Node的ORM框架Sequelize来操作数据库。
 这样，我们读写的都是JavaScript对象，Sequelize帮我们把对象变成数据库中的行。

 用Sequelize查询pets表，代码像这样：
因为Sequelize返回的对象是Promise，所以我们可以用then()和catch()分别异步响应成功和失败。

Pet.findAll()
   .then(function (pets) {
       for (let pet in pets) {
           console.log(`${pet.id}: ${pet.name}`);
       }
   }).catch(function (err) {
       // error
   });

   可以用ES7的await来调用任何一个Promise对象，这样我们写出来的代码就变成了：
await只有一个限制，就是必须在async函数中调用。上面的代码直接运行还差一点，我们可以改成：
async()=>{
    var pets = await Pet.findAll();
}
所以我们实际上将来在koa的async函数中直接写await访问数据库就可以了！

这也是为什么我们选择Sequelize的原因：只要API返回Promise，就可以用await调用，写代码就非常简单！
 */
/*
我们把通过sequelize.define()返回的Pet称为Model，它表示一个数据模型。

我们把通过Pet.findAll()返回的一个或一组对象称为Model实例，每个实例都可以直接通过JSON.stringify序列化为JSON字符串。但是它们和普通JSON对象相比，多了一些由Sequelize添加的方法，比如save()和destroy()。调用这些方法我们可以执行更新或者删除操作。

所以，使用Sequelize操作数据库的一般步骤就是：

首先，通过某个Model对象的findAll()方法获取实例；

如果要更新实例，先对实例属性赋新值，再调用save()方法；

如果要删除实例，直接调用destroy()方法。

注意findAll()方法可以接收where、order这些参数，这和将要生成的SQL语句是对应的。
Sequelize的API可以参考官方文档。http://docs.sequelizejs.com/en/latest/docs/getting-started/

见app.js使用例子
*/

/** 建立Model

直接使用Sequelize虽然可以，但是存在一些问题。

团队开发时，有人喜欢自己加timestamp：

var Pet = sequelize.define('pet', {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    name: Sequelize.STRING(100),
    createdAt: Sequelize.BIGINT,
    updatedAt: Sequelize.BIGINT
}, {
        timestamps: false
    });
有人又喜欢自增主键，并且自定义表名：

var Pet = sequelize.define('pet', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING(100)
}, {
        tableName: 't_pet'
    });

一个大型Web App通常都有几十个映射表，一个映射表就是一个Model。如果按照各自喜好，那业务代码就不好写。Model不统一，很多代码也无法复用。
所以我们需要一个统一的模型，强迫所有Model都遵守同一个规范，这样不但实现简单，而且容易统一风格

Model
我们首先要定义的就是Model存放的文件夹必须在models内，并且以Model名字命名，例如：Pet.js，User.js等等。
其次，每个Model必须遵守一套规范：
统一主键，名称必须是id，类型必须是STRING(50)；
主键可以自己指定，也可以由框架自动生成（如果为null或undefined）；
所有字段默认为NOT NULL，除非显式指定；
统一timestamp机制，每个Model必须有createdAt、updatedAt和version，分别记录创建时间、修改时间和版本号。其中，createdAt和updatedAt以BIGINT存储时间戳，最大的好处是无需处理时区，排序方便。version每次修改时自增。
所以，我们不要直接使用Sequelize的API，而是通过db.js间接地定义Model。例如，User.js应该定义如下：
const db = require('../db');

module.exports = db.defineModel('users', {
    email: {
        type: db.STRING(100),
        unique: true
    },
    passwd: db.STRING(100),
    name: db.STRING(100),
    gender: db.BOOLEAN
});
这样，User就具有email、passwd、name和gender这4个业务字段。id、createdAt、updatedAt和version应该自动加上，而不是每个Model都去重复定义。
db.js的作用就是统一Model的定义：

const Sequelize = require('sequelize');

console.log('init sequelize...');

var sequelize = new Sequelize('dbname', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

const ID_TYPE = Sequelize.STRING(50);

function defineModel(name, attributes) {
    var attrs = {};
    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }
    attrs.id = {
        type: ID_TYPE,
        primaryKey: true
    };
    attrs.createdAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.updatedAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: function (obj) {
                let now = Date.now();
                if (obj.isNewRecord) {
                    if (!obj.id) {
                        obj.id = generateId();
                    }
                    obj.createdAt = now;
                    obj.updatedAt = now;
                    obj.version = 0;
                } else {
                    obj.updatedAt = Date.now();
                    obj.version++;
                }
            }
        }
    });
}
Sequelize在创建、修改Entity时会调用我们指定的函数，这些函数通过hooks在定义Model时设定。我们在beforeValidate这个事件中根据是否是isNewRecord设置主键（如果主键为null或undefined）、设置时间戳和版本号。

这么一来，Model定义的时候就可以大大简化

数据库配置

接下来，我们把简单的config.js拆成3个配置文件：

config-default.js：存储默认的配置；rails默认有这些 nodejs还不够完善
config-override.js：存储特定的配置；
config-test.js：存储用于测试的配置。


 */
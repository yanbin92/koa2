// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
// 注意require('koa-router')返回的是函数:
//注意导入koa-router的语句最后的()是函数调用：
//相当于：const fn_router = require('koa-router');const router = fn_router();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const controller = require('./controllers/controller');
const templating = require('./controllers/templating');

// 创建一个Koa对象表示web app本身:bn
const app = new Koa();
//第一个middleware是记录URL以及页面执行时间：
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

//第二个middleware处理静态文件：
let staticFiles = require('./controllers/static-file');
app.use(staticFiles('/static/', __dirname + '/static'));
app.use(staticFiles('/assets/', __dirname + '/assets'));
//第三个middleware解析POST请求：
//由于middleware的顺序很重要，这个koa-bodyparser必须在router之前被注册到app对象上。
app.use(bodyParser());


//// 使用middleware: 

//TODO   第四个middleware负责给ctx加上render()来使用Nunjucks：
process.env.NODE_ENV='development';
const isProduction = process.env.NODE_ENV === 'production';
//process.env指向当前shell的环境变量，比如process.env.HOME
console.log("process.env.NODE_ENV:"+process.env.NODE_ENV)

app.use(templating('views',{
    noCache:!isProduction,
    watch:!isProduction
}));

// add router middleware:
app.use(router.routes());

app.use(controller(__dirname));

//test model
const model = require('./model');

let
    Pet = model.Pet,
    User = model.User;

(async () => {
    var user = await User.create({
        name: 'John',
        gender: false,
        email: 'john-' + Date.now() + '@garfield.pet',
        passwd: 'hahaha'
    });
    console.log('created: ' + JSON.stringify(user));
    var cat = await Pet.create({
        ownerId: user.id,
        name: 'Garfield',
        gender: false,
        birth: '2007-07-07',
    });
    console.log('created: ' + JSON.stringify(cat));
    var dog = await Pet.create({
        ownerId: user.id,
        name: 'Odie',
        gender: false,
        birth: '2008-08-08',
    });
    console.log('created: ' + JSON.stringify(dog));
})();

/**
注意：生产环境上必须配置环境变量NODE_ENV = 'production'，而开发环境不需要配置，实际上NODE_ENV可能是undefined，
所以判断的时候，不要用NODE_ENV === 'development'。
类似的，我们在使用上面编写的处理静态文件的middleware时，也可以根据环境变量判断：

if (! isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}
这是因为在生产环境下，静态文件是由部署在最前面的反向代理服务器（如Nginx）处理的，Node程序不需要处理静态文件。而在开发环境下，我们希望koa能顺带处理静态文件，
否则，就必须手动配置一个反向代理服务器，这样会导致开发环境非常复杂。
 */


// app.use(async (ctx, next) => {
//     const start = new Date().getTime(); // 当前时间
//     await next(); // 调用下一个middleware
//     const ms = new Date().getTime() - start; // 耗费时间
//     console.log(`Time: ${ms}ms`); // 打印耗费时间
// });

// app.use(async (ctx, next) => {
//     await next();
//     ctx.response.type = 'text/html';
//     ctx.response.body = '<h1>Hello, koa2!</h1>';
// });
//由async标记的函数称为异步函数，在异步函数中，
//可以用await调用另一个异步函数，这两个关键字将在ES7中引入
// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');



/** 
app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`); // 打印URL
    await next(); // 调用下一个middleware
});
//add url-route
router.get('/hello/:name',async(ctx,next)=>{
    var name=ctx.params.name;
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
})
router.get('/', async (ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
});
*/
//如果要处理post请求，可以用router.post('/path', async fn)。
/**用post请求处理URL时，我们会遇到一个问题：post请求通常会发送一个表单，
 * 或者JSON，它作为request的body发送，但无论是Node.js提供的原始request对象，
 * 还是koa提供的request对象，都不提供解析request的body的功能！
所以，我们又需要引入另一个middleware来解析原始request请求，
然后，把解析后的参数，绑定到ctx.request.body中。koa-bodyparser就是用来干这个活 */
/** 
router.post('/signin', async (ctx, next) => {
    var
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
});
*/
//类似的，put、delete、head请求也可以由router处理。
/**
 *koa middleware

让我们再仔细看看koa的执行逻辑。核心代码是：

app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});
每收到一个http请求，koa就会调用通过app.use()注册的async函数，并传入ctx和next参数。

我们可以对ctx操作，并设置返回内容。但是为什么要调用await next()？

原因是koa把很多async函数组成一个处理链，每个async函数都可以做一些自己的事情，
然后用await next()来调用下一个async函数。
我们把每个async函数称为middleware，这些middleware可以组合起来，完成很多有用的功能。

例如，可以用以下3个middleware组成处理链，依次打印日志，记录处理时间，输出HTML：

app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`); // 打印URL
    await next(); // 调用下一个middleware
});

app.use(async (ctx, next) => {
    const start = new Date().getTime(); // 当前时间
    await next(); // 调用下一个middleware
    const ms = new Date().getTime() - start; // 耗费时间
    console.log(`Time: ${ms}ms`); // 打印耗费时间
});

app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});
middleware的顺序很重要，也就是调用app.use()的顺序决定了middleware的顺序。

此外，如果一个middleware没有调用await next()，会怎么办？答案是后续的middleware将不再执行了。这种情况也很常见，例如，一个检测用户权限的middleware可以决定是否继续处理请求，还是直接返回403错误：

app.use(async (ctx, next) => {
    if (await checkUserPermission(ctx)) {
        await next();
    } else {
        ctx.response.status = 403;
    }
});
理解了middleware，我们就已经会用koa了！

最后注意ctx对象有一些简写的方法，例如ctx.url相当于ctx.request.url，ctx.type相当于ctx.response.type。
 */

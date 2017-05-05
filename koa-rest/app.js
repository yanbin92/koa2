const Koa=require('koa');
//const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const controller=require('./controller');
const static_file=require('./static-file');
const views=require('./templating');

var app=new Koa();


app.use(async(ctx,next)=>{
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
})
app.use(static_file("/static/",__dirname+'/static'))

app.use(bodyParser());

//app.use(router.routes());
var rest=require('./rest');
app.use(rest.restify());


app.use(views('views',{
     autoescape: true,
     noCache:true
}))
app.use(controller(__dirname));



app.listen(3000);

console.log('app start at port 3000...');
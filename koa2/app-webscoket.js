/**
 * 编写聊天室 群聊
 */

const WebSocket=require('ws');
const Koa=require('koa');

const app=new Koa();
//现在第一个问题来了：koa通过3000端口响应HTTP，我们要新加的WebSocketServer还能否使用3000端口？
//虽然WebSocketServer可以使用别的端口，但是，统一端口有个最大的好处：
//实际应用中，HTTP和WebSocket都使用标准的80和443端口，不需要暴露新的端口，也不需要修改防火墙规则。
//在3000端口被koa占用后，WebSocketServer如何使用该端口？
//实际上，3000端口并非由koa监听，而是koa调用Node标准的http模块创建的http.Server监听的。koa只是把响应函数注册到该http.Server中了。类似的，WebSocketServer也可以把自己的响应函数注册到http.Server中，这样，同一个端口，根据协议，可以分别由koa和ws处理：
//把WebSocketServer绑定到同一个端口的关键代码是先获取koa创建的http.Server的引用，再根据http.Server创建WebSocketServer：
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const controller = require('./controllers/controller');
const templating = require('./controllers/templating');
const Cookies = require('cookies');

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

let server=app.listen(3000);

app.use(async(ctx,next)=>{
    ctx.state.user = parseUser(ctx.cookies.get('name')||'');
    await next();
})
//TODO　websocket server
const WebSocketServer=WebSocket.Server;

// 创建WebSocketServer
const wss=new WebSocketServer({
     server:server
});

 
wss.on('connection', function connection(ws) {
  let user = parseUser(ws.upgradeReq);
  if(!user){
      // Cookie不存在或无效，直接关闭WebSocket:
        ws.close(4001, 'Invalid user');
  }
  console.log(`[SERVER] connection()`);
  // 识别成功，把user绑定到该WebSocket对象:
    ws.user = user;
    // 绑定WebSocketServer对象:
    ws.wss = wss;
    // Broadcast to all. 
    ws.broadcast=function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
        client.send(data);
            }
        });
    };


  ws.on('message', function incoming(message) {
    console.log(message);
    if (message && message.trim()) {
        let msg = createMessage('chat', this.user, message.trim());
        this.wss.broadcast(msg);
    }
  });
});
//聊天室页面可以划分为左侧会话列表和右侧用户列表两部分：键js  view文件


// 消息ID:
var messageIndex = 0;

function createMessage(type, user, data) {
    messageIndex ++;
    return JSON.stringify({
        id: messageIndex,
        type: type,
        user: user,
        data: data
    });
}

function parseUser(obj) {
    if (!obj) {
        return;
    }
    console.log('try parse: ' + obj);
    let s = '';
    if (typeof obj === 'string') {
        s = obj;
    } else if (obj.headers) {
        let cookies = new Cookies(obj, null);
        s = cookies.get('name');
    }
    if (s) {
        try {
            let user = JSON.parse(Buffer.from(s, 'base64').toString());
            console.log(`User: ${user.name}, ID: ${user.id}`);
            return user;
        } catch (e) {
            // ignore
        }
    }
}
/**
 let ws = new WebSocket('ws://localhost:3000/test');

// 打开WebSocket连接后立刻发送一条消息:
ws.on('open', function () {
    console.log(`[CLIENT] open()`);
    ws.send('Hello!');
});

// 响应收到的消息:
ws.on('message', function (message) {
    console.log(`[CLIENT] Received: ${message}`);
}
 在Node环境下，ws模块的客户端可以用于测试服务器端代码，
 否则，每次都必须在浏览器执行JavaScript代码。

同源策略

从上面的测试可以看出，WebSocket协议本身不要求同源策略（Same-origin Policy），
也就是某个地址为http://a.com的网页可以通过WebSocket连接到ws://b.com。
但是，浏览器会发送Origin的HTTP头给服务器，
服务器可以根据Origin拒绝这个WebSocket请求。所以，是否要求同源要看服务器端如何检查。
路由

还需要注意到服务器在响应connection事件时并未检查请求的路径，因此，在客户端打开ws://localhost:3000/any/path可以写任意的路径。

实际应用中还需要根据不同的路径实现不同的功能。
 */

// ws.on('message', function incoming(data, flags) {
//   // flags.binary will be set if a binary data is received. 
//   // flags.masked will be set if the data was masked. 
// });

//Sending binary data
/** 
const WebSocket = require('ws');
 
const ws = new WebSocket('ws://www.host.com/path');
 
ws.on('open', function open() {
  const array = new Float32Array(5);
 
  for (var i = 0; i < array.length; ++i) {
    array[i] = i / 2;
  }
 
  ws.send(array);
});
*/
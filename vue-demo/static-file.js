const path = require('path');
const mime = require('mime');
const fs = require('mz/fs');

// url: 类似 '/static/'
// dir: 类似 __dirname + '/static'
function staticFiles(url, dir) {
    return async (ctx, next) => {
        let rpath = ctx.request.path;
        // 判断是否以指定的url开头:
        if (rpath.startsWith(url)) {
            // 获取文件完整路径:
            let fp = path.join(dir, rpath.substring(url.length));
            // 判断文件是否存在:
            if (await fs.exists(fp)) {
                console.log("load static file:"+fp)
                // 查找文件的mime:
                ctx.response.type = mime.lookup(rpath);
                // 读取文件内容并赋值给response.body:
                ctx.response.body = await fs.readFile(fp);
             //   async/await 究竟是怎么解决异步调用的写法呢？
             //简单来说，就是将异步操作用同步的写法来写。
            } else {
                // 文件不存在:
                ctx.response.status = 404;
            }
        } else {
            // 不是指定前缀的URL，继续处理下一个middleware:
            await next();
        }
    };
}

module.exports = staticFiles;
/**
 const f = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(123);
    }, 2000);
  });
};

const testAsync = async () => {
  const t = await f();
  console.log(t);
};

testAsync();
 */
// var fn_file = async (ctx, next) => {
//     var  request=ctx.request;
//     var  response=ctx.response;
//     var file = ctx.params.file;
    
//     var filepath = path.join(root, file);
//     console.log('get'+filepath)

//     var promise_f=function(resolve,reject){
//         fs.stat(filepath, function (err, stats) {
//             if (!err&&stats.isFile()) {
//                 resolve(filepath);     
//             }else{
//                 // 发送404响应:
//                 reject('404 ' + request.url);
        
//             }
//         });
//     };
//     // 获取文件状态:
//     new Promise(promise_f).then(readFile)
//     .then(function(res){
//         // 没有出错并且文件存在:
//         console.log('200 ' + request.url);
//         // 发送200响应:
//        // response.status='200';
      
//         //response.body=``+res;
//         //TODO 
//         ctx.response.body = res;
//         //  ctx.response.body = `<h1>Hello, ${name}!</h1>`;

//     }).catch(function(err){
//         // 出错了或者文件不存在:
//         console.log('err:' + err);
//         //  response.header='404';
//         response.body=`404 Not Found`;
//     });
// }

// function readFile(filepath) {
//   return new Promise(function(resolve, reject){
//         var fs=require('fs')
//         fs.readFile(filepath,'utf-8',function(err,data){
//             if(err){
//             //  console.log(err);
//                 reject(err);
//             }else{
//             // console.log(data);
//                 resolve(data);
//             }
//         })
//   });  
// }


//module.exports = {
 //   'GET /assets/:file': fn_file
//};
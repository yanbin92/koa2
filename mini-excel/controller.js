const fs = require('fs');

//
function addControllers(router,dir){
    var files = fs.readdirSync(dir + '/controllers');
    // 过滤出.js文件:
    var js_files = files.filter((f)=>{
        return f.endsWith('.js');
    });
    // 处理每个js文件:
    for (var f of js_files) {
        console.log(`process controller: ${f}...`);
        // 导入js文件:
        let mapping = require(dir + '/controllers/' + f);
        addMapping(router, mapping)
    }
}
/**
    var a = ['A', 'B', 'C'];
    a.name = 'Hello';
    for (var x in a) {
        alert(x); // '0', '1', '2', 'name'
    }
*/
function addMapping(router, mapping) {
    for (var url in mapping) {//for ... in循环由于历史遗留问题，它遍历的实际上是对象的属性名称
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        }else if (url.startsWith('POST ')) {
            // 如果url类似"POST xxx":
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        }else if (url.startsWith('DELETE ')) {
            var path = url.substring(7);
            router.del(path, mapping[url]);
            console.log(`register URL mapping: DELETE ${path}`);
        }  else if (url.startsWith('PUT ')) {
            var path = url.substring(4);
            router.put(path, mapping[url]);
            console.log(`register URL mapping: PUT ${path}`);
        }  else {
            // 无效的URL:
            console.log(`invalid URL: ${url}`);
        }
    }
}
module.exports=function(dir){
    let controllers_dir=dir||'',
        router=require('koa-router')();

    addControllers(router,controllers_dir);

    return router.routes();

}
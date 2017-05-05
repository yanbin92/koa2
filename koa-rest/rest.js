/*
我们在这个工程中约定了如下规范：

REST API的返回值全部是object对象，而不是简单的number、boolean、null或者数组；
REST API必须使用前缀/api/。
第一条规则实际上是为了方便客户端处理结果。如果返回结果不是object，则客户端反序列化后还需要判断类型。以Objective-C为例，可以直接返回NSDictionary*：
NSDictionary* dict = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&err];
如果返回值可能是number、boolean、null或者数组，则客户端的工作量会大大增加
 */
module.exports={
    APIError: function (code, message) {
        this.code = code || 'internal:unknown_error';
        this.message = message || '';
    },
    restify:(pathPrefix)=>{
        // REST API前缀，默认为/api/:
        pathPrefix=pathPrefix||'/api/';
        return async(ctx,next)=>{
            //
            if (ctx.request.path.startsWith(pathPrefix)) {
               // console.log('rest 抽取公共代码......')
                ctx.rest=(data)=>{
                    ctx.response.type = 'application/json';
                    ctx.response.body = data;
                }
            try {
                //受益于async/await语法，我们在middleware中可以直接用try...catch捕获异常。
                //如果是callback模式，就无法用try...catch捕获，代码结构将混乱得多。
                await next();
                } catch (e) {
                    // 返回错误:
                    ctx.response.status = 400;
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        code: e.code || 'internal:unknown_error',
                        message: e.message || ''
                    };
                }
            } else {
                await next();
            }
     

        }
    }
}
/**
这样，任何支持REST的异步函数只需要简单地调用：

ctx.rest({
    data: 123
});
 */
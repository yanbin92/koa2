const products = require('../products');

const APIError = require('../rest').APIError;

module.exports = {
    'GET /api/products': async (ctx, next) => {
        ctx.rest({
            products: products.getProducts()
        });
    },

    'POST /api/products': async (ctx, next) => {
        var p = products.createProduct(ctx.request.body.name, ctx.request.body.manufacturer, parseFloat(ctx.request.body.price));
        ctx.rest(p);
    },

    'DELETE /api/products/:id': async (ctx, next) => {
        console.log(`delete product ${ctx.params.id}...`);
        var p = products.deleteProduct(ctx.params.id);
        if (p) {
            ctx.rest(p);
        } else {
            throw new APIError('product:not_found', 'product not found by id.');
        }
    }
    //该API支持GET、POST和DELETE这三个请求。当然，还可以添加更多的API。
    /**
     编写API时，需要注意：

如果客户端传递了JSON格式的数据（例如，POST请求），则async函数可以通过ctx.request.body直接访问已经反序列化的JavaScript对象。这是由bodyParser()这个middleware完成的。如果ctx.request.body为undefined，说明缺少middleware，或者middleware没有正确配置。

如果API路径带有参数，参数必须用:表示，例如，DELETE /api/products/:id，客户端传递的URL可能就是/api/products/A001，参数id对应的值就是A001，要获得这个参数，我们用ctx.params.id。

类似的，如果API路径有多个参数，例如，/api/products/:pid/reviews/:rid，则这两个参数分别用ctx.params.pid和ctx.params.rid获取。

这个功能由koa-router这个middleware提供。

请注意：API路径的参数永远是字符串！
     */
};
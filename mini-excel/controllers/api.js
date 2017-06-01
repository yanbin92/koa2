const products = require('../products');
const excel_datas = require('../models/data');

const APIError = require('../rest').APIError;

module.exports = {
    'GET /api/products': async (ctx, next) => {
        ctx.rest({
            products: products.getProducts()
        });
    },
     'GET /api/execel_data': async (ctx, next) => {
        ctx.rest({
            execel_data: excel_datas.data
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
    ,

       'PUT /api/products/:id': async (ctx, next) => {
        console.log(`update product ${ctx.params.id}...`);
        try{
            var p = products.updateProduct(ctx.params.id,ctx.request.body);
            if (p) {
                ctx.rest(p);
            } else {
                throw new APIError('product:not_found', 'product not found by id.');
            }
        }catch(e){
            console.error(e)
        }
    }
    //该API支持GET、POST和DELETE这三个请求。当然，还可以添加更多的API。
    /**
     * MVVM的适用范围

        从几个例子我们可以看到，MVVM最大的优势是编写前端逻辑非常复杂的页面，尤其是需要大量DOM操作的逻辑，利用MVVM可以极大地简化前端页面的逻辑。

        但是MVVM不是万能的，它的目的是为了解决复杂的前端逻辑。对于以展示逻辑为主的页面，例如，新闻，博客、文档等，不能使用MVVM展示数据，因为这些页面需要被搜索引擎索引，而搜索引擎无法获取使用MVVM并通过API加载的数据。

        所以，需要SEO（Search Engine Optimization）的页面，不能使用MVVM展示数据。不需要SEO的页面，如果前端逻辑复杂，就适合使用MVVM展示数据，例如，工具类页面，复杂的表单页面，用户登录后才能操作的页面等等
     编写API时，需要注意：

        如果客户端传递了JSON格式的数据（例如，POST请求），则async函数可以通过ctx.request.body直接访问已经反序列化的JavaScript对象。这是由bodyParser()这个middleware完成的。如果ctx.request.body为undefined，说明缺少middleware，或者middleware没有正确配置。

        如果API路径带有参数，参数必须用:表示，例如，DELETE /api/products/:id，客户端传递的URL可能就是/api/products/A001，参数id对应的值就是A001，要获得这个参数，我们用ctx.params.id。

        类似的，如果API路径有多个参数，例如，/api/products/:pid/reviews/:rid，则这两个参数分别用ctx.params.pid和ctx.params.rid获取。

        这个功能由koa-router这个middleware提供。

        请注意：API路径的参数永远是字符串！
     */
};
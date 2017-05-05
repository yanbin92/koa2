var fn_index = async (ctx, next) => {
    /**
     注意到koa并没有在ctx对象上提供render方法，
     这里我们假设应该这么使用，这样，我们在编写Controller的时候，
     最后一步调用ctx.render(view, model)就完成了页面输出。


     */
    ctx.render('index.html',{
        title:'welcome'
    })
}
const crypto = require('crypto');

// 可任意多次调用update():

var fn_signin = async (ctx, next) => {
    var
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
        var hash=crypto.createHash('md5')
        hash.update('12345');
        var psw_digest=hash.digest('hex');
    console.log(`signin with name: ${name}, password: ${password}`);
    console.log(`signin with name: ${name}, md5digest: ${psw_digest}`);
    if (name === 'koa' && password ===  psw_digest) {
         ctx.render('signin-ok.html', {
            title: 'Sign In OK',
            name: 'Mr Node'
        });
       // ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    } else {
         ctx.render('signin-failed.html', {
            title: 'Sign In Failed',
            name:'Adele'
        });
        // ctx.response.body = `<h1>Login failed!</h1>
        // <p><a href="/">Try again</a></p>`;
    }
};

//这个index.js通过module.exports把两个URL处理函数暴露出来。
module.exports = {
    'GET /': fn_index,
    'POST /signin': fn_signin
};
module.exports = {
    'GET /': async (ctx, next) => {
        ctx.render('index.html');
    },
    //双向绑定最大的好处是我们不再需要用jQuery去查询表单的状态，而是直接获得了用JavaScript对象表示的Model。
     //
     //除了简单的单向绑定和双向绑定，MVVM还有一个重要的用途，就是让Model和DOM的结构保持同步。
     'GET /vue_mvvm': async (ctx, next) => {
        ctx.render('vue_mvvm.html');
    },

       
    /** 
     vue 和node js 冲突 {{}}
      'GET /vue_v_for': async (ctx, next) => {
        ctx.render('vue_v_for.html');
    }
    */
};
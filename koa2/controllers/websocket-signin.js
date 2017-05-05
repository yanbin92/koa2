// sign in:

var index = 0;

module.exports = {
    'GET /websocket-signin': async (ctx, next) => {
        let names = '甲乙丙丁戊己庚辛壬癸';
        let name = names[index % 10];
        ctx.render('websocket-signin.html', {
            name: `路人${name}`
        });
    },

    'POST /websocket-signin': async (ctx, next) => {
        index ++;
        let name = ctx.request.body.name || '路人甲';
        let user = {
            id: index,
            name: name,
            image: index % 10
        };
        let value = Buffer.from(JSON.stringify(user)).toString('base64');
        console.log(`Set cookie value: ${value}`);
        ctx.cookies.set('name', value);
        ctx.state.user = user;
        console.log('ctx.state.user :'+ ctx.state.user)
        ctx.response.redirect('/websocket-index');
    },

    'GET /websocket-signout': async (ctx, next) => {
        ctx.cookies.set('name', '');
        ctx.response.redirect('/websocket-signin');
    }
};
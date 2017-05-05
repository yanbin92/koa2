module.exports = {
    'GET /websocket-index': async (ctx, next) => {
      
        var value=ctx.cookies.get('name');
        let user = ctx.state.user;

        console.log(`user:${ctx.state},${ctx.state.user}`)

        if (user) {
            console.log(`user:${user}`)
            ctx.render('websocket-index.html', {
                user: user
            });
        } else {
             console.log(`user is not find  ${user}`)

            ctx.response.redirect('/websocket-signin');
        }
    }
};

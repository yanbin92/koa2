/**
Http测试
在测试前，我们在package.json中添加devDependencies，
除了mocha外，我们还需要一个简单而强大的测试模块supertest：
断言HTTP头时可用使用正则表达式。例如，下面的断言：
.expect('Content-Type', /text\/html/)
可用成功匹配到Content-Type为text/html、text/html; charset=utf-8等值。

当所有测试运行结束后，app实例会自动关闭，无需清理。

利用mocha的异步测试，配合supertest，我们可以用简单的代码编写端到端的HTTP自动化测试。
*/
const request=require('supertest'),
app=require("../app-httptest");

describe("#test koa app",()=>{
        let server=app.listen(9000);
        describe('#test server',()=>{
            it('#test get /',async()=>{
                let res = await request(server)
                .get('/')
                .expect('Content-Type', /text\/html/)
                .expect(200,'<h1>Hello, world!</h1>');
            });

            it('#test GET /path?name=Bob', async () => {
            let res = await request(server)
                .get('/path?name=Bob')
                .expect('Content-Type', /text\/html/)
                .expect(200, '<h1>Hello, Bob!</h1>');
             });
        });

        
})
const assert = require('assert');
const sum = require('../hello');

describe('#hello.js', () => {

    describe('#sum()', () => {
        //在测试前初始化资源，测试后释放资源是非常常见的。
        //mocha提供了before、after、beforeEach和afterEach来实现这些功能。
        before(function () {
            console.log('before:');
        });

        after(function () {
            console.log('after.');
        });

        beforeEach(function () {
            console.log('  beforeEach:');
        });

        afterEach(function () {
            console.log('  afterEach.');
        });
        //每个it("name", function() {...})就代表一个测试。例如，为了测试sum(1, 2)，我们这样写：
        //编写测试的原则是，一次只测一种情况，且测试代码要非常简单。我们编写多个测试来分别测试不同的输入，并使用assert判断输出是否是我们所期望的。
        it('sum() should return 0', () => {
            assert.strictEqual(sum(), 0);
        });

        it('sum(1) should return 1', () => {
            assert.strictEqual(sum(1), 1);
        });

        it('sum(1, 2) should return 3', () => {
            assert.strictEqual(sum(1, 2), 3);
        });

        it('sum(1, 2, 3) should return 6', () => {
            assert.strictEqual(sum(1, 2, 3), 6);
        });
    });
});
//这里我们使用mocha默认的BDD-style的测试。describe可以任意嵌套，以便把相关测试看成一组测试。
//assert模块非常简单，它断言一个表达式为true。如果断言失败，就抛出Error。
//可以在Node.js文档中查看assert模块的所有API。
/**
 * 单独写一个test.js的缺点是没法自动运行测试，而且，如果第一个assert报错，
 * 后面的测试也执行不了了。
 * 如果有很多测试需要运行，就必须把这些测试全部组织起来，
 * 然后统一执行，并且得到执行结果。这就是我们为什么要用mocha来编写并运行测试。
 * mocha默认会执行test目录下的所有测试，不要去改变默认目录。
 */


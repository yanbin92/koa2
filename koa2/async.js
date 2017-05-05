const fs=require('mz/fs');
//编写异步代码时，我们要坚持使用async和await关键字，这样，编写测试也同样简单。

// a simple async function:
module.exports = async () => {
    let expression = await fs.readFile('./data.txt', 'utf-8');//'1 + (2 + 4) * (9 - 2) / 3'
    let fn = new Function('return ' + expression);//
    let r = fn();
    console.log(`Calculate: ${expression} = ${r}`);
    return r;
};
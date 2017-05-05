/**
就需要引入对应的Model文件，例如：User.js。一旦Model多了起来，如何引用也是一件麻烦事。
自动化永远比手工做效率高，而且更可靠。我们写一个model.js，自动扫描并导入所有Model：
 */
const fs = require('fs');
const db = require('./db');

let files = fs.readdirSync(__dirname + '/models');

let js_files = files.filter((f)=>{
    return f.endsWith('.js');
}, files);

module.exports = {};

for (let f of js_files) {
    console.log(`import model from file ${f}...`);
    let name = f.substring(0, f.length - 3);
    module.exports[name] = require(__dirname + '/models/' + f);
}

module.exports.sync = () => {
    db.sync();
};
/** example
 const model = require('./model'); 

let
    Pet = model.Pet,
    User = model.User;

var pet = await Pet.create({ ... });
 */
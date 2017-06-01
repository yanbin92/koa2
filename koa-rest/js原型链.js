/**
 * 不用es6 class 实现 继承
 */
function Student(props){
    this.name=props.name||'Unanmed';
}

Student.prototype.hello=function(){
    alert('hello,'+this.name+'!');
}

//现在，基于Student扩展出PrimaryStudent，可以先定义出PrimaryStudent：

function PrimaryStudent(props) {
    // 调用Student构造函数，绑定this变量:
    Student.call(this, props);
    this.grade = props.grade || 1;
}
//PrimaryStudent创建的对象的原型是
//new PrimaryStudent() ----> PrimaryStudent.prototype ----> Object.prototype ----> null
//必须想办法把原型链修改为
//new PrimaryStudent() ----> PrimaryStudent.prototype ----> Student.prototype ----> Object.prototype ----> null
/**
PrimaryStudent.prototype = Student.prototype;
是不行的！如果这样的话，PrimaryStudent和Student共享一个原型对象，那还要定义PrimaryStudent干啥？
 */
function Temp(){}
//Temp.prototype=== new Temp()
Temp.prototype=Student.prototype;

PrimaryStudent.prototype =new Temp();

// 把PrimaryStudent原型的构造函数修复为PrimaryStudent:
PrimaryStudent.prototype.constructor = PrimaryStudent;

// 继续在PrimaryStudent原型（就是new F()对象）上定义方法：
PrimaryStudent.prototype.getGrade = function () {
    return this.grade;
};

var xiaoming = new PrimaryStudent({
    name:'xiaoming',
    grade:2
})
xiaoming.name
xiaoming.grade

// 验证原型:
xiaoming.__proto__ === PrimaryStudent.prototype; // true
xiaoming.__proto__.__proto__ === Student.prototype; // true

/**-------------------------------------------
 JavaScript的原型继承实现方式就是：

定义新的构造函数，并在内部用call()调用希望“继承”的构造函数，并绑定this；

借助中间函数F实现原型链继承，最好通过封装的inherits函数完成；

继续在新的构造函数的原型上定义新方法。
----------------------------------------------- */
function inherits(Child,Parent){
    var Temp=function(){}
    Temp.prototype=Parent.prototype;
    Child.prototype=new Temp();
    Child.prototype.constructor = Child;
}

function Student(props) {
    this.name = props.name || 'Unnamed';
}

Student.prototype.hello = function () {
    alert('Hello, ' + this.name + '!');
}

function PrimaryStudent(props) {
    Student.call(this, props);
    this.grade = props.grade || 1;
}

// 实现原型继承链:
inherits(PrimaryStudent, Student);

// 绑定其他方法到PrimaryStudent原型:
PrimaryStudent.prototype.getGrade = function () {
    return this.grade;
};
/**
 * ECMAScript6 引入了一套新的关键字用来实现 class。
 * 使用基于类语言的开发人员会对这些结构感到熟悉，但它们是不一样的。
 *  JavaScript 仍然是基于原型的。
 * 这些新的关键字包括 class, constructor, static, extends, 和 super.
 */
class Polygon {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}

class Square extends Polygon {
  constructor(sideLength) {
    super(sideLength, sideLength);
  }
  get area() {
    return this.height * this.width;
  }
  set sideLength(newLength) {
    this.height = newLength;
    this.width = newLength;
  }
}

var square = new Square(2);
//检测对象的属性是定义在自身上还是在原型链上，
//有必要使用 hasOwnProperty 方法，所有继承自 Object.proptotype 的对象都包含这个方法。


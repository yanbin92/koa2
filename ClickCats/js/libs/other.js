'use strict'
var name="other js";

/**
 *闭包
 作用域问题  内维作用域如何保存值给外围作用域呢

 */
function genFoil(){
    var foils=["foilA","foilB"];
    var rand=randomNum(foils.length)
    return foils[rand]
}
function genDeed(){
    var deeds=["deedA","deedB"];
    var rand=randomNum(deeds.length)
    return deeds[rand]
}
function randomHeroName(){
    //1.Math.random(); 结果为0-1间的一个随机数(包括0,不包括1) 
   //2 Math.floor(n); 返回小于等于n的最小整数。
   var arrs=["HeroYan","HeroBin"] 
   var rand = randomNum(arrs.length)
   return   arrs[rand];
}
function randomNum(maxnum){
    return Math.floor(Math.random()*maxnum); 
}
 var sagas=[];
 var hero=randomHeroName();
 var newSaga=function(){
     var foil=genFoil();

     sagas.push(function(){
         var deed=genDeed();
         console.log(hero+deed+foil);
     });

 }
 newSaga();
 sagas[0]();
 sagas[0]();

 var pow2= (x)=>{return x*x}

 console.log(pow2(2))


 
var fn=function(a,b){
    log(this,a,b);
}

var r={},g={},h={},y={};
r.method=fn;

r.method.call(y,g,h);//this is what ?  y

setTimeout(fn, 1000);//what gets logged?  Alas, this was another trick question. Keep watching ...
//undefined

/** 
 * 查看.符号左边的 
this在function中调用 如果直接调用functon this指向 global 
如果obj.function this指向 obj
如果obj.method.call(objx,....) this 指向objx*/

/**原型链 */


/*使用构造器创建对象
在 JavaScript 中，构造器其实就是一个普通的函数。当使用 new 操作符 来作用这个函数时，它就可以被称为构造方法（构造函数）。
*/
function Graph() {
  this.vertices = [];
  this.edges = [];
}

Graph.prototype = {
  addVertex: function(v){
    this.vertices.push(v);
  }
};

var g = new Graph();

// g是生成的对象,他的自身属性有'vertices'和'edges'.
// 在g被实例化时,g.__proto__指向了Graph.prototype.


function log(msg){
    console.log(msg)
}

var  gold={a:1}

log(gold.a)//1
//原型链查找
log(gold.z)//undefined
 //jquery extend 
// var blue=extend({},gold)
//ECMAScript 5 中引入了一个新方法：Object.create()。
//可以调用这个方法来创建一个新对象。
//新对象的原型就是调用 create 方法时传入的第一个参数：
var a = {a: 1}; 
// a ---> Object.prototype ---> null

var b = Object.create(a);
// b ---> a ---> Object.prototype ---> null
a.c='b.c'
console.log(b.c)//1  继承而来
console.log(b.a); // 1 (继承而来)

var c = Object.create(b);   //hasOwnProperty()  
console.log(c.constructor)
// c ---> b ---> a ---> Object.prototype ---> null

var d = Object.create(null);
// d ---> null
console.log(d.hasOwnProperty); // undefined, 因为d没有继承Object.prototype

//ECMAScript6 引入了一套新的关键字用来实现 class。使用基于类语言的开发人员会对这些结构感到熟悉，但它们是不一样的。 JavaScript 仍然是基于原型的。这些新的关键字包括 class, constructor, static, extends, 和 super.
"use strict";

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
Car.call
var square = new Square(2);
square.area
square.sideLength=6
square.area
/**
 * 性能
在原型链上查找属性比较耗时，对性能有副作用，这在性能要求苛刻的情况下很重要。另外，试图访问不存在的属性时会遍历整个原型链。

遍历对象的属性时，原型链上的每个可枚举属性都会被枚举出来。

检测对象的属性是定义在自身上还是在原型链上，有必要使用 hasOwnProperty 方法，所有继承自 Object.proptotype 的对象都包含这个方法。

hasOwnProperty 是 JavaScript 中唯一一个只涉及对象自身属性而不会遍历原型链的方法

注意：仅仅通过判断值是否为 undefined 还不足以检测一个属性是否存在，一个属性可能存在而其值恰好为 undefined
 */


/**
 * 
 *我们去扩展内置对象原型的唯一理由是引入新的 JavaScript 引擎的某些新特性，
 比如 Array.forEach。
示例
B 将继承自 A： 
 */

 function A(a){
     this.varA=a;
 }
//以上函数 A 的定义中，既然 A.prototype.varA 总是会被 this.varA 遮蔽，
// 那么将 varA 加入到原型（prototype）中的目的是什么？
A.prototype={
    varA:null,
    /**
   既然它没有任何作用，干嘛不将 varA 从原型（prototype）去掉 ? 
也许作为一种在隐藏类中优化分配空间的考虑 ?
如果varA并不是在每个实例中都被初始化，那这样做将是有效果的。

     */
    doSomething:function(){
        //。。。。
    }
}

function B(a,b){
    A.call(this,a);
    this.varB=b;
}


B.prototype=Object.create(A.prototype,{
    varB : {
        value: null, 
        enumerable: true, 
        configurable: true, 
        writable: true 
      },
    doSomething : { 
        value: function(){ // override
          A.prototype.doSomething.apply(this, arguments); 
          // call super
          // ...
        },
        enumerable: true,
        configurable: true, 
        writable: true
      }
});

B.prototype.constructor = B;

var b = new B();
b.doSomething();
/**
 最重要的部分是：

类型被定义在 .prototype 中
而你用 Object.create() 来继承
你可能已经注意到，我们的函数 A 有一个特殊的属性叫做原型。
这个特殊的属性与 JavaScript 的 new 运算符一起工作。
对原型对象的引用会复制到新实例内部的 __proto__ 属性。
例如，当你这样： var a1 = new A()，
 JavaScript 就会设置：a1.__proto__ = A.prototype
 （在内存中创建对象后，并在运行 this 绑定的函数 A()之前）。

 然后在你访问实例的属性时，JavaScript 首先检查它们是否直接存在于该对象中
 （即是否是该对象的自身属性），如果不是，它会在 __proto__ 中查找。

 也就是说，你在原型中定义的元素将被所有实例共享，
 甚至可以在稍后对原型进行修改，这种变更将影响到所有现存实例。

 */
var a1 = new A();
//prototype与getPrototyoeOfPrototyoeOf区别 
 //JavaScript 就会设置：a1.__proto__ = A.prototype
 //你在原型中定义的元素将被所有实例共享,甚至可以在稍后对原型进行修改，这种变更将影响到所有现存实例。
 //如果你执行 var a1 = new A(); var a2 = new A(); 那么 a1.doSomething 事实上会指向Object.getPrototypeOf(a1).doSomething，
 //它就是你在 A.prototype.doSomething 中定义的内容。
 //比如：Object.getPrototypeOf(a1).doSomething == Object.getPrototypeOf(a2).doSomething == A.prototype.doSomething。
 //简而言之， prototype 是用于类型的，而 Object.getPrototypeOf() 是用于实例的（instances），两者功能一致。
var Car=function(loc){
    var obj=Object.create(Car.prototype);
    obj.loc=loc;
    //有问题 obj.mvoe 每个对象都要创建一个 要所有对象共享
    //移出构造器
    // obj.move=function(){
    //     obj.loc++;
    // }
    // obj.move=move;//问题下面的move方法变更名字等 这边也要跟着变 两处改  方法多了会出问题
    //继续修改 
    // extend(obj,Car.methods);
    //不使用extend 函数 使用原型链继续优化
    return obj;
}
var move=function(){
    this.loc++;
}
// Car.methods={
//     move:function(){
//         this.loc++;
//     },
//     on:function(){},
//     off:function(){}

// }
Car.prototype.move=function(){
        this.loc++; 
}
var amy=Car(1);
var ben=Car(8);
//因为有合并js 不需要引入
amy.move();
log(Car.prototype.constructor)
log(ben.constructor)
log(ben instanceof Car);
amy.__proto__;

//原型模式

//伪类模式 通过new关键字  为了写代码方便 加了一层语法糖
Car=function(loc){
    //这行代码会被使用new关键字时插入// this=Object.create(Car.prototype);
     this.loc=loc;
    //这行代码也是 return this;
 }
amy=new Car(1);

//子类
var Van=function(loc){
    //new Car(loc); worng 
    //this=Object.create(Van.prototype)
    Car.call(this,loc);//不可以使用Car(loc)  这样在Car(loc)中 this 指的是global
    
    //Calls a method of an object, substituting another object for the current object.

    //return this;
}
//Van.prototype=Car.prototype; 这样写不对  这样Van和 Car都使用同一个prototype 一个修改另一个也修改
//官方实现
Van.prototype=Object.create(Car.prototype)
Van.prototype.constructor=Van
Van.prototype.grad=function(){
    /**.... */
}

var product=function(num,b){
    return num*b;
}
var double=function(num){
    return product(num,2);
}
double(3);

//有趣的是将数值3 bind this

double=function(){
    return product(this,2);
}
double.call(3)

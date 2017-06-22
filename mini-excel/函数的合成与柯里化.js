如果一个值要经过多个函数，才能变成另外一个值，就可以把所有中间步骤合并成一个函数，这叫做"函数的合成"（compose）


const compose = function (f, g) {
  return function (x) {
    return f(g(x));
  };
}

函数的合成还必须满足结合律。！(加减  分开 乘除)  

compose(f, compose(g, h))
// 等同于
compose(compose(f, g), h)
// 等同于
compose(f, g, h)


#柯里化
f(x)和g(x)合成为f(g(x))，有一个隐藏的前提，
就是f和g都只能接受一个参数。
如果可以接受多个参数，比如f(x, y)和g(a, b, c)，函数合成就非常麻烦。
这时就需要函数柯里化了。所谓"柯里化"，就是把一个多参数的函数，转化为单参数函数


// 柯里化之前
function add(x, y) {
  return x + y;
}

add(1, 2) // 3

// 柯里化之后
function addX(y) {
  return function (x) {
    return x + y;
  };
}

addX(2)(1) // 3

三、函子
函数不仅可以用于同一个范畴之中值的转换，
还可以用于将一个范畴转成另一个范畴。这就涉及到了函子（Functor）。

3.1 函子的概念
函子是函数式编程里面最重要的数据类型，也是基本的运算单位和功能单位。
它首先是一种范畴，也就是说，是一个容器，包含了值和变形关系。比较特殊的是，它的变形关系可以依次作用于每一个值
，将当前容器变形成另一个容器。

3.2 函子的代码实现
任何具有map方法的数据结构，都可以当作函子的实现。

class Functor {
  constructor(val) { 
    this.val = val; 
  }

  map(f) {
    return new Functor(f(this.val));
  }
}
上面代码中，Functor是一个函子，它的map方法接受函数f作为参数，然后返回一个新的函子，里面包含的值是被f处理过的（f(this.val)）。
一般约定，函子的标志就是容器具有map方法。该方法将容器里面的每一个值，映射到另一个容器。

一般约定，函子的标志就是容器具有map方法。该方法将容器里面的每一个值，映射到另一个容器。

(new Functor(2)).map(function (two) {
  return two + 2;
});
// Functor(4)

(new Functor('flamethrowers')).map(function(s) {
  return s.toUpperCase();
});
// Functor('FLAMETHROWERS')

(new Functor('bombs')).map(_.concat(' away')).map(_.prop('length'));
// Functor(10)
http://www.ruanyifeng.com/blog/2017/02/fp-tutorial.html
上面的例子说明，函数式编程里面的运算，都是通过函子完成，即运算不直接针对值，
而是针对这个值的容器----函子。函子本身具有对外接口（map方法），各种函数就是运算符，通过接口接入容器，引发容器里面的值的变形。

function greeter(person:string){
    return "Hello, " +person;
}

var user="Adele";

document.body.innerHTML=greeter(user)
/**
 重新编译，你会看到产生了一个错误。

greeter.ts(7,26): error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.
类似地，尝试删除greeter调用的所有参数。 TypeScript会告诉你使用了非期望个数的参数调用了这个函数。 在这两种情况中，TypeScript提供了静态的代码分析，它可以分析代码结构和提供的类型注解。

!!!要注意的是尽管有错误，greeter.js文件还是被创建了。 就算你的代码里有错误，你仍然可以使用TypeScript。但在这种情况下，TypeScript会警告你代码可能不会按预期执行。


 */


/**接口

让我们开发这个示例应用。
这里我们使用接口来描述一个拥有firstName和lastName字段的对象。 
在TypeScript里，只在两个类型内部的结构兼容那么这两个类型就是兼容的。 
这就允许我们在实现接口时候只要保证包含了接口要求的结构就可以，而不必明确地使用 implements语句。
**/

interface IPerson {
    firstName: string;
    lastName: string;
}

function greeter2(person: IPerson) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

var user2 = { firstName: "Jane", lastName: "User" };

document.body.innerHTML = greeter2(user2);


/**
类
最后，让我们使用类来改写这个例子。 TypeScript支持JavaScript的新特性，比如支持基于类的面向对象编程。

让我们创建一个Student类，它带有一个构造函数和一些公共字段。 注意类和接口可以一起共作，程序员可以自行决定抽象的级别。

还要注意的是，在构造函数的参数上使用public等同于创建了同名的成员变量。
 */

class Student {
    fullName: string;
    constructor(public firstName, public middleInitial, public lastName) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

interface Person {
    firstName: string;
    lastName: string;
}

function greeter3(person : Student) {
    return "Hello, " + person.fullName;
}
var user3 = new Student("Jane", "M.", "User");

document.body.innerHTML = greeter3(user3);
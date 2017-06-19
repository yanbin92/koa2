function greeter(person) {
    return "Hello, " + person;
}
var user = "Adele";
document.body.innerHTML = greeter(user);
function greeter2(person) {
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
var Student = (function () {
    function Student(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
    return Student;
}());
function greeter3(person) {
    return "Hello, " + person.fullName;
}
var user3 = new Student("Jane", "M.", "User");
document.body.innerHTML = greeter3(user3);

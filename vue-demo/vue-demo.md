
<script>
    //每个 Vue 实例都会代理其 data 对象里所有的属性：
    var data = { a: 1 }
    var vm = new Vue({
        // 选项
          el: '#example',
          data: data
    })
    vm.a === data.a // -> true

    // 设置属性也会影响到原始数据
    vm.a = 2
    data.a // -> 2
    // ... 反之亦然
    data.a = 3
    vm.a // -> 3
    //注意只有这些被代理的属性是响应的。
    //如果在实例创建之后添加新的属性到实例上，
    //它不会触发视图更新。我们将在后面详细讨论响应系统。
    //除了 data 属性， Vue 实例暴露了一些有用的实例属性与方法。
    //这些属性与方法都有前缀 $，以便与代理的 data 属性区分。例如：
    vm.$data === data // -> true
    vm.$el === document.getElementById('example') // -> true
    // $watch 是一个实例方法
    vm.$watch('a', function (newVal, oldVal) {
    // 这个回调将在 `vm.a`  改变后调用

    })

    //!!!每个 Vue 实例在被创建之前都要经过一系列的初始化过程。例如，
    //实例需要配置数据观测(data observer)、编译模版、挂载实例到 DOM 
    //，然后在数据变化时更新 DOM 
    
    //在这个过程中，实例也会调用一些 生命周期钩子 ，这就给我们提供了执行自定义逻辑的机会

    //created 这个钩子在实例被创建之后被调用
    var vm = new Vue({
        data: {
            a: 1
        },
        created: function () {
            // `this` 指向 vm 实例
            console.log('a is: ' + this.a)
        }
        /**
         * mounted、 updated 、destroyed 。钩子的 this 指向调用它的 Vue 实例
         * */
    })
    // -> "a is: 1"

    var MyComponent=Vue.extends({
        //扩展选项
    });

    // 所有的 `MyComponent` 实例都将以预定义的扩展选项被创建
    var myComponentInstance = new MyComponent();


</script>


<button v-bind:disabled="someDynamicCondition">Button</button>
<div v-bind:id="'list-' + id"></div>
<!--
    指令（Directives）是带有 v- 前缀的特殊属性。
    指令属性的值预期是单一 JavaScript 表达式（除了 v-for，之后再讨论）。
    指令的职责就是当其表达式的值改变时相应地将某些行为应用到 DOM 上
-->
<p v-if="seen">Now you see me</p>
<!--
    一些指令能接受一个“参数”，在指令后以冒号指明。例如， v-bind 指令被用来响应地更新 HTML 属性：
   

-->
<a v-bind:href="url"> 在这里 href 是参数，告知 v-bind 指令将该元素的 href 属性与表达式 url 的值绑定。</a>
<!--另一个例子是 v-on 指令，它用于监听 DOM 事件：-->
<a v-on:click="doSomething">
 <!--   修饰符（Modifiers）是以半角句号 . 指明的特殊后缀，
 用于指出一个指令应该以特殊方式绑定。
 例如，.prevent 修饰符告诉 v-on 指令对于触发的事件调用 event.preventDefault()：
-->
<form v-on:submit.prevent="onSubmit"></form>

 <!--  
Vue.js 允许你自定义过滤器，可被用作一些常见的文本格式化。过滤器可以用在两个地方：mustache 插值和 v-bind 表达式。过滤器应该被添加在 JavaScript 表达式的尾部，由“管道”符指示：
-->
<!-- in mustaches -->
{{ message | capitalize }}
<!-- in v-bind -->
<div v-bind:id="rawId | formatId"></div>
new Vue({
  // ...
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
})
过滤器可以串联：
{{ message | filterA | filterB }}
过滤器是 JavaScript 函数，因此可以接受参数：
{{ message | filterA('arg1', arg2) }}




v-bind 缩写

<!-- 完整语法 -->
<a v-bind:href="url"></a>
<!-- 缩写 -->
<a :href="url"></a>

v-on 缩写

<!-- 完整语法 -->
<a v-on:click="doSomething"></a>
<!-- 缩写 -->
<a @click="doSomething"></a>

计算属性
模板内的表达式是非常便利的，但是它们实际上只用于简单的运算。在模板中放入太多的逻辑会让模板过重且难以维护。例如：
<div id="example">  不好
  {{ message.split('').reverse().join('') }}
</div>

#基础例子
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // a computed getter
    reversedMessage: function () {
      // `this` points to the vm instance
      return this.message.split('').reverse().join('')
    }
  }
})
<div id="example">
  <p>Original message: "{{ message }}"</p>
  <p>Computed reversed message: "{{ reversedMessage }}"</p>
</div>
这里我们声明了一个计算属性 reversedMessage 。
我们提供的函数将用作属性 vm.reversedMessage 的 getter 

console.log(vm.reversedMessage) // -> 'olleH'
vm.message = 'Goodbye'
console.log(vm.reversedMessage) // -> 'eybdooG'

你可以打开浏览器的控制台，自行修改例子中的 vm 。 vm.reversedMessage 的值始终取决于 vm.message 的值。

你可以像绑定普通属性一样在模板中绑定计算属性。 Vue 知道 vm.reversedMessage 依赖于 vm.message ，因此当 vm.message 发生改变时，所有依赖于 vm.reversedMessage 的绑定也会更新。而且最妙的是我们已经以声明的方式创建了这种依赖关系：计算属性的 getter 是没有副作用，这使得它易于测试和推理。

#计算缓存 vs method
你可能已经注意到我们可以通过调用表达式中的 method 来达到同样的效果：
<p>Reversed message: "{{ reversedMessage() }}"</p>
// in component
methods: {
  reversedMessage: function () {
    return this.message.split('').reverse().join('')
  }
}
我们可以将同一函数定义为一个 method 而不是一个计算属性。对于最终的结果，两种方式确实是相同的。然而，不同的是计算属性是基于它们的依赖进行缓存的。计算属性只有在它的相关依赖发生改变时才会重新求值。这就意味着只要 message 还没有发生改变，多次访问 reversedMessage 计算属性会立即返回之前的计算结果，而不必再次执行函数。
这也同样意味着下面的计算属性将不再更新，因为 Date.now() 不是响应式依赖：
computed: {
  now: function () {
    return Date.now()
  }
}
相比而言，只要发生重新渲染，method 调用总会执行该函数。
我们为什么需要缓存？假设我们有一个性能开销比较大的的计算属性 A ，它需要遍历一个极大的数组和做大量的计算。然后我们可能有其他的计算属性依赖于 A 。如果没有缓存，我们将不可避免的多次执行 A 的 getter！如果你不希望有缓存，请用 method 替代。

#Computed vs Watched属性











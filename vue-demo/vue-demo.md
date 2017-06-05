
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
Vue 确实提供了一种更通用的方式来观察和响应 Vue 实例上的数据变动：watch 属性。当你有一些数据需要随着其它数据变动而变动时，你很容易滥用 watch——特别是如果你之前使用过 AngularJS。然而，通常更好的想法是使用 computed 属性而不是命令式的 watch 回调。细想一下这个例子：

<div id="demo">{{ fullName }}</div>
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
})
上面代码是命令式的和重复的。将它与 computed 属性的版本进行比较：
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})

#计算setter
计算属性默认只有 getter ，不过在需要时你也可以提供一个 setter ：
// ...
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
现在在运行 vm.fullName = 'John Doe' 时， setter 会被调用， vm.firstName 和 vm.lastName 也相应地会被更新。

#观察 Watchers
虽然计算属性在大多数情况下更合适，但有时也需要一个自定义的 watcher 。这是为什么 Vue 提供一个更通用的方法通过 watch 选项，来响应数据的变化。当你想要在数据变化响应时，执行异步操作或开销较大的操作，这是很有用的。
例如：
<div id="watch-example">
  <p>
    Ask a yes/no question:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
<!-- Since there is already a rich ecosystem of ajax libraries    -->
<!-- and collections of general-purpose utility methods, Vue core -->
<!-- is able to remain small by not reinventing them. This also   -->
<!-- gives you the freedom to just use what you're familiar with. -->
<script src="https://unpkg.com/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'I cannot give you an answer until you ask a question!'
  },
  watch: {
    // 如果 question 发生改变，这个函数就会运行
    question: function (newQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.getAnswer()
    }
  },
  methods: {
    // _.debounce 是一个通过 lodash 限制操作频率的函数。
    // 在这个例子中，我们希望限制访问yesno.wtf/api的频率
    // ajax请求直到用户输入完毕才会发出
    // 学习更多关于 _.debounce function (and its cousin
    // _.throttle), 参考: https://lodash.com/docs#debounce
    getAnswer: _.debounce(
      function () {
        var vm = this
        if (this.question.indexOf('?') === -1) {
          vm.answer = 'Questions usually contain a question mark. ;-)'
          return
        }
        vm.answer = 'Thinking...'
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = 'Error! Could not reach the API. ' + error
          })
      },
      // 这是我们为用户停止输入等待的毫秒数
      500
    )
  }
})
</script>
在这个示例中，使用 watch 选项允许我们执行异步操作（访问一个 API），限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这是计算属性无法做到的。


#Class 与 Style 绑定
数据绑定一个常见需求是操作元素的 class 列表和它的内联样式。因为它们都是属性 ，我们可以用v-bind 处理它们：只需要计算出表达式最终的字符串。不过，字符串拼接麻烦又易错。因此，在 v-bind 用于 class 和 style 时， Vue.js 专门增强了它。表达式的结果类型除了字符串之外，还可以是对象或数组。

##绑定Html class 

###对象语法
我们可以传给 v-bind:class 一个对象，以动态地切换 class 。
<div v-bind:class="{ active: isActive }"></div>
上面的语法表示 class active 的更新将取决于数据属性 isActive 是否为真值 。

我们也可以在对象中传入更多属性用来动态切换多个 class 。此外， v-bind:class 指令可以与普通的 class 属性共存。如下模板:
<div class="static"
     v-bind:class="{ active: isActive, 'text-danger': hasError }">
</div>
如下 data:
data: {
  isActive: true,
  hasError: false
}
渲染为:

当 isActive 或者 hasError 变化时，class 列表将相应地更新。例如，如果 hasError 的值为 true ， class列表将变为 "static active text-danger"。

你也可以直接绑定数据里的一个对象：
<div v-bind:class="classObject"></div>
data: {
  classObject: {
    active: true,
    'text-danger': false
  }

渲染的结果和上面一样。我们也可以在这里绑定返回对象的计算属性。这是一个常用且强大的模式：
<div v-bind:class="classObject"></div>
data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal',
    }
  }
}

###数组语法
我们可以把一个数组传给 v-bind:class ，以应用一个 class 列表：
<div v-bind:class="[activeClass, errorClass]">
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
渲染为:
<div class="active text-danger"></div>
如果你也想根据条件切换列表中的 class ，可以用三元表达式：
<div v-bind:class="[isActive ? activeClass : '', errorClass]">
当有多个条件 class 时这样写有些繁琐。可以在数组语法中使用对象语法：
<div v-bind:class="[{ active: isActive }, errorClass]">

#用在组件上
当你在一个定制的组件上用到 class 属性的时候，这些类将被添加到根元素上面，这个元素上已经存在的类不会被覆盖。
例如，如果你声明了这个组件:
Vue.component('my_component',{
  template:'<p class="foo bar"'>hi</p>'
})
然后在使用它的时候添加一些 class：
<my-component class="baz boo"></my-component>
HTML 最终将被渲染成为:
<p class="foo bar baz boo">Hi</p>
同样的适用于绑定 HTML class :
<my-component v-bind:class="{ active: isActive }"></my-component>
当 isActive 为 true 的时候，HTML 将被渲染成为:
<p class="foo bar active">Hi</p>

##绑定内联样式
###语法
v-bind:style 的对象语法十分直观——看着非常像 CSS ，其实它是一个 JavaScript 对象。 CSS 属性名可以用驼峰式（camelCase）或短横分隔命名（kebab-case）：

<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
data: {
  activeColor: 'red',
  fontSize: 30
}
直接绑定到一个样式对象通常更好，让模板更清晰：
<div v-bind:style="styleObject"></div>
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
v-bind:style 的数组语法可以将多个样式对象应用到一个元素上：
<div v-bind:style="[baseStyles, overridingStyles]">

##自动添加前缀
当 v-bind:style 使用需要特定前缀的 CSS 属性时，如 transform ，Vue.js 会自动侦测并添加相应的前缀。

##多重值
从 2.3 开始你可以为 style 绑定中的属性提供一个包含多个值的数组，常用于提供多个带前缀的值：
<div :style="{ display: ["-webkit-box", "-ms-flexbox", "flex"] }">

#条件渲染
在 Vue.js ，我们使用 v-if 指令实现同样的功能：
<h1 v-if="ok">Yes</h1>
也可以用 v-else 添加一个 “else” 块：
<h1 v-if="ok">Yes</h1>
<h1 v-else>No</h1>

##<template> 中 v-if 条件组

因为 v-if 是一个指令，需要将它添加到一个元素上。但是如果我们想切换多个元素呢？此时我们可以把一个 <template> 元素当做包装元素，并在上面使用 v-if。最终的渲染结果不会包含 <template> 元素。

<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
v-else

你可以使用 v-else 指令来表示 v-if 的“else 块”：
<div v-if="Math.random() > 0.5">
  Now you see me
</div>
<div v-else>
  Now you don't
</div>
v-else 元素必须紧跟在 v-if 或者 v-else-if 元素的后面——否则它将不会被识别。
v-else-if，顾名思义，充当 v-if 的“else-if 块”。可以链式地使用多次：
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>

##用 key 管理可复用的元素
Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。这么做，除了使 Vue 变得非常快之外，还有一些有用的好处。例如，如果你允许用户在不同的登录方式之间切换:
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>
那么在上面的代码中切换 loginType 将不会清除用户已经输入的内容。因为两个模版使用了相同的元素，<input> 不会被替换掉——仅仅是替换了它的的 placeholder。

这样也不总是符合实际需求，所以 Vue 为你提供了一种方式来声明“这两个元素是完全独立的——不要复用它们”。只需添加一个具有唯一值的 key 属性即可：
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
现在，每次切换时，输入框都将被重新渲染。!
注意, <label> 元素仍然会被高效地复用，因为它们没有添加 key 属性。

##v-show
另一个用于根据条件展示元素的选项是 v-show 指令。用法大致一样：
<h1 v-show="ok">Hello!</h1>
不同的是带有 v-show 的元素始终会被渲染并保留在 DOM 中。v-show 是简单地切换元素的 CSS 属性 display 。
注意， v-show 不支持 <template> 语法，也不支持 v-else。

##v-if vs v-show

v-if 是“真正的”条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。
v-if 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
相比之下， v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。
一般来说， v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件不太可能改变，则使用 v-if 较好。

#列表渲染

v-for

我们用 v-for 指令根据一组数组的选项列表进行渲染。 v-for 指令需要以 item in items 形式的特殊语法， items 是源数据数组并且 item 是数组元素迭代的别名。
<ul id="example-1">
  <li v-for="item in items">
    {{ item.message }}
  </li>
</ul>
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      {message: 'Foo' },
      {message: 'Bar' }
    ]
  }
})
在 v-for 块中，我们拥有对父作用域属性的完全访问权限。 v-for 还支持一个可选的第二个参数为当前项的索引。
<ul id="example-2">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
如同 v-if 模板，你也可以用带有 v-for 的 <template> 标签来渲染多个元素块。例如：
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider"></li>
  </template>
</ul>

##对象迭代 v-for
你也可以用 v-for 通过一个对象的属性来迭代。
<ul id="repeat-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
new Vue({
  el: '#repeat-object',
  data: {
    object: {
      FirstName: 'John',
      LastName: 'Doe',
      Age: 30
    }
  }
})
结果：John
    Doe
    30
你也可以提供第二个的参数为键名：
<div v-for="(value, key) in object">
  {{ key }} : {{ value }}
</div>
在遍历对象时，是按 Object.keys() 的结果遍历，但是不能保证它的结果在不同的 JavaScript 引擎下是一致的

<div id="example-2">
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
</div>
var data = { counter: 0 }
Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  // 技术上 data 的确是一个函数了，因此 Vue 不会警告，
  // 但是我们返回给每个组件的实例的却引用了同一个data对象
  data: function () {
    return data
  }
})
new Vue({
  el: '#example-2'
})
由于这三个组件共享了同一个 data ， 因此增加一个 counter 会影响所有组件！这不对。我们可以通过为每个组件返回全新的 data 对象来解决这个问题：
data: function () {
  return {
    counter: 0
  }
}

##使用 Prop 传递数据
组件实例的作用域是孤立的。这意味着不能(也不应该)在子组件的模板内直接引用父组件的数据。要让子组件使用父组件的数据，我们需要通过子组件的props选项。
子组件要显式地用 props 选项声明它期待获得的数据：
Vue.component('child', {
  // 声明 props
  props: ['message'],
  // 就像 data 一样，prop 可以用在模板内
  // 同样也可以在 vm 实例中像 “this.message” 这样使用
  template: '<span>{{ message }}</span>'
})
然后我们可以这样向它传入一个普通字符串：
<child message="hello!"></child>

HTML 特性是不区分大小写的。所以，当使用的不是字符串模版，camelCased (驼峰式) 命名的 prop 需要转换为相对应的 kebab-case (短横线隔开式) 命名：
Vue.component('child', {
  // camelCase in JavaScript
  props: ['myMessage'],
  template: '<span>{{ myMessage }}</span>'
})
<!-- kebab-case in HTML -->
<child my-message="hello!"></child>

#单向数据流
prop 是单向绑定的：当父组件的属性变化时，将传导给子组件，但是不会反过来。这是为了防止子组件无意修改了父组件的状态——这会让应用的数据流难以理解。
另外，每次父组件更新时，子组件的所有 prop 都会更新为最新值。这意味着你不应该在子组件内部改变 prop 。如果你这么做了，Vue 会在控制台给出警告。
为什么我们会有修改prop中数据的冲动呢？通常是这两种原因：
prop 作为初始值传入后，子组件想把它当作局部数据来用；
prop 作为初始值传入，由子组件处理成其它数据输出。
对这两种原因，正确的应对方式是：
定义一个局部变量，并用 prop 的值初始化它：
props: ['initialCounter'],
data: function () {
  return { counter: this.initialCounter }
}
定义一个计算属性，处理 prop 的值并返回。
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
注意在 JavaScript 中对象和数组是引用类型，指向同一个内存空间，如果 prop 是一个对象或数组，在子组件内部改变它会影响父组件的状态。

TODO 没看明白  啥意思？！！
我们知道，父组件是使用 props 传递数据给子组件，但如果子组件要把数据传递回去，应该怎样做？那就是自定义事件！
使用 v-on 绑定自定义事件

每个 Vue 实例都实现了事件接口(Events interface)，即：
使用 $on(eventName) 监听事件
使用 $emit(eventName) 触发事件
Vue的事件系统分离自浏览器的EventTarget API。尽管它们的运行类似，但是$on 和 $emit 不是addEventListener 和 dispatchEvent 的别名。

另外，父组件可以在使用子组件的地方直接用 v-on 来监听子组件触发的事件。
不能用$on侦听子组件抛出的事件，而必须在模板里直接用v-on绑定，就像以下的例子：

下面是一个例子：
<div id="counter-event-example">
  <p>{{ total }}</p>
  <button-counter v-on:increment="incrementTotal"></button-counter>
  <button-counter v-on:increment="incrementTotal"></button-counter>
</div>
Vue.component('button-counter', {
  template: '<button v-on:click="increment">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    increment: function () {
      this.counter += 1
      this.$emit('increment')
    }
  },
})
new Vue({
  el: '#counter-event-example',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function () {
      this.total += 1
    }
  }
})

###给组件绑定原生事件

有时候，你可能想在某个组件的根元素上监听一个原生事件。可以使用 .native 修饰 v-on 。例如：
<my-component v-on:click.native="doTheThing"></my-component>


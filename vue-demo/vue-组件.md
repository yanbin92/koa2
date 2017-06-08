#组件
什么是组件？
组件（Component）是 Vue.js 最强大的功能之一。组件可以扩展 HTML 元素，封装可重用的代码。在较高层面上，组件是自定义元素， Vue.js 的编译器为它添加特殊功能。在有些情况下，组件也可以是原生 HTML 元素的形式，以 is 特性扩展。

##使用组件

###注册
之前说过，我们可以通过以下方式创建一个 Vue 实例：
new Vue({
  el: '#some-element',
  // 选项
})
要注册一个全局组件，你可以使用 Vue.component(tagName, options)。 例如：
Vue.component('my-component', {
  // 选项
})
对于自定义标签名，Vue.js 不强制要求遵循 W3C规则 （小写，并且包含一个短杠），尽管遵循这个规则比较好。

###DOM 模版解析说明  

当使用 DOM 作为模版时（例如，将 el 选项挂载到一个已存在的元素上）, 你会受到 HTML 的一些限制，因为 Vue 只有在浏览器解析和标准化 HTML 后才能获取模版内容。尤其像这些元素 <ul> ，<ol>，<table> ，<select> 限制了能被它包裹的元素， 而一些像 <option> 这样的元素只能出现在某些其它元素内部。
在自定义组件中使用这些受限制的元素时会导致一些问题，例如：
<table>
  <my-row>...</my-row>
</table>
自定义组件 <my-row> 被认为是无效的内容，因此在渲染的时候会导致错误。变通的方案是使用特殊的 is 属性：
<table>
  <tr is="my-row"></tr>
</table>
应当注意，如果您使用来自以下来源之一的字符串模板，这些限制将不适用：
<script type="text/x-template">
JavaScript内联模版字符串
.vue 组件
因此，有必要的话请使用字符串模版。

###data 必须是函数

通过Vue构造器传入的各种选项大多数都可以在组件里用。 data 是一个例外，它必须是函数。 实际上，如果你这么做：
Vue.component('my-component', {
  template: '<span>{{ message }}</span>',
  data: {
    message: 'hello'
  }
})
那么 Vue 会停止，并在控制台发出警告，告诉你在组件中 data 必须是一个函数。理解这种规则的存在意义很有帮助，让我们假设用如下方式来绕开Vue的警告：
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

现在每个 counter 都有它自己内部的状态了：

##构成组件

组件意味着协同工作，通常父子组件会是这样的关系：组件 A 在它的模版中使用了组件 B 。它们之间必然需要相互通信：父组件要给子组件传递数据，子组件需要将它内部发生的事情告知给父组件。然而，在一个良好定义的接口中尽可能将父子组件解耦是很重要的。这保证了每个组件可以在相对隔离的环境中书写和理解，也大幅提高了组件的可维护性和可重用性。
在 Vue.js 中，父子组件的关系可以总结为 props down, events up 。父组件通过 props 向下传递数据给子组件，子组件通过 events 给父组件发送消息。看看它们是怎么工作的。
![alt text](./static/images/props-events.png)

#Prop
##使用 Prop 传递数据

组件实例的作用域是孤立的。这意味着不能(也不应该)在子组件的模板内直接引用父组件的数据。要让子组件使用父组件的数据，我们需要通过子组件的props选项。

子组件要显式地用 props 选项声明它期待获得的数据：
Vue.component('child',{
    //
    props:['message'],
    template:'<span>{{message}}</span>'
})

然后我们可以这样向它传入一个普通字符串：
<child message="hello"><child>

#动态 Prop

在模板中，要动态地绑定父组件的数据到子模板的props，与绑定到任何普通的HTML特性相类似，就是用 v-bind。每当父组件的数据变化时，该变化也会传导给子组件：
<div>
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
使用 v-bind 的缩写语法通常更简单：
<child :my-message="parentMsg"></child>


#字面量语法 vs 动态语法

初学者常犯的一个错误是使用字面量语法传递数值：
<!-- 传递了一个字符串 "1" -->
<comp some-prop="1"></comp>
因为它是一个字面 prop ，它的值是字符串 "1" 而不是number。如果想传递一个实际的number，需要使用 v-bind ，从而让它的值被当作 JavaScript 表达式计算：
<!-- 传递实际的 number -->
<comp v-bind:some-prop="1"></comp>


#单向数据流

prop 是单向绑定的：当父组件的属性变化时，将传导给子组件，但是不会反过来。这是为了防止子组件无意修改了父组件的状态——这会让应用的数据流难以理解。
另外，每次父组件更新时，子组件的所有 prop 都会更新为最新值。这意味着你不应该在子组件内部改变 prop 。如果你这么做了，Vue 会在控制台给出警告。
为什么我们会有修改prop中数据的冲动呢？通常是这两种原因：
prop 作为初始值传入后，子组件想把它当作局部数据来用；
prop 作为初始值传入，由子组件处理成其它数据输出。
对这两种原因，正确的应对方式是：

1定义一个局部变量，并用 prop 的值初始化它：
    props: ['initialCounter'],
    data: function () {
        return { counter: this.initialCounter }
    }
2定义一个计算属性，处理 prop 的值并返回。
    props: ['size'],
    computed: {
     normalizedSize: function () {
        return this.size.trim().toLowerCase()
        }
    }

注意在 JavaScript 中对象和数组是引用类型，指向同一个内存空间，如果 prop 是一个对象或数组，在子组件内部改变它会影响父组件的状态。

#Prop 验证

我们可以为组件的 props 指定验证规格。如果传入的数据不符合规格，Vue 会发出警告。当组件给其他人使用时，这很有用。
要指定验证规格，需要用对象的形式，而不能用字符串数组：

Vue.component('example', {
  props: {
    // 基础类型检测 （`null` 意思是任何类型都可以）
    propA: Number,
    // 多种类型
    propB: [String, Number],
    // 必传且是字符串
    propC: {
      type: String,
      required: true
    },
    // 数字，有默认值
    propD: {
      type: Number,
      default: 100
    },
    // 数组／对象的默认值应当由一个工厂函数返回
    propE: {
      type: Object,
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        return value > 10
      }
    }
  }
})

#自定义事件
我们知道，父组件是使用 props 传递数据给子组件，但如果子组件要把数据传递回去，应该怎样做？那就是自定义事件！

##使用 v-on 绑定自定义事件

每个 Vue 实例都实现了事件接口(Events interface)，即：
使用 $on(eventName) 监听事件
使用 $emit(eventName) 触发事件

Vue的事件系统分离自浏览器的EventTarget API。尽管它们的运行类似，但是$on 和 $emit 不是addEventListener 和 dispatchEvent 的别名。

另外，父组件可以在使用子组件的地方直接用 v-on 来监听子组件触发的事件。
不能用$on侦听子组件抛出的事件，而必须在模板里直接用v-on绑定，就像以下的例子：

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

给组件绑定原生事件

有时候，你可能想在某个组件的根元素上监听一个原生事件。可以使用 .native 修饰 v-on 。例如：
<my-component v-on:click.native="doTheThing"></my-component>

#.sync 修饰符

2.3.0+
在一些情况下，我们可能会需要对一个 prop 进行『双向绑定』。事实上，这正是 Vue 1.x 中的 .sync修饰符所提供的功能。当一个子组件改变了一个 prop 的值时，这个变化也会同步到父组件中所绑定的值。这很方便，但也会导致问题，因为它破坏了『单向数据流』的假设。由于子组件改变 prop 的代码和普通的状态改动代码毫无区别，当光看子组件的代码时，你完全不知道它何时悄悄地改变了父组件的状态。这在 debug 复杂结构的应用时会带来很高的维护成本。
上面所说的正是我们在 2.0 中移除 .sync 的理由。但是在 2.0 发布之后的实际应用中，我们发现 .sync 还是有其适用之处，比如在开发可复用的组件库时。我们需要做的只是让子组件改变父组件状态的代码更容易被区分。
在 2.3 我们重新引入了 .sync 修饰符，但是这次它只是作为一个编译时的语法糖存在。它会被扩展为一个自动更新父组件属性的 v-on 侦听器。
如下代码
<comp :foo.sync="bar"></comp>
会被扩展为：
<comp :foo="bar" @update:foo="val => bar = val"></comp>
当子组件需要更新 foo 的值时，它需要显式地触发一个更新事件：
this.$emit('update:foo', newValue)

#使用自定义事件的表单输入组件

自定义事件可以用来创建自定义的表单输入组件，使用 v-model 来进行数据双向绑定。看看这个：
<input v-model="something">

这不过是以下示例的语法糖：
<input v-bind:value="something" v-on:input="something = $event.target.value">

所以在组件中使用时，它相当于下面的简写：
<custom-input v-bind:value="something" v-on:input="something = arguments[0]"></custom-input>

所以要让组件的 v-model 生效，它必须：
1接受一个 value 属性
2在有新的 value 时触发 input 事件

来看一个非常简单的货币输入的自定义控件：
<currency-input v-model="price"></currency-input>

Vue.component('currency-input',{
    prop:['value'],
    template:'\
    <span>\
    $\
    <input\ 
    ref="input"\
    v-bind:value="value"\
    v-on:input="updateValue($event.target.value)"\
    >\
    </span>\
    ',
    methods:{
        updateValue:function(value){
            var formattedValue=value.trim().slice(0,value.indexOf(.)+3)
            if(formattedValue!==value){
                 this.$refs.input.value = formattedValue;
            }

            // 通过 input 事件发出数值
            this.$emit('input', Number(formattedValue))
        }
    }
})



#使用 Slot 分发内容

在使用组件时，我们常常要像这样组合它们：
<app>
  <app-header></app-header>
  <app-footer></app-footer>
</app>

注意两点：
<app> 组件不知道它的挂载点会有什么内容。挂载点的内容是由<app>的父组件决定的。
<app> 组件很可能有它自己的模版。

为了让组件可以组合，我们需要一种方式来混合父组件的内容与子组件自己的模板。这个过程被称为 内容分发 (或 “transclusion” 如果你熟悉 Angular)。Vue.js 实现了一个内容分发 API ，参照了当前 Web 组件规范草案，使用特殊的 <slot> 元素作为原始内容的插槽。

#编译作用域

在深入内容分发 API 之前，我们先明确内容在哪个作用域里编译。假定模板为：
<child-component>
  {{ message }}
</child-component>

//如果要绑定作用域内的指令到一个组件的根节点，你应当在组件自己的模板上做：

Vue.component('child-component',{
    template:'<div v-show="someChildProperty">Child</div>',
    data:function(){
        return {
            someChildProperty:true
        }
    }
})

假定 my-component 组件有下面模板：
<div>
  <h2>我是子组件的标题</h2>
  <slot>
    只有在没有要分发的内容时才会显示。
  </slot>
</div>
父组件模版：
<div>
  <h1>我是父组件的标题</h1>
  <my-component>
    <p>这是一些初始内容</p>
    <p>这是更多的初始内容</p>
  </my-component>
</div>
渲染结果：
<div>
  <h1>我是父组件的标题</h1>
  <div>
    <h2>我是子组件的标题</h2>
    <p>这是一些初始内容</p>
    <p>这是更多的初始内容</p>
  </div>
</div>


<slot> 元素可以用一个特殊的属性 name 来配置如何分发内容。多个 slot 可以有不同的名字。具名 slot 将匹配内容片段中有对应 slot 特性的元素。
仍然可以有一个匿名 slot ，它是默认 slot ，作为找不到匹配的内容片段的备用插槽。如果没有默认的 slot ，这些找不到匹配的内容片段将被抛弃。
例如，假定我们有一个 app-layout 组件，它的模板为：
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
父组件模版：
<app-layout>
  <h1 slot="header">这里可能是一个页面标题</h1>
  <p>主要内容的一个段落。</p>
  <p>另一个主要段落。</p>
  <p slot="footer">这里有一些联系信息</p>
</app-layout>
渲染结果为：
<div class="container">
  <header>
    <h1>这里可能是一个页面标题</h1>
  </header>
  <main>
    <p>主要内容的一个段落。</p>
    <p>另一个主要段落。</p>
  </main>
  <footer>
    <p>这里有一些联系信息</p>
  </footer>
</div>
在组合组件时，内容分发 API 是非常有用的机制。

#作用域插槽

2.1.0 新增
作用域插槽是一种特殊类型的插槽，用作使用一个（能够传递数据到）可重用模板替换已渲染元素。
在子组件中，只需将数据传递到插槽，就像你将 prop 传递给组件一样：

<div class="child">
  <slot text="hello from child"></slot>
</div>

在父级中，具有特殊属性 scope 的 <template> 元素，表示它是作用域插槽的模板。scope 的值对应一个临时变量名，此变量接收从子组件中传递的 prop 对象：
<div class="parent">
  <child>
    <template scope="props">
      <span>hello from parent</span>
      <span>{{ props.text }}</span>
    </template>
  </child>
</div>
如果我们渲染以上结果，得到的输出会是：
<div class="parent">
  <div class="child">
    <span>hello from parent</span>
    <span>hello from child</span>
  </div>
</div>

作用域插槽更具代表性的用例是列表组件，允许组件自定义应该如何渲染列表每一项：

<my-awesome-list :item="items">
    <template slot="item" scope="props">
            <li class="my-fancy-item">{{ props.text }}</li>
    </template>
</my-awesome-list>

列表组件的模板：
<ul>
  <slot name="item"
    v-for="item in items"
    :text="item.text">
    <!-- 这里写入备用内容 -->
  </slot>
</ul>

#动态组件

通过使用保留的 <component> 元素，动态地绑定到它的 is 特性，我们让多个组件可以使用同一个挂载点，并动态切换：

var vm = new Vue({
  el: '#example',
  data: {
    currentView: 'home'
  },
  components: {
    home: {  template: '<p>Welcome home!</p>'},
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})

<component v-bind:is="currentView">
  <!-- 组件在 vm.currentview 变化时改变！ -->
</component>


#keep-alive

如果把切换出去的组件保留在内存中，可以保留它的状态或避免重新渲染。为此可以添加一个 keep-alive 指令参数：
<keep-alive>
  <component :is="currentView">
    <!-- 非活动组件将被缓存！ -->
  </component>
</keep-alive>
在API 参考查看更多 <keep-alive> 的细节。


#编写可复用组件

在编写组件时，记住是否要复用组件有好处。一次性组件跟其它组件紧密耦合没关系，但是可复用组件应当定义一个清晰的公开接口。
Vue 组件的 API 来自三部分 - props, events 和 slots ：
Props 允许外部环境传递数据给组件
Events 允许组件触发外部环境的副作用
Slots 允许外部环境将额外的内容组合在组件中。
使用 v-bind 和 v-on 的简写语法，模板的缩进清楚且简洁：

<my-component
  :foo="baz"
  :bar="qux"
  @event-a="doThis"
  @event-b="doThat"
>
  <img slot="icon" src="...">
  <p slot="main-text">Hello!</p>
</my-component>

#子组件索引

尽管有 props 和 events ，但是有时仍然需要在 JavaScript 中直接访问子组件。为此可以使用 ref 为子组件指定一个索引 ID 。例如：
<div id="parent">
  <user-profile ref="profile"></user-profile>
</div>
var parent = new Vue({ el: '#parent' })
// 访问子组件
var child = parent.$refs.profile

!!!当 ref 和 v-for 一起使用时， ref 是一个数组或对象，包含相应的子组件。
$refs 只在组件渲染完成后才填充，并且它是非响应式的。它仅仅作为一个直接访问子组件的应急方案——应当避免在模版或计算属性中使用 $refs 。

#异步组件
在大型应用中，我们可能需要将应用拆分为多个小模块，按需从服务器下载。
为了让事情更简单，vue允许将组件定义为一个工厂函数，
动态的解析组件的定义
vue.js只在组件渲染时触发工厂函数,并且把结果缓存起来 用于后面的再次渲染.

Vue.component('async-example',function(resolve,reject){
 setTimeout(function () {
    // Pass the component definition to the resolve callback
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)

})

工厂函数接收一个 resolve 回调，在收到从服务器下载的组件定义时调用。也可以调用 reject(reason) 指示加载失败。这里 setTimeout 只是为了演示。怎么获取组件完全由你决定。推荐配合使用 ：Webpack 的代码分割功能：

Vue.component('async-webpack-example', function (resolve) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 Ajax 请求自动下载。
  require(['./my-async-component'], resolve)
})
你可以使用 Webpack 2 + ES2015 的语法返回一个 Promise resolve 函数：
Vue.component(
  'async-webpack-example',
  () => import('./my-async-component')
)
如果你是 Browserify 用户,可能就无法使用异步组件了,它的作者已经表明 Browserify 是不支持异步加载的。Browserify 社区发现 一些解决方法，可能有助于已存在的复杂应用。对于其他场景，我们推荐简单实用 Webpack 构建，一流的异步支持


#高级异步组件

New in 2.3.0
自 2.3 起，异步组件的工厂函数也可以返回一个如下的对象：

const AsyncComp = () => ({
  // 需要加载的组件. 应当是一个 Promise
  component: import('./MyComp.vue'),
  // loading 时应当渲染的组件
  loading: LoadingComp,
  // 出错时渲染的组件
  error: ErrorComp,
  // 渲染 loading 组件前的等待时间。默认：200ms.
  delay: 200,
  // 最长等待时间。超出此时间则渲染 error 组件。默认：Infinity
  timeout: 3000
})

#组件命名约定

  当注册组件（或者 props）时，可以使用 kebab-case ，camelCase ，或 TitleCase 。Vue 不关心这个。
   // 在组件定义中 
    components: {
    // 使用 kebab-case 形式注册
    'kebab-cased-component': { /* ... */ },
    // register using camelCase
    'camelCasedComponent': { /* ... */ },
    // register using TitleCase
    'TitleCasedComponent': { /* ... */ }
    }
在 HTML 模版中，请使用 kebab-case 形式：
<!-- 在HTML模版中始终使用 kebab-case -->
<kebab-cased-component></kebab-cased-component>
<camel-cased-component></camel-cased-component>
<title-cased-component></title-cased-component>

当使用字符串模式时，可以不受 HTML 的 case-insensitive 限制。这意味实际上在模版中，你可以使用 camelCase 、 TitleCase 或者 kebab-case 来引用：
<!-- 在字符串模版中可以用任何你喜欢的方式! -->
<my-component></my-component>
<myComponent></myComponent>
<MyComponent></MyComponent>

如果组件未经 slot 元素传递内容，你甚至可以在组件名后使用 / 使其自闭合：
<my-component/>
当然，这只在字符串模版中有效。因为自闭的自定义元素是无效的 HTML ，浏览器原生的解析器也无法识别它。


#递归组件

组件在它的模板内可以递归地调用自己，不过，只有当它有 name 选项时才可以：
name: 'unique-name-of-my-component'

当你利用Vue.component全局注册了一个组件, 全局的ID作为组件的 name 选项，被自动设置.
Vue.component('unique-name-of-my-component', {
  // ...
})
如果你不谨慎, 递归组件可能导致死循环:
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'

上面组件会导致一个错误 “max stack size exceeded” ，所以要确保递归调用有终止条件 (比如递归调用时使用 v-if 并让他最终返回 false )。

#组件间的循环引用Circular References Between Components

假设你正在构建一个文件目录树，像在Finder或文件资源管理器中。你可能有一个 tree-folder组件:
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
然后 一个tree-folder-contents组件：
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>


#内联模版

如果子组件有 inline-template 特性，组件将把它的内容当作它的模板，而不是把它当作分发内容。这让模板更灵活。
<my-component inline-template>
  <div>
    <p>These are compiled as the component's own template.</p>
    <p>Not parent's transclusion content.</p>
  </div>
</my-component>

#X-Templates

另一种定义模版的方式是在 JavaScript 标签里使用 text/x-template 类型，并且指定一个id。例如：
<script type="text/x-template" id="hello-world-template">
  <p>Hello hello hello</p>
</script>

Vue.component('hello-world', {
  template: '#hello-world-template'
})

这在有很多模版或者小的应用中有用，否则应该避免使用，因为它将模版和组件的其他定义隔离了。

#对低开销的静态组件使用 v-once

尽管在 Vue 中渲染 HTML 很快，不过当组件中包含大量静态内容时，可以考虑使用 v-once 将渲染结果缓存起来，就像这样：
Vue.component('terms-of-service', {
  template: '\
    <div v-once>\
      <h1>Terms of Service</h1>\
      ... a lot of static content ...\
    </div>\
  '
})
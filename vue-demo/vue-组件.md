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


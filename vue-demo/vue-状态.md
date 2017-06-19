#简单状态管理起步使用

经常被忽略的是，Vue 应用中原始 数据 对象的实际来源 - 当访问数据对象时，一个 Vue 实例只是简单的代理访问。所以，如果你有一处需要被多个实例间共享的状态，可以简单地通过维护一份数据来实现共享：
const sourceOfTruth = {}
const vmA = new Vue({
  data: sourceOfTruth
})
const vmB = new Vue({
  data: sourceOfTruth
})
现在当 sourceOfTruth 发生变化，vmA 和 vmB 都将自动的更新引用它们的视图。子组件们的每个实例也会通过 this.$root.$data 去访问。现在我们有了唯一的实际来源，但是，调试将会变为噩梦。任何时间，我们应用中的任何部分，在任何数据改变后，都不会留下变更过的记录。
为了解决这个问题，我们采用一个简单的 store 模式：
var store = {
  debug: true,
  state: {
    message: 'Hello!'
  },
  setMessageAction (newValue) {
    this.debug && console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    this.debug && console.log('clearMessageAction triggered')
    this.state.message = 'clearMessageAction triggered'
  }
}

需要注意，所有 store 中 state 的改变，都放置在 store 自身的 action 中去管理。这种集中式状态管理能够被更容易地理解哪种类型的 mutation 将会发生，以及它们是如何被触发。当错误出现时，我们现在也会有一个 log 记录 bug 之前发生了什么。

此外，每个实例/组件仍然可以拥有和管理自己的私有状态：
var vmA = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})
var vmB = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})
重要的是，注意你不应该在 action 中 替换原始的状态对象 - 组件和 store 需要引用同一个共享对象，mutation 才能够被观察  接着我们继续延伸约定，组件不允许直接修改属于 store 实例的 state，而应执行 action 来分发 (dispatch) 事件通知 store 去改变，我们最终达成了 Flux 架构。这样约定的好处是，我们能够记录所有 store 中发生的 state 改变，同时实现能做到记录变更 (mutation) 、保存状态快照、历史回滚/时光旅行的先进的调试工具。 说了一圈其实又回到了vuex ，如果你已经读到这儿，或许可以去尝试一下！


# Flux 的最大特点，就是数据的"单向流动"。
1用户访问 View
2View 发出用户的 Action
3Dispatcher 收到 Action，要求 Store 进行相应的更新
4Store 更新后，发出一个"change"事件
5View 收到"change"事件后，更新页面



#单元测试

配置和工具

任何兼容基于模块的构建系统都可以正常使用，但如果你需要一个具体的建议，可以使用 Karma 进行自动化测试。它有很多社区版的插件，包括对 Webpack 和 Browserify 的支持。更多详细的安装步骤，请参考各项目的安装文档，通过这些 Karma 配置的例子可以快速帮助你上手（Webpack 配置，Browserify 配置）。
简单的断言

在测试的代码结构方面，你不必为了可测试在你的组件中做任何特殊的操作。只要导出原始设置就可以了：
<template>
  <span>{{ message }}</span>
</template>
<script>
  export default {
    data () {
      return {
        message: 'hello!'
      }
    },
    created () {
      this.message = 'bye!'
    }
  }
</script>

当测试的组件时，所要做的就是导入对象和 Vue 然后使用许多常见的断言：
// 导入 Vue.js 和组件，进行测试
import Vue from 'vue'
import MyComponent from 'path/to/MyComponent.vue'
// 这里是一些 Jasmine 2.0 的测试，你也可以使用你喜欢的任何断言库或测试工具。
describe('MyComponent', () => {
  // 检查原始组件选项
  it('has a created hook', () => {
    expect(typeof MyComponent.created).toBe('function')
  })
  // 评估原始组件选项中的函数的结果
  it('sets the correct default data', () => {
    expect(typeof MyComponent.data).toBe('function')
    const defaultData = MyComponent.data()
    expect(defaultData.message).toBe('hello!')
  })
  // 检查mount中的组件实例
  it('correctly sets the message when created', () => {
    const vm = new Vue(MyComponent).$mount()
    expect(vm.message).toBe('bye!')
  })
  // 创建一个实例并检查渲染输出
  it('renders the correct message', () => {
    const Ctor = Vue.extend(MyComponent)
    const vm = new Ctor().$mount()
    expect(vm.$el.textContent).toBe('bye!')
  })
})

#编写可被测试的组件

很多组件的渲染输出由它的 props 决定。事实上，如果一个组件的渲染输出完全取决于它的 props，那么它会让测试变得简单，就好像断言不同参数的纯函数的返回值。看下面这个例子:
<template>
  <p>{{ msg }}</p>
</template>
<script>
  export default {
    props: ['msg']
  }
</script>
你可以在不同的 props 中，通过 propsData 选项断言它的渲染输出:
import Vue from 'vue'
import MyComponent from './MyComponent.vue'
// 挂载元素并返回已渲染的文本的工具函数 
function getRenderedText (Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData }).$mount()
  return vm.$el.textContent
}
describe('MyComponent', () => {
  it('render correctly with different props', () => {
    expect(getRenderedText(MyComponent, {
      msg: 'Hello'
    })).toBe('Hello')
    expect(getRenderedText(MyComponent, {
      msg: 'Bye'
    })).toBe('Bye')
  })
})

#断言异步更新

由于 Vue 进行 异步更新DOM 的情况，一些依赖DOM更新结果的断言必须在 Vue.nextTick 回调中进行：
// 在状态更新后检查生成的 HTML
it('updates the rendered message when vm.message updates', done => {
  const vm = new Vue(MyComponent).$mount()
  vm.message = 'foo'
  // 在状态改变后和断言 DOM 更新前等待一刻
  Vue.nextTick(() => {
    expect(vm.$el.textContent).toBe('foo')
    done()
  })
})



#服务端渲染

SSR 完全指南

在 2.3 发布后我们发布了一份完整的构建 Vue 服务端渲染应用的指南。这份指南非常深入，适合已经熟悉 Vue, webpack 和 Node.js 开发的开发者阅读。请移步 ssr.vuejs.org。（目前只有英文版，社区正在进行中文版的翻译）
Nuxt.js

从头搭建一个服务端渲染的应用是相当复杂的。幸运的是，我们有一个优秀的社区项目 Nuxt.js 让这一切变得非常简单。Nuxt 是一个基于 Vue 生态的更高层的框架，为开发服务端渲染的 Vue 应用提供了极其便利的开发体验。更酷的是，你甚至可以用它来做为静态站生成器。推荐尝试。

#TypeScript Support

2.2 版本中针对 TS + Webpack 2 用户的重要改动

在 Vue 2.2 里，我们引入了新机制，把 dist 文件都作为 ES 模块发布。这在 webpack 2 中属于默认行为。遗憾的是，这个改动会引入一个会破坏兼容性的意外改动。在 TypeScript + webpack 2 里， import Vue = require('vue') 现在会返回一个综合的 ES 模块对象，而不是 Vue 对象本身了。
我们计划在未来把所有的官方类型声明都改成 ES-风格的导出方式（译注：export）。请参阅下面的推荐配置板块，配置一个不易过时的编码方案。
我们计划在未来把所有的官方类型声明都改成 ES-风格的导出方式（译注：export）。请参阅下面的推荐配置板块，配置一个不易过时的编码方案。

不幸的是，这里也有一些局限性：
TypeScript 不能推断出 Vue API 里的所有类型。比如，他们不知道我们 data 函数中返回的 message 属性会被添加到 MyComponent 实例中。这意味着如果我们给 message 赋值一个数字或者布尔值，linter 和 编译器并不能抛出一个“该值应该是字符串”的错误。
因为第一条的局限, 如上的类型注释可能会很罗嗦。TypeScript 不能正确推导 message 的类型，是唯一迫使我们手动声明它是 string 的原因。
好消息是，vue-class-component 能解决以上的两个问题。这是一个官方的姐妹库，它能允许你把组件声明为一个原生的 JavaScript 类，外加一个 @Component 的修饰符。为了举例说明，我们把上面的栗子重写一下吧:
import Vue from 'vue'
import Component from 'vue-class-component'
// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  // 所有的组件选项都可以放在这里
  template: '<button @click="onClick">Click!</button>'
})
export default class MyComponent extends Vue {
  // 初始数据可以直接声明为实例的属性
  message: string = 'Hello!'
  // 组件方法也可以直接声明为实例的方法
  onClick (): void {
    window.alert(this.message)
  }
}
有了这种备选语法，我们的组件定义不仅仅更加短小了，而且 TypeScript 也能在无需显式的接口声明的情况下，正确推断 message 和 onClick 的类型了呢。这个策略甚至能让你处理计算属性（computed），生命周期钩子以及 render 函数的类型。你可以参阅 vue-class-component 文档，来了解完整的细节。
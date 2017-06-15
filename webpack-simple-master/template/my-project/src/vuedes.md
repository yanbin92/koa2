语言块

#<template>
<ul>
<li>
默认语言：html。
</li><li>
每个 .vue 文件最多包含一个 <template> 块</li>
<li>
内容将被提取为字符串，将编译并用作 Vue 组件的 template 选项。
</li>
<ul>

#<script>

默认语言：js (在检测到 babel-loader 或 buble-loader 配置时自动支持ES2015).

每个 .vue 文件最多包含一个 <script> 块

该脚本在类 CommonJS 环境中执行（就像通过 Webpack 打包的正常 js 模块），这意味这你可以 require() 其它依赖。在 ES2015 支持下，你也可以使用 import 和 export 语法。

脚本必须导出 Vue.js 组件对象。也可以导出由 Vue.extend() 创建的扩展对象，但是普通对象是更好的选择。

#<style>

默认语言： css。

一个 .vue 文件可以包含多个 <style> 标签。

style 标签可以有 scoped 或者 module 属性 (查看 CSS 作用域 和 CSS 模块) 以帮助你将样式封装到当前组件。具有不同封装模式的多个 style 标签可以在同一个组件中混合使用。

默认情况下，将会使用 style-loader 提取内容，并通过 style 标签动态加入文档的 <head> 中，也可以配置 Webpack 将所有 styles 提取到单个 CSS 文件中.

#自定义块

只在 vue-loader 10.2.0+ 中支持

可以在 .vue 文件中填加额外的自定义块来实现项目的特定需求，例如 <docs> 块。vue-loader 将会使用标签名来查找对应的 webpack loaders 来应用在对应的块上。webpack loaders 需要在 vue-loader 的选项 loaders 中指定。

更多细节，查看 自定义块。

#Src 导入

如果你喜欢分隔你的 .vue 文件到多个文件中，你可以通过 src 属性导入外部文件：

<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>


需要注意的是 src 导入遵循和 require() 一样的规则，这意味着你相对路径需要以 ./ 开始，你还可以从 NPM 包中直接导入资源，例如：

!-- import a file from the installed "todomvc-app-css" npm package -->
<style src="todomvc-app-css/index.css"/>

在自定义块上同样支持 src 导入，例如：

<unit-test src="./unit-test.js">
</unit-test>

语法高亮

目前语法高亮支持 Sublime Text, Atom, Vim, Visual Studio Code, Brackets, and JetBrains products (WebStorm, PhpStorm, 等)。 非常感谢其他编辑器/IDEs 所作的贡献！如果在 Vue 组件中没有使用任何预处理器，你可以把 .vue 文件当作 HTML 对待。

#注释

在语言块中使用该语言块对应的注释语法（HTML, CSS, JavaScript, Jade, 等）。顶层注释使用 HTML 注释语法：<!-- comment contents here -->


#创建项目

使用 vue-cli

推荐用脚手架工具 vue-cli 来创建一个使用 vue-loader 的项目：

npm install -g vue-cli
vue init webpack-simple hello-vue
cd hello-vue
npm install
npm run dev # ready to go!
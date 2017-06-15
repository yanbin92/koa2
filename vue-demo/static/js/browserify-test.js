// 通过 Browserify 或 Webpack 使用 CommonJS 兼容模块
var Vue = require('vue')
var VueRouter = require('vue-router')
// 不要忘了调用此方法
Vue.use(VueRouter)

/**
把需要合成的js文件生成了一个流,通过 > 操作,输出到你指定的文件
$ browserify browserify-test.js > bundle.js
现在 bundle.js 就包括了所有让 robot.js 运行所需要的javascript. 只需要在html里插入script标签,把bundle.js引入就行了.

<html>
  <body>
    <script src="bundle.js"></script>
  </body>
</html>
 */
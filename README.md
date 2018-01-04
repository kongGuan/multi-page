# 说明

1、请特别注意，直接使用 `cnpm` 可能会导致依赖不正确。强烈建议给 npm 设置 taobao 的 registry。 

    `npm install --registry=https://registry.npm.taobao.org`

    如果你已经用上了 yarn，建议这样 
    `yarn config set registry https://registry.npm.taobao.org`
    `yarn`

2、如果你遇到 `$t` 报错问题，先删除 `node_modules`文件夹后再重装依赖。

3、新建页面，需重新`npm run dev`才可以正常访问新建的页面。

# 前言
相信用vue的童鞋，很多一部分在用于单页面项目，也不排除传统的多页面项目，我们就着手用vue开发了多页面的webapp，相对于单页开发效率更高，使用单页面或者多页面，最终还是看项目的需求啦。

这一次我们基于`vuejs2+webpack3+vux-ui`重新发布了全新的vue脚手架，同时还支持二级目录，以解决页面比较多时，便于归类查找的问题。基于webpack3，构建速度高。ajax获取数据，使用`axios`，当然还有其他的优化

# 主要功能
    1、全局统一使用的模块`Lib.js`库
    2、支持字体图标
    3、构建时，增加对css打包的支持
    4、提取公共模块
    5、多页面可使用vue-router2路由
    6、可自定义页面模块名，例如 http:// localhost:8091/`views`/home/index.html，`views`就是我们线上的模块名
    7、支持二级目录，便于归类
    8、模块下静态文件可直接调用
    9、发送ajax请求，使用`axios`库，简单封装了一个库，为了减少学习成本，封装参数基本与`JQ ajax`一致，如果不需要可直接删除
    10、整合了vue最流行的UI框架，`vuxui2.x，element-ui，mint-ui`，`github star` 已接近`8K`了，组件非常全面，并且作者一直有维护，
        具体了解更多，请访问官网 
        10.1、https://vux.li
        10.2、http://element.eleme.io/#/zh-CN
        10.3、http://mint-ui.github.io/#!/zh-cn
    11、基于`webpack3`，更高的构建速度，包体积更小，全面支持`ES6 Modules`
    12、热更新，效率提升神器呀
    13、支持`Less`css预处理
    14、获取多页面的url参数的方法
    15、可定义打包的资料文件夹名称


# 第三方组件

1、引用了Element-ui 2.0.3（可按需引入）
    不需要使用时可移除`npm uninstall element-ui`
    移除时需要更改（webpack.base.conf 、 .bablerc）
3、引入vux组件 2.7.1(内置less和less-loader)如不需要，可移除
     不需要使用时可移除：`npm uninstall vux vux-loader less less-loader`  如果使用less可以不移除less
     移除时需要更改（webpack.base.conf 、 .bablerc）
4、引入mint-ui 2.2.9（可按需引入，移动端适用）
    不需要使用时可移除`npm uninstall mint-ui`
    移除时需要更改（.bablerc）

# css预处理
1、sass
2、less

# 安装 
``` bash
# 安装依赖
npm install

# 调试环境 serve with hot reload at localhost:8091
npm run dev

# 生产环境 build for production with minification
npm run build

```
本地默认访问端口为8091，需要更改的童鞋请到项目目录文件`config/index.js`修改。


## 目录结构
``` 
project
 |---build
 |---src
     |---assets    #资源
     |---scss/_*.scss  scss公共配置	
 |---components 组件
     |---HelloWorld.vue  vueDemo组件
|---views    #各个页面模块，模块名可以自定义哦！（config/index.js   moduleName可以更改。）
     |---home    #一级目录
        |---list    #二级目录
             |---index.js
             |---App.vue
        |---index.js #一级页面
        |---App.vue		 
......


```
可以自定义模块的名称
例如 http:// localhost:8091/`views`/home/list.html，`views`就是我们线上的模块名，如需修改请到项目目录文件config/index.js修改`moduleName`参数，修改这里的配置的同时，也要同时重命名`/src/views`的这个文件夹名称，是否会报错的。

在`view`里二级文件夹，一个文件夹就是一个html，`js``vue``html(可用统一的/src/index.html)` 都统一放在当前文件夹里，当然你也可以继续放其他的资源，例如css、图片等，webpack会打包到当前模块里。


## Lib.js库使用

我们做多页面开发，那肯定会涉及到全局都能调用的公共库，或者是把别人封装的库也一起打包在全局公共模块里。

如果看过源码的童鞋，在`*.vue`页面里，都统一import了一个文件

```
import Lib from 'assets/common/Lib';
```
这就是全局统一公共模块，我们先看看`Lib.js`里的代码

``` bash
# 导入全局的css
require('assets/scss/_base.scss');
# 导入全局的共用事件
import M from './common';

export default{
	M
}

```
在`Lib.js`的`M`都是事件调用简写。例如我们现在想调用APP的名称，在`.vue`里可以这么写

``` bash
import Lib from 'assets/common/Lib';
Lib.M.getUrlQuery();  
```
只需要在`*.vue`里导入`import Lib from 'assets/common/Lib';'`，就可以使用全局模块了。
当然你还可以在Lib做一些程序判断，例如权限判断等。

common.js有一些公共方法，不使用可以删除

## Utils类库
新增工具类库，如`String、Date、Number、Array`等工具类库，里面包含很多可使用的方法提供使用，直接调用即可（已在Lib.js中引入）

## 公共模块
我们通常会把常用的库都打包成公共模块，`CommonsChunkPlugin` 插件，是一个可选的用于建立一个独立文件(又称作 chunk)的功能，这个文件包括多个入口 chunk 的公共模块。最终合成的文件能够在最开始的时候加载一次，便存起来到缓存中供后续使用。这个带来速度上的提升，因为浏览器会迅速将公共的代码从缓存中取出来，而不是每次访问一个新页面时，再去加载一个更大的文件。

不同的项目，使用到的插件库数量有所不同，我们可以调整`minChunks`以达到公共模块的大小，文件路径为`/build/webpack.prod.conf.js`，cart+F查找`minChunks`参数，`minChunks: 4` 意思代表为至少被4个页面引用了，就打包进入公共模块，具体的使用方法，可以再详细了解`webpack`中文文档。http://www.css88.com/doc/webpack2/plugins/commons-chunk-plugin/
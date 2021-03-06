<template>
    <div class="hello">
        <Card :bordered="false" style="margin-bottom: 20px;">
            <p slot="title">布局说明</p>
            <p>
                <h4>
                    上边黑色标题栏包含： 
                </h4>
                <br>
            </p>
            <p>
                1、左上：logo标题<br>
                2、右上：用户名
            </p>
            <br>
            <p>
                <h4>左侧栏：菜单区域</h4>
                <br>
            </p>
        </Card>
        <div>
            <h1>前端规范</h1>
            <h2>1、技术标准</h2>
            <blockquote>
            <p>前端技术标准包含以下，但不限于以下所申明</p>
            </blockquote>
            <p>1.1、<span style="color:red;">*必备</span> <code>vue2.0</code>，详细参考<a target="_blank"  href="https://vuejs.org/">官网</a></p>
            <p>1.2、<span style="color:red;">*必备</span> <code>webpack2.0</code>，详细参考<a target="_blank"  href="https://doc.webpack-china.org/configuration/">官网</a></p>
            <p>1.3、<span style="color:red;">*必备</span> <code>jquery</code>，详细使用参考：<a target="_blank"  href="http://jquery.cuishifeng.cn/">jquery使用中文链接</a></p>
            <p>1.4、<span style="color:red;">*必备</span> <code>vue-router</code>，需要懂如何配置及使用：<a target="_blank"  href="https://router.vuejs.org/zh-cn/">官方文档</a></p>
            <p>1.5、<code>vuex</code>，全局状态管理，需要知道配置和简单使用：<a target="_blank"  href="http://vuex.vuejs.org/zh-cn/">官方文档</a></p>
            <p>1.6、<span style="color:red;">*必备</span> <code>axios</code>，ajax请求库，promise风格，<a target="_blank"  href="https://github.com/mzabriskie/axios">官方文档</a></p>
            <p>1.7、<span style="color:red;">*必备</span> <code>iview</code>，主要UI效果库，基于<code>vue2.0</code>，<a target="_blank"  href="https://www.iviewui.com/docs/guide/install">官方文档</a></p>
            <p>1.8、<code>vue-loader</code>，<code>.vue</code>文件加载器，需要有了解。<a target="_blank"  href="https://vue-loader.vuejs.org/zh-cn/">官方文档</a></p>
            <p>1.9、<span style="color:red;">*必备</span><code>ES6</code>，<code>JavaScript ES6</code>规范，<a target="_blank"  href="http://es6.ruanyifeng.com/">参考地址</a></p>
            <p>1.10、<code>less</code>语法，<a target="_blank"  href="http://less.bootcss.com/">参考地址</a></p>
            <h2>2、目录结构</h2>
            <h3><code>目录结构统一使用vue-cli命令生成的模板进行扩展</code></h3>
            <p>命令如下：</p>
            <pre><code class="language-bash">vue init webpack projectName  //创建初始化模板项目

            cd projectName  //进入到项目目录

            npm install //安装nodejs依赖

            npm run dev //开启开发模式
            </code></pre>
            <p>命令说明：</p>
            <p>2.1、<code>vue</code>是<code>vue-cli</code>的简写，具体使用，请使用<code>npm</code>安装：</p>
            <pre><code class="language-bash">npm install vue-cli -g

            或者使用淘宝npm安装：

            cnpm install vue-cli -g
            </code></pre>
            <p>2.2、使用<code>vue</code>命令行工具产生的目录结构</p>
            <pre><code class="language-js">.
            ├── .babelrc    //babel配置文件，babel配置统一在这里配置
            ├── .editorconfig   //编辑器配置，使用默认
            ├── .eslintignore   //eslint忽略配置
            ├── .eslintrc.js        //eslint配置
            ├── .gitignore      //git忽略配置
            ├── .postcssrc.js   //postcss配置，如未使用可忽略。默认vue会生成此文件
            ├── build   //构建目录
            |   ├── build.js        //vue打包时的构建入口build文件
            |   ├── check-versions.js   //版本检测，详细看文件内容
            |   ├── dev-client.js   //开发模式下的客服端，主要是配置热加载
            |   ├── dev-server.js   //开发服务器文件
            |   ├── utils.js        //vue定义的工具类文件
            |   ├── vue-loader.conf.js  //vue-loader的配置文件
            |   ├── webpack.base.conf.js        //webpack基础配置文件，prod、dev、test都会合并此文件配置
            |   ├── webpack.dev.conf.js     //webpack的开发配置文件，一般使用默认即可
            |   ├── webpack.prod.conf.js        //webpack的生产配置文件。如果生产环境有特殊处理在此配置
            |   └── webpack.test.conf.js        //webpack的测试配置文件
            ├── config  //配置文件夹，用来配置一些环境变量之类的。都是配置webpack。
            |   ├── dev.env.js
            |   ├── index.js
            |   ├── prod.env.js
            |   └── test.env.js
            ├── index.html  //此html文件是整个应用的入口。vue默认使用此文件配置HtmlWebpackPlugin的template项
            ├── package.json    //全局包管理。安装的npm依赖包都在这里声明。
            ├── README.md   //项目说明文件。在此说明项目
            ├── src //源文件目录
            |   ├── App.vue //app入口主视图
            |   ├── assets  //放置本地图片、自定义第三方库的文件，其他文件，如json文件、视频文件等
            |   |   └── logo.png        //assets目录文件请按下面的assets目录结构规范
            |   ├── components  //组件目录，放置组件的目录，
            |   |   └── pages   //页面目录，对每个路由，请新建一个目录，并将此路由下的视图放置在此目录下
            |   |       └── index   //视图名称必须要是见名示意，如这里的示例
            |   |       └── login
            |   |       └── register
            |   |   └── widgets //自定义组件目录。按功能分
            |   |       └── common  //公共组件。这种在其他地方经常用到的存放在这里。
            |   |       └── layout  //专门放置layout布局类
            |   ├── main.js //主入口js文件，此文件中初始化app内容。如相关依赖引入，vue实例初始化等。
            |   └── router  //路由文件夹
            |   |   └── index.js        //主路由文件，在此文件中申明路由，导出路由，引用页面路由。
            |   |   └── login.js        //其他页面路由，命名规则统一使用按功能命名方式，如登陆：login
            ├── static  //static目录是作为静态资源，在vue打包的时候会将此目录下的文件合并到最终的static目录
            |   └── .gitkeep        //不要在此目录下存放文件，不利于文件关系管理。有文件存放请放在/src/assets目录
            └── test        //测试用例目录
                ├── e2e //e2e测试目录
                |   ├── custom-assertions
                |   |   └── elementCount.js
                |   ├── nightwatch.conf.js
                |   ├── runner.js
                |   └── specs
                |       └── test.js
                └── unit    //单元测试目录
                    ├── .eslintrc
                    ├── index.js
                    ├── karma.conf.js
                    └── specs
                        └── Hello.spec.js
            </code></pre>
            <p>3、<code>assets</code>目录结构规范</p>
            <pre><code class="language-js">.
            ├── libs        //第三方文件目录，请带上第三方依赖的readme.md文件，或自行写上使用说明！
            |   ├── bootstrap   //按库名称新建文件夹，如这里的：bootstrap、jquery、echarts等.
            |   ├── echarts
            |   ├── jquery      
            |   ├── zepto
            |   └── ztree
            └── local   //本地文件目录，存放开发是用的文件。请按文件类型新建文件夹，按类型分类。
                ├── audio   //音频文件
                ├── css     //css文件
                ├── html        //html文件
                ├── img     //图片文件
                ├── js      //js文件
                ├── less        //less文件
                ├── sass        //sass文件
                ├── template        //...
                └── video
            </code></pre>
            <h2>3、第三方库要求标准</h2>
            <h3>3.1、第三方库请尽量使用npm安装。</h3>
            <blockquote>
            <p>如果发现此库有自己更改，或者有自定义，请从<code>node_modules</code>拷贝，更改完成后复制到指定的第三方文件目录，并附带说明！</p>
            </blockquote>
            <h3>3.2、npm库中不存在的第三方库。</h3>
            <blockquote>
            <p>如果此依赖库在npm仓库不存在，请复制github或者其官网下的<code>build</code>版本。
            <code>build</code>版本一般指的是，官方构建后的未压缩版本。如有源码请一并复制源码。</p>
            </blockquote>
            <h3>3.3、第三方库必须带上使用说明，或者官方的<code>readme</code>文件.</h3>
            <blockquote>
            <p>开源第三方一般都有源码和<code>readme</code>文件，请一并带上。</p>
            </blockquote>
            <h3>3.4、示例一个第三方库</h3>
            <p>如下面是iview的npm安装包目录，如果我们有自行更改iview的某个组件，可以把iview整个目录（<code>node_modules</code>目录除外）复制即可。</p>
            <pre><code class="language-js">.
            ├── .npminstall.done
            ├── dist
            |   ├── iview.js
            |   ├── iview.min.js
            |   └── styles
            |       ├── fonts
            |       |   ├── ionicons.eot
            |       |   ├── ionicons.svg
            |       |   ├── ionicons.ttf
            |       |   └── ionicons.woff
            |       └── iview.css
            ├── LICENSE
            ├── package.json
            ├── README.md
            └── src

            </code></pre>
            <blockquote>
            <p>常用第三库查找地址</p>
            </blockquote>
            <p>
            <a href="https://npmjs.com" target="_blank">1、https://npmjs.com</a>
            <br>
            <a target="_blank" href="http://www.bootcdn.cn/">2、http://www.bootcdn.cn/</a>
            </p>
   
        </div>
    </div>
</template>

<script>
export default {
  name: 'hello',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      urls: {
        query: 'http://172.28.10.47:8080/app-demand/admin/otherSearch/getApkInfoByApkName'
      },
      echartOptions: {},
      columns: [{
        "title": "名称",
        "key": "name",
        "fixed": "left"
      }]
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    :root {
        /* General color properties */

        --main-text-color: #333;
        --secondary-text-color: #888;

        --main-element-color: #e7e7e7;
        --energetic-element-color: #b5b5b5;
        --structural-element-color: #f0f0f0;

        --main-bg-color: #fff;

        /* Other properties */

        --use-default: null; /* Invalid value to prevent changing the property */

        /* Elements properties */

        --column-border-color: var(--structural-element-color);

        --body-color: var(--main-text-color);
        --link-color: var(--use-default);
        --textarea-color: #111;
        --body-bg-color: var(--main-bg-color);

        --top-panel-link-color: var(--main-text-color);
        --top-panel-bg-color: var(--structural-element-color);
        --top-panel-border-color: var(--structural-element-color);

        --top-panel-close-color: #999;
        --top-panel-close-hover-color: #777;
        --top-panel-close-hover-bg-color: #d7d7d7;

        --top-panel-btn-bg-color: #e0e0e0;
        --top-panel-btn-active-bg-color: #d0d0d0;
        --top-panel-btn-disabled-bg-color: #d0d0d0;

        --top-bar-button-color: var(--secondary-text-color);
        --top-bar-button-bg-color: var(--structural-element-color);
        --top-bar-button-active-bg-color: var(--main-element-color);
        --top-bar-button-enabled-border-color: var(--energetic-element-color);

        --top-bar-arrow-bg-color: #eaeaea;
        --top-bar-arrow-active-bg-color: #e1e1e1;

        --bottom-bar-word-count-color: var(--secondary-text-color);

        --file-menu-item-color: var(--secondary-text-color);
        --file-menu-item-border-color: var(--main-element-color);
        --file-menu-item-enabled-border-color: var(--energetic-element-color);
        
        --file-menu-item-close-color: var(--energetic-element-color);
        --file-menu-item-close-hover-color: var(--secondary-text-color);
        --file-menu-item-close-hover-bg-color: var(--main-element-color);
        --file-menu-item-edited-close-bg-color: var(--energetic-element-color);
        --file-menu-item-edited-close-border-color: var(--main-bg-color);

        --modal-bg-color: var(--main-bg-color);
        --modal-border-color: var(--energetic-element-color);

        --modal-button-color: var(--secondary-text-color);
        --modal-button-border-color: var(--energetic-element-color);
        --modal-button-primary-color: var(--main-text-color);
        --modal-button-primary-border-color: var(--secondary-text-color);
        --modal-button-active-bg-color: #f7f7f7;

        --drag-mask-color: #999;
        --drag-mask-bg-color: rgba(255, 255, 255, .8);
        --drag-mask-border-color: #ddd;

        --quote-border-color: var(--main-element-color);
        --hr-border-color: var(--main-element-color);
        --table-border-color: var(--main-element-color);
        --table-row-even-bg-color: #f8f8f8;
        --pre-text-bg-color: var(--main-element-color);
        --pre-text-highlighted-bg-color: #d7d7d7;

        --settings-light-theme-control: none;
        --settings-dark-theme-control: inline;

        --scrollbar-size: var(--use-default);
        --scrollbar-button-size: var(--use-default);
        --scrollbar-button-display: var(--use-default);
        --scrollbar-corner-bg-color: var(--use-default);
        --scrollbar-track-bg-color: var(--use-default);
        --scrollbar-bar-border: var(--use-default);
        --scrollbar-thumb-bg-clip: var(--use-default);
        --scrollbar-thumb-min-size: var(--use-default);
        --scrollbar-thumb-bg-color: var(--use-default);
        --scrollbar-thumb-hover-bg-color: var(--use-default);
        --scrollbar-thumb-active-bg-color: var(--use-default);
    }

    .clearfix {
        *zoom: 1;
    }

    .clearfix:before,
    .clearfix:after {
        content: "";
        display: table;
    }

    .clearfix:after {
        clear: both;
    }

    div.full-height {
        overflow: auto;
    }

    .visible-when-fullscreen,
    .fullscreen .hidden-when-fullscreen {
        display: none;
    }

    .fullscreen .visible-when-fullscreen,
    .hidden-when-fullscreen {
        display: block;
    }
    *{
        box-sizing: border-box;
    }

    html {
        height: 100%;

    }

    body {
        width: 100%;
        margin: 0;
        padding: 10px;
        font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
        font-size: 16px;
        line-height: 20px;
        color: var(--body-color);
        background: var(--body-bg-color);
    }

    a {
        color: blue;
    }
    p{
        font-size: 16px;
        line-height: 1.5;
    }
    h1, h2, h3, h4, h5, h6 {
        line-height: 1em;
        margin: 10px 0;
    }
    h1{
        text-align: center;
        margin-bottom: 3em;
        font-size: 20px;
    }
    pre, code, kbd {
        background: #eee;
    }

    code, kbd {
        padding: 1px 5px;
    }

    pre {
        padding: 5px;
        overflow-x: auto;
        word-wrap: normal;
    }

    pre .highlight {
        background: var(--pre-text-highlighted-bg-color);
    }

    pre code {
        padding: 0;
    }

    blockquote {
        border-left: 5px solid var(--quote-border-color);
        margin: 1em 0;
        padding-left: 10px;
    }

    hr {
        border: 0;
        border-top: 1px solid var(--hr-border-color);
    }

    table {
        border-collapse: collapse;
        border-spacing: 0;
    }

    table thead {
        border-bottom: 2px solid var(--table-border-color);
    }

    table tbody tr:nth-child(2n) {
        background-color: var(--table-row-even-bg-color);
    }

    table th, table td {
        padding: 6px 13px;
        border: 1px solid var(--table-border-color);
    }

    table th {
        font-weight: bold;
    }

    li p {
        margin: .5em 0;
    }

    #left-column,
    #right-column {
        float: left;
        width: 50%;
        height: 100%;
    }

    .wrapper {
        position: relative;
        padding: 22px 0 20px 10px;
    }

    #left-column .wrapper {
        border-right: 1px solid var(--column-border-color);
    }

    #right-column .wrapper {
        padding-left: 9px;
        border-left: 1px solid var(--column-border-color);
    }

    .topbar,
    .bottom-bar {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
    }

    .bottom-bar {
        top: auto;
        bottom: 0;
        padding-right: 5px;
    }

    .topbar .buttons-container {
        float: right;
        
    }

    .topbar .buttons-container .button,
    .topbar .buttons-container .button-group {
        float: left;
    }

    .topbar .buttons-container .button {
        height: 18px;
        padding: 2px 6px 0;
        line-height: 18px;
        color: var(--top-bar-button-color);
        text-decoration: none;
        font-size: 11px;
        border-bottom: 2px solid transparent;
        background: var(--top-bar-button-bg-color);
    }

    .topbar .buttons-container .button:active {
        background: var(--top-bar-button-active-bg-color);
    }

    .topbar .buttons-container .button.active {
        border-bottom-color: var(--top-bar-button-enabled-border-color);
    }

    .topbar .buttons-container .button-group .button.switch {
        padding-left: 3px;
        padding-right: 3px;
    }

    .topbar .buttons-container .button-group .button.switch:first-child {
        padding-left: 6px;
    }

    .topbar .buttons-container .button-group .button.switch:last-child {
        padding-right: 6px;
    }

    .topbar .buttons-container .button-group .button.switch:after {
        content: "/";
        position: relative;
        right: -4px;
    }

    .topbar .buttons-container .button-group .button.switch:last-child:after {
        content: none;
    }

    .topbar .buttons-container .button.icon-sync-scroll,
    .topbar .buttons-container .button.icon-fullscreen {
        width: 22px;
        padding-left: 0;
        padding-right: 0;
        text-align: center;
    }
        
    .topbar .buttons-container .button.icon-sync-scroll {
        width: 18px;
    }
        
    .topbar .buttons-container .button.icon-sync-scroll:before {
        display: inline-block;
        margin-top: 1px;
    }

    .topbar .buttons-container .button.icon-fullscreen {
        font-size: 16px;
    }

    .topbar .buttons-container .button.icon-settings {
        font-size: 14px;
    }

    .bottom-bar .word-count {
        float: right;
        height: 20px;
        line-height: 20px;
        font-size: 11px;
        color: var(--bottom-bar-word-count-color);
    }

    #preview {
        word-wrap: break-word;
        line-height: normal;
    }

    #markdown,
    #html {
        display: block;
        box-sizing: border-box;
        width: 100%;
        resize: none;
        margin: 0;
        padding: 5px 0 0;
        border: 0;
        -moz-tab-size: 4;
        -o-tab-size: 4;
        tab-size: 4;
        color: var(--textarea-color);
        background-color: transparent;
    }

    #markdown:focus,
    #html:focus {
        outline: none;
    }

    #top_panels_container {
        max-height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }

    #top_panels_container .top_panel {
        display: none;
        position: relative;
        padding: 10px 20px;
        background: var(--top-panel-bg-color);
        border-bottom: 2px solid var(--top-panel-border-color);
    }

    #top_panels_container .top_panel a {
        color: var(--top-panel-link-color);
    }

    #top_panels_container .top_panel .close {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 14px;
        height: 14px;
        line-height: 14px;
        font-size: 14px;
        text-align: center;
        color: var(--top-panel-close-color);
        cursor: pointer;
        border-radius: 7px;
    }

    #top_panels_container .top_panel .close:hover {
        color: var(--top-panel-close-hover-color);
        background: var(--top-panel-close-hover-bg-color);
    }

    .top_panel .button {
        padding: 5px 12px;
        background: var(--top-panel-btn-bg-color);
        border-radius: 3px;
        cursor: pointer;
        text-decoration: none;
    }

    .top_panel .button:active {
        background: var(--top-panel-btn-active-bg-color);
    }

    .top_panel .button.is-disabled {
        background: var(--top-panel-btn-disabled-bg-color);
        opacity: .5;
        cursor: not-allowed;
    }

    #quick-reference table,
    #quick-reference > p {
        font-size: 12px;
        line-height: 1.25em;
    }

    #quick-reference table tr {
        background: transparent;
    }

    #quick-reference table td {
        padding: 1px 0;
        border: 0;
    }

    #quick-reference table td:first-child {
        cursor: pointer;
    }

    #quick-reference table td:last-child {
        padding-left: 20px;
    }

    #quick-reference table td pre,
    #quick-reference table td p {
        margin: 0;
    }

    #quick-reference p {
        margin-bottom: 0;
    }

    #settings #increase-font-size,
    #settings #decrease-font-size {
        position: relative;
        padding: 5px 9px 5px 19px;
        line-height: 16px;
    }

    #settings #increase-font-size:before,
    #settings #decrease-font-size:before {
        content: "A";
        position: absolute;
        top: 5px;
        left: 9px;
        height: 16px;
        line-height: 16px;
        font-family: monospace;
    }

    #settings #decrease-font-size:before {
        font-size: 13px;
    }

    #settings #increase-font-size:before {
        font-size: 17px;
    }

    #settings #decrease-font-size:after {
        content: "-";
    }

    #settings #increase-font-size:after {
        content: "+";
    }

    #settings .theme-control .button {
        margin-left: 10px;
        padding-left: 5px;
        padding-right: 5px;
    }

    #settings .theme-control.theme-control-light {
        display: var(--settings-light-theme-control);
    }

    #settings .theme-control.theme-control-dark {
        display: var(--settings-dark-theme-control);
    }

    #settings label {
        padding-right: 20px;
    }

    .fullscreen #left-column,
    .fullscreen #right-column {
        float: none;
        width: 100%;
    }

    .fullscreen #left-column .wrapper {
        border-right-color: transparent;
    }

    .fullscreen #right-column .wrapper {
        border-left-color: transparent;
    }

    .fullscreen #markdown,
    .fullscreen #html {
        max-width: 800px;
        margin: 0 auto;
    }



    ::-webkit-scrollbar-button {
        width: var(--scrollbar-button-size);
        height: var(--scrollbar-button-size);
        display: var(--scrollbar-button-display);
    }


    ::-webkit-scrollbar-corner {
        background-color: var(--scrollbar-corner-bg-color);
    }


    ::-webkit-scrollbar-track {
        background-color: var(--scrollbar-track-bg-color);
    }

    ::-webkit-scrollbar-track:vertical,
    ::-webkit-scrollbar-thumb:vertical {
        border-left: var(--scrollbar-bar-border);
    }

    ::-webkit-scrollbar-track:horizontal,
    ::-webkit-scrollbar-thumb:horizontal {
        border-top: var(--scrollbar-bar-border);
        border-bottom: var(--scrollbar-bar-border);
    }

    ::-webkit-scrollbar-thumb {
        background-clip: var(--scrollbar-thumb-bg-clip);
    }

    ::-webkit-scrollbar-thumb:vertical {
        min-height: var(--scrollbar-thumb-min-size);
    }

    ::-webkit-scrollbar-thumb:horizontal {
        min-width: var(--scrollbar-thumb-min-size);
    }

    ::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-thumb-bg-color);
    }


    ::-webkit-scrollbar-thumb:hover {
        background-color: var(--scrollbar-thumb-hover-bg-color);
    }


    ::-webkit-scrollbar-thumb:active {
        background-color: var(--scrollbar-thumb-active-bg-color);
    }
</style>

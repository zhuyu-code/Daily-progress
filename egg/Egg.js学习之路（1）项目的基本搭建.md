### 1.Egg.js和Express,sails,Koa.js对比

[Express](http://expressjs.com/) 是 Node.js 社区广泛使用的框架，简单且扩展性强，非常适合做个人项目。但框架本身缺少约定，标准的 MVC 模型会有各种千奇百怪的写法。Egg 按照约定进行开发，奉行『约定优于配置』，团队协作成本低。

[Sails](http://sailsjs.com/) 是和 Egg 一样奉行『约定优于配置』的框架，扩展性也非常好。但是相比 Egg，[Sails](http://sailsjs.com/) 支持 Blueprint REST API、[WaterLine](https://github.com/balderdashy/waterline) 这样可扩展的 ORM、前端集成、WebSocket 等，但这些功能都是由 [Sails](http://sailsjs.com/) 提供的。而 Egg 不直接提供功能，只是集成各种功能插件，比如实现 egg-blueprint，egg-waterline 等这样的插件，再使用 sails-egg 框架整合这些插件就可以替代 [Sails](http://sailsjs.com/) 了。

**Koa** 和 Express 的设计风格非常类似，底层也都是共用的[同一套 HTTP 基础库](https://github.com/jshttp)，但是有几个显著的区别，除了上面提到的默认异步解决方案之外，主要的特点还有下面几个。

（1） Express 只有 Request 和 Response 两个对象不同，Koa 增加了一个 Context 的对象，作为这次请求的上下文对象（在 Koa 1 中为中间件的 `this`，在 Koa 2 中作为中间件的第一个参数传入）。我们可以将一次请求相关的上下文都挂载到这个对象上。类似 [traceId](https://github.com/eggjs/egg-tracer/blob/1.0.0/lib/tracer.js#L12) 这种需要贯穿整个请求（在后续任何一个地方进行其他调用都需要用到）的属性就可以挂载上去。相较于 request 和 response 而言更加符合语义。

（2）Koa 的中间件和 Express 不同，Koa 选择了洋葱圈模型。所有的请求经过一个中间件的时候都会执行两次，对比 Express 形式的中间件，Koa 的模型可以非常方便的实现后置处理逻辑，对比 Koa 和 Express 的 Compress 中间件就可以明显的感受到 Koa 中间件模型的优势。

（3）通过同步方式编写异步代码带来的另外一个非常大的好处就是异常处理非常自然，使用 `try catch` 就可以将按照规范编写的代码中的所有错误都捕获到。这样我们可以很便捷的编写一个自定义的错误处理中间件。

而 **Egg** 选择了 Koa 作为其基础框架，在它的模型基础上，进一步对它进行了一些增强。总结来说具有以下特点。

- 提供基于 Egg [定制上层框架](https://eggjs.org/zh-cn/advanced/framework.html)的能力
- 高度可扩展的[插件机制](https://eggjs.org/zh-cn/basics/plugin.html)
- 内置[多进程管理](https://eggjs.org/zh-cn/advanced/cluster-client.html)
- 基于 [Koa](http://koajs.com/) 开发，性能优异
- 框架稳定，测试覆盖率高
- [渐进式开发](https://eggjs.org/zh-cn/tutorials/progressive.html)

### 2.Egg.js的项目搭建（借助官方egg脚手架）

初始化项目

```javascript
$ mkdir egg-example && cd egg-example
$ npm init egg --type=simple
$ npm i
```

启动项目

```
$ npm run dev
$ open http://localhost:7001
```

脚手架主要是安装了`egg`,`egg-bin`两个重要包，然后手动搭建controller，service层。官方脚手架提供了标准的脚手架目录结构，有兴趣的参考官网搭建。网络卡顿的可以安装nrm切换npm镜像源。后期我会做一期搭建私有npm源

```
npm i nrm -g
##查看镜像源
nrm ls
##使用指定的镜像源比如yarn
nrm use yarn
##切换后始终使用npm i xx包，nrm会自动帮助切换
npm i xxx
```

访问本机7001端口会看到hi egg

#### 3.目录讲解

动手改造目录结构（注意egg是配置了目录名的，也就是通过扫描controller下面的文件作为controller，不用手动注册，所以文件名严格按照规范，后期学习的nest.js就需要手动注册，但可以封装成egg这样）

app层--->controller（用户处理restful api的各种接口，功能处理调用service）

app层--->service(用于处理更加繁琐，比如数据库增删查改的方法等等)

app层--->routes(用于路由和controller方法的匹配，比如/user/read对应usercontroller的read方法，这个时候需要对应)

app层--->public(放置一些静态资源)

app层--->middleware(中间件都写这下面)

app层--->extend(延展context的方法和工具类都可以在里面写)

app层--->exception(继承并重写默认的异常处理码)

config--->config.default.js(用于配置安装的插件的一些参数，比如数据库的密码等等，jwt的密码等等)

config--->config.prod.js(内容和config.default.js一样，但是可以分别修改上线的一些参数等等，将测试环境和线上的数据库分开等等)

config--->plugin.js（npm安装的插件，都必须要在这里打开）

#### 4.简单接口编写

首先配置路由

/user/read------>controller的某个方法

```
  router.get("/user/read", controller.user.read);
```

controller

```
"use strict";

const Controller = require("egg").Controller;

class HomeController extends Controller {
  async read() {
    const { ctx } = this;
    const data = await this.service.user.findUser();
    ctx.body = data;
  }
}

module.exports = HomeController;

```

service

```
const Service = require("egg").Service;
class HomeService extends Service {
  async findUser() {
    return "indexService";
  }
}

module.exports = HomeService;

```

##### 5.配置跨域插件

前端使用axios访问接口的时候会出现跨域的情况，按照egg-cors插件

```
npm i egg-cors --save
```

在plugin.js开启插件

```
// 配置跨域插件
exports.cors = {
  enable: true,
  package: 'egg-cors',
};
```

在config.default.js配置跨域允许的白名单

```
  // 配置csrf的跨域攻击
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ '*' ],
  };

```

源码在https://github.com/zhuyu-code/egg-example的main分支上
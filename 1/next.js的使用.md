## 服务端渲染

**1. 什么叫服务端渲染？**

简单理解是将组件或页面通过服务器生成html字符串，再发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序

没有使用服务端渲染的情况下，后端返回的数据为空，之后执行js将html结构注入到body里，结合css显示出来。

使用了服务端渲染的情况下，后端返回的数据为首屏html结构，之后再结合css显示出来

**2.服务端渲染的优势**

* 更利于SEO

因为客户端的页面React等等MVVM框架，大部分都是js动态生成的DOM，爬虫是不会等待DOM元素的，所以服务端渲染有利于SEO。

* 更利于首屏渲染

对于大型单页应用，如果使用SSR，直接使用后端传过来的html文件，不再依赖js文件,毕竟大型单页应用首次加载的文件过大，造成的首屏加载的问题

**3.服务端渲染的缺点**

* 服务端压力过大

全由服务端处理，占用大量的CPU的资源

* 开发条件受限

在服务端渲染中，只会执行到componentDidMount之前的生命周期钩子，因此项目引用的第三方的库也不可用其它生命周期钩子，这对引用库的选择产生了很大的限制；

* 需要配置成本较高

Webpack,React，node都能掌握

**4. 渲染流程**

服务端渲染是先向后端服务器请求数据，然后生成完整首屏html返回给浏览器；而客户端渲染是等js代码下载、加载、解析完成后再请求数据渲染，等待的过程页面是什么都没有的，就是用户看到的白屏。就是服务端渲染不需要等待js代码下载完成并请求数据，就可以返回一个已有完整数据的首屏页面。

## Next.js

**1. 什么是next.js?**

​		Next.js 是一个轻量级的 React 服务端渲染应用框架。有了它我们可以简单轻松的实现React的服务端渲染，从而加快首屏打开速度，也可以作SEO（收索引擎优化了）。在没有Next.js的时候，用React开发需要配置很多繁琐的参数，如Webpack配置，Router配置和服务器端配置等....。如果需要作SEO，要考虑的事情就更多了，怎么样服务端渲染和客户端渲染保持一致就是一件非常麻烦的事情，需要引入很多第三方库。但有了Next.js，这些问题都解决了，使开发人员可以将精力放在业务逻辑上，从繁琐的配置中解放出来。

**2.手动创建next.js项目**

```shell
npm install react react-dom next
```

注意项目名不要和npm包名一样，不然会出现refuse安装npm包的问题

更改scripts

```json
   	"dev" : "next" ,
    "build" : " next build",
    "start" : "next start"
```

新建pages文件夹，这个文件夹是路由文件夹，里面的文件名就是路由名字，组件写在components文件夹里面

Index.js

```javascript
function Index(){
	return (
		<div>
			Hello World
		</div>
	)
}
export default Index;
```

**3.使用create-next-app创建项目**

```shell
npm install -g create-next-app
```

```shell
create-next-app nextDemo
```

项目结构介绍

- components文件夹:这里是专门放置自己写的组件的，这里的组件不包括页面，指公用的或者有专门用途的组件。
- node_modules文件夹：Next项目的所有依赖包都在这里，一般我们不会修改和编辑这里的内容。
- pages文件夹：这里是放置页面的，这里边的内容会自动生成路由，并在服务器端渲染，渲染好后进行数据同步。
- static文件夹： 这个是静态文件夹，比如项目需要的图片、图标和静态资源都可以放到这里。
- .gitignore文件： 这个主要是控制git提交和上传文件的，简称就是忽略提交。
- package.json文件：定义了项目所需要的文件和项目的配置信息（名称、版本和许可证），最主要的是使用`npm install` 就可以下载项目所需要的所有包。

**4.路由**

next.js没有使用react-router-dom等等，使用的是next.js仅需改变next/link

1. 使用Link标签

```js
import Link from 'next/link'
```

2. Router模块

```js
import Router from 'next/router'
```

```javascript
Router.push('/history')
```

3. 传参数

在Link传参数的时候，可以采用?name="xxx"的形式，也可以采用对象的形式

4. 接收参数

```js
router.query
```

**5.CSS样式**

1. 使用style jsx

2. 使用`@zeit/next-css`让next.js可以支持CSS


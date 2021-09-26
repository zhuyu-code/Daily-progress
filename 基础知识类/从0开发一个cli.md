#### npm link

npm init一个初始化仓库，新建一个文件bin/index.js,并且指定全局的node

```
#!/usr/bin/env node

console.log("hi yuanfang-cli")
```

配置package.json的bin命令

```
 "bin": {
    "yuanfang": "bin/index.js"
  },
```

发布脚手架

方式1：软链接

在自己开发的脚手架里`npm link`，就可以软链到全局的npm包里，使用`npm unlink`解除软链

![image-20210903153432297](C:\Users\86180\AppData\Roaming\Typora\typora-user-images\image-20210903153432297.png)

方式2：通过`npm login`发布，再通过`npm i -g`全局安装使用

本地npm link包奇用

A包要引入B包,B包在开发

那么首先B包npm link

然后A包 npm link B

解除都使用npm unlink

#### lerna多包管理

lerna优点

1.减少重复操作

2.标准化操作

lerna init

lerna create

lerna add (不加option，给所有的包)

lena add axios packages/core/（给指定的包添加依赖）

lerna link(实现多包内互相依赖)

```
在包内一个文件书写dependencies内部包，他会自动link到指定文件
```

lerna bootstrap重装依赖

lerna exec（在所有的package.json下面去执行命令，命令目录在各个包的目录）

```
lerna exec -- (命令)
lerna exec -- rm -rf node_modules
//指定具体包
lerna exec --scope target-component -- rm -rf node_modules
```

lerna run(执行包内的script命令)

```
npm run dev
npm run --scope target-component dev
```

lerna changed(查看多少个包有变更)

lerna version(查看版本变更)

lerna diff(查看上次commit和目前的区别)

![image-20210905103548205](C:\Users\86180\AppData\Roaming\Typora\typora-user-images\image-20210905103548205.png)

lerna publish

一共会有4步操作

1.需要和git远程仓库关联并且推送

2.需要和npm仓库关联

3.需要配置public官网

```
  "publishConfig": {
    "access": "public"
  }
```

#### 开始开发

新建四个文件目录，commands,core,models,utils

.js=>module.exports

.json=>JSON.parse()

any=>JS引擎

细节点：

1.优先使用全局的脚手架import-local

```
#! /usr/bin/env node

const importLocal=require("import-local");

if(importLocal(__filename)){
    require("npmlog").info("cli","正在使用本地版本")
}else{
    console.log("文件名",process.argv);
    require('../lib/core')(process.argv.slice(2))
}
```

2.检查版本号（防止node版本号低的node的版本）

semver,colors

3.检查root账户降级


## nrm

**作用**：

开发的npm registry 管理工具 [nrm](https://github.com/Pana/nrm), 能够查看和切换当前使用的registry。

顾名思义，就是说nrm是一个管理npm的工具。

**安装**：

```
$ npm install -g nrm
```

基本命令

```
$ nrm ls　　// 查看所有的支持源（有*号的表示当前所使用的源,以下[name]表示源的名称）

$ nrm use [name]　　// 将npm下载源切换成指定的源

$ nrm add        // 使用 add 添加仓库

$ nrm del        // 使用 del 可以删除仓库

$ nrm help　　// 查看nrm帮助

$ nrm home [name]　　// 跳转到指定源的官网

如果在你的网络不太理想或者在不能FQ的情况下，又或者收到其他网络限制导致不能使用npm原本的源进行下载时nrm就非常有用了，你只需要

　　$ nrm ls

　　$ nrm use [name]

```



## nvm

**作用：**

在本地变更node的版本

**安装：**

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
```

配置环境变量(直接复制在终端即可)

```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

**使用：**

 ```
nvm ls-remote：列出所有可以安装的node版本号
nvm install v10.4.0：安装指定版本号的node
nvm use v10.3.0：切换node的版本，这个是全局的
nvm current：当前node版本
nvm ls：列出所有已经安装的node版本
nvm alias default v4.2.4 设置默认版本
 ```

## npm

作用：本地包管理工具

## yarn

npm和yarn命令对比

|             yarn              |                  npm                  | 命令功能                                |
| :---------------------------: | :-----------------------------------: | :-------------------------------------- |
|         yarn install          |              npm install              | **根据`pack.json`安装项目所需的依赖包** |
|      yarn install --flat      |                  --                   | **注释1**                               |
|  yarn install --no-lockfile   |     npm install --no-package-lock     | **不读取或生成`yarn.lock`锁文件**       |
| yarn install --pure-lockfile  |                  --                   | **不要生成`yarn.lock`锁文件**           |
|      yarn add [package]       |         npm install [package]         | **安装需要的依赖包**                    |
|   yarn add [package] --dev    |   npm install [package] --save-dev    | **注释2**                               |
|    yarn add [package] --D     |   npm install [package] --save-dev    | **同上**                                |
|   yarn add [package] --peer   |                  --                   | **注释3**                               |
|    yarn add [package] --P     |                  --                   | **同上**                                |
| yarn add [package] --optional | npm install [package] --save-optional | **注释4**                               |
|    yarn add [package] --O     | npm install [package] --save-optional | **同上**                                |
|  yarn add [package] --exact   |  npm install [package] --save-exact   | **注释5**                               |
|    yarn add [package] --E     |  npm install [package] --save-exact   | **同上**                                |
|   yarn global add [package]   |    npm install [package] --global     | **全局安装依赖包**                      |
|      yarn global upgrade      |          npm update --global          | **全局更新依赖包**                      |
|       yarn add --force        |              npm rebuild              | **更改包内容后进行重建**                |
|     yarn remove [package]     |        npm uninstall [package]        | **卸载已经安装的依赖包**                |
|  yarn cache clean [package]   |            npm cache clean            | **注释6**                               |
|         yarn upgrade          |  rm -rf node_modules && npm install   | **更新依赖包**                          |
|     yarn version --major      |           npm version major           | **更新依赖包的版本**                    |
|     yarn version --minor      |           npm version minor           | **更新依赖包的版本**                    |
|     yarn version --patch      |           npm version patch           | **更新依赖包的版本**                    |

## 参考资料

* [nvm官网](https://github.com/nvm-sh/nvm)

* [nrm官网](https://github.com/Pana/nrm)
* [yarn官网](https://github.com/yarnpkg/yarn)
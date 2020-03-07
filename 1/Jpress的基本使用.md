## Jpress安装流程

Jpress作用：用于模板快速切换，模板在线安装，卸载，插件在线安装，卸载，用户，角色权限管理

jpress 官方文档 http://www.jpress.io/article/36

## 方式一：本地编译

1. 克隆项目到本地
2. 在项目的根目录下使用 mvn 构建项目 （自己找mvn安装及环境配置）

1. 只运行 mvn compile 是无法生成文档中说的 starter-2.0 的目录

需要运行命令 mvn package 才会生成可运行的文件目录（路径为/starter/target/starter-2.0） 

![img](https://img-blog.csdnimg.cn/20190613194627559.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

在生成的目录下有可执行文件 jpress.sh，在运行脚本前需要先创建数据库

1. 创建数据库

1. 创建MySQL 数据库![img](https://img-blog.csdnimg.cn/2019061319472498.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)
2. 数据库创建好后不需要再操作什么，回到starter-2.0目录，执行 jpress.sh 脚本。需要注意的是，文档中的启动Jpress的命令是

jpress.sh start

实际上在Mac上正确的执行命令是

// 需要使用chmod 添加权限

.jpress.sh start

\# 或

sh jpress.sh start

1. 启动项目

执行脚本运行起来后，在浏览器地址栏输入localhost:8080 ，第一次会进入项目向导页





1. 数据库名就是上一步创建的数据库
2. 用户名和密码就是访问数据库的
3. 然后就是设置后台管理系统的用户名和密码



1. 登录后台管理系统localhost:8080/admin/login

1. 前端开发

1. 官方提供了四个免费的初始化模版（路径/jpress-template/src/webapp/templates），克隆其中任一一个模版，进行修改



1. 修改后通过后台管理系统的安装新模版，然后启用模版





***\*PS:\**** ***\*上传代码必须将代码压缩成zip格式\****



启动 JPress 执行如下命令：

sh jpress.sh start

停止

sh jpress.sh stop

重启

sh jpress.sh restart

## ***\**\*方式二：Docker\*\**\* \**\*\*安装运行\*\**\***

本地需要安装docker，然后这种方式非常简单，也是官方推荐的。

1. 官方文档中给的链接可能失效，但是只要从仓库中找到 docker-compose.yml 文件，复制到本地。（本地最好放在单独的一个文件夹下，因为运行后会下载一些文件）
2. 数据库配置。通过docker 命令安装启动后，会默认配置好MySQL数据库，并且在首次登陆的时候，向导页会自动填充数据库信息，不要做修改，点下一步就行。
3. 第一次构建命令

docker-compose up -d



之后使用下面命令就可以启动

docker-compose start



***\**\*其他\*\**\***

1. Docker 必须要登录，不然拉取相应的镜像会报错



停止：docker-compose stop

重启：docker-compose restart

卸载：docker-compose down



在使用maven运行本地编译的方式遇到的错误

在全局编译jpress文件时，首先下载maven bindiry.zip文件，解压就行不需要安装，然后配置一下本地仓库，不然内容都会下载到c盘中，在setttings.xml文件中更改本地仓库指向就行。

然后配置全局环境变量，再然后使用mvn -v看是否具有版本指定，具有版本等信息，那么安装配置成功

使用mvn compile编译文件，mvn package打包文件会生成一个target文件，并且打包面向的是一个具有规则的文件夹，src/main等等这样，然后面向的pom.xml文件编译的内容。

错误1：

执行这两个命令遇到的报错

```html
 No compiler is provided in this environment. Perhaps you are running on a JRE rather than a JDK?
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

解决：意思是他要jdk而不是jre，默认找到的是jre，让你更改一下试试。首先将环境变量配置一下使用Java_HOME 这种分开的环境变量格式。然后在maven的执行bin文件夹目录下，mvn.cmd问价里面加入一句set JAVA_HOME=C:\Program Files\Java\jdk1.8.0_181，然后就可以优先找到jdk环境了。

要使用jpress，可以使用docker虚拟服务器环境遇到的难点

docker在windows上面安装有两种方式遇到的知识错误

1.在windows7,8，windows 10 家庭版使用tbox

2.在windows10专业版里面配置H-pyter虚拟设置允许就行

错误一：由于运行环境没在目标文件夹下

![img](https://img-blog.csdnimg.cn/20190612220234317.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

错误二：没有连接到网络

![img](https://img-blog.csdnimg.cn/20190612220254243.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

错误三：磁盘没有共享，在右下角docker图标右键选择settings配置，然后配置勾选磁盘就行![img](https://img-blog.csdnimg.cn/20190612220317583.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MTI1NDQ1,size_16,color_FFFFFF,t_70)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

错误4：没有找到compose.yml,他是面向这个文件进行docker构建的。![img](https://img-blog.csdnimg.cn/20190612220148321.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)
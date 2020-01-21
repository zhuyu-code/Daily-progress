#### 书写markdown好用工具

Typera书写语法比较好看，粘贴的图片也可以直接复制，自己改下保存路径就好，windows和mac都支持，(还有就是解决垃圾markdown换行，总是忘记多打一个enter)

#### 生成github目录

按照markdown书法写或是使用Typora写目录，在github上面都会变成TOC神坑，使用git-md-toc程序帮助转义

安装：

```
Linux
$ wget https://raw.githubusercontent.com/ekalinin/github-markdown-toc/master/gh-md-toc
$ chmod a+x gh-md-toc

OSX
$ curl https://raw.githubusercontent.com/ekalinin/github-markdown-toc/master/gh-md-toc -o gh-md-toc
$ chmod a+x gh-md-toc

```

使用：

```
./gh-md-toc /Users/laixiaoxing/Documents/concurrent_learn/README.md
```

然后终端就会出现目录，粘贴到md文件就好。
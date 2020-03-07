# gulp自动化工具

## 入门

Gulp和Webpack的基本区别：

gulp可以进行js，html，css，img的压缩打包，是自动化构建工具，可以将多个js文件或是css压缩成一个文件，并且可以压缩为一行，以此来减少文件体积，加快请求速度和减少请求次数；并且gulp有task定义处理事务，从而构建整体流程，它是基于流的自动化构建工具。

Webpack是前端构建工具，实现了模块化开发和文件处理。他的思想就是“万物皆为模块”，它能够将各个模块进行按需加载，不会导致加载了无用或冗余的代码。所以他还有个名字叫前端模块化打包工具。

在实际当中会将两种都选择混合使用。虽然两个都可以进行代码的压缩合并减少代码体积，但gulp.config.js中gulp的代码更加简单易懂，需要压缩合并谁就用哪个方法，而webpack样式合并需要在node环境下下载插件才能使用。另一点，gulp 是基于流的打包工具，需要谁，引用谁，并且他的压缩简单明了，后期维护起来方便，webpack则可以将具体的模块进行划分，需要哪个模块就加载哪个模块，实现按需加载，并且排除掉冗余代码，减少代码体积。

总结起来就是，gulp是基于流的自动化构建工具，但不包括模块化的功能，如果要用到的话，就需要引入外部文件，比如require.js等；而webpack是自动化模块打包工具，本身就具有模块化，并且也具有压缩合并的功能。二者侧重点不同，我认为相互结合使用会提高代码质量和代码的优化。

## 安装

![image](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9taW5pby5jaG9lcm9kb24uY29tLmNuL2tub3dsZWRnZWJhc2Utc2VydmljZS9maWxlXzFhZWU2YzlhNzFmYjRlNTY5NjM5YTg5NTUzM2Y5ZTRhX2Jsb2IucG5n)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

## 打包压缩多个JS

需要三个插件
gulp-concat（合并多个js文件或者css文件）
gulp-uglify（压缩js）
gulp-rename（重命名文件）

```
var gulp = require('gulp');
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
gulp.task("js", function () {
  return gulp.src("src/js/*.js")//输入路径
    .pipe(concat("build.js"))//合并js
    .pipe(gulp.dest("dist/js"))//输出路径
    .pipe(uglify())//压缩js
    .pipe(rename("build.min.js"))//重命名
    .pipe(gulp.dest("dist/js"))//输出路径
})
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

## 编译less,合并css,压缩css

gulp-less编译less成css。
gulp-clean-css压缩css文件

```
var gulp = require("gulp");
var concat = require("gulp-concat");
var rename = require("gulp-rename")
var less = require("gulp-less");
var cleanCss = require("gulp-clean-css")
gulp.task("lessn", function () {
    return gulp.src("src/less/*.less")
        .pipe(less())
        .pipe(gulp.dest("src/css"))
})

gulp.task("css", function () {
    return gulp.src("src/css/*.css")
        .pipe(concat("build.css"))
        .pipe(gulp.dest("src/css"))
        .pipe(rename("build.min.css"))
        .pipe(cleanCss({
            compatibility: "ie8"
        }))
        .pipe(gulp.dest("src/css"))
})
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

## gulp多任务执行

gulp3中采用task第三个参数传递之前的任务顺序，但是gulp4中采用的gulp.series(同步),gulp.parallel（异步）
参考文档：[gulp3和gulp4多任务同步异步的区别使用](https://www.jianshu.com/p/b2dd8df71d3e?utm_campaign)

## gulp打包HTML文件

使用插件gulp-htmlmin

```
gulp.task("html", function () {
    return gulp.src("index.html")
        .pipe(htmlMin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest("dist"))
})
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

## gulp半自动编译

由于4.0版本的对gulp-liveload插件好像不太支持，就版本回退来进行自动编译

```
gulp.task("watch", ["default"], function () {
    // livereload.listen();//开始监听
    //监听目标和响应的执行任务
    gulp.watch("src/js/*.js", ["js"]);
    gulp.watch(["src/css/*.css", "src/less/*.less"], ["css"])
})
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

然后在监听目标任务进行一个管道操作，并且管道操作内容就行实时刷新

```
 .pipe(livereload())
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

然后直接运行gulp watch就行了
这时候就可以修改监听目标的内容，保存后，在页面进行手动刷新，就会有效果

## 全自动编译

由于4.0版本不太支持gulp-connect插件，那么就使用回退版本3.9.1

```
gulp.task("server", ["default"], function () {
    //配置gulp-connect的内部服务器
    connect.server({
        root: "dist/", //根目录
        livereload: true,
        port: 5000
    })
    open("http://localhost:5000")
    //监听任务变化
    gulp.watch("src/js/*.js", ["js"]);
    gulp.watch("src/css/*.css", ["css"])
})
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

再在监听的每个目标上面进行实时监听的操作。

```
  .pipe(connect.reload())
})
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

这样已经可以实现修改自动刷新，但是要想实现运行server任务后自动打开窗口，安装一个open插件然后在servertask任务里面使用就行

```
 open("http://localhost:5000")
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

 
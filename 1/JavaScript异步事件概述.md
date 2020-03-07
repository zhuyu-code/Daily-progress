## JavaScript异步事件概述

js是单线程的，所以执行任务采用同步，异步的方式进行，执行过程是如下。

![img](https://img-blog.csdnimg.cn/2019071112420849.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MTI1NDQ1,size_16,color_FFFFFF,t_70)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

也就是同步任务全部执行完成，再执行异步任务。

异步任务里面又分为宏任务和微任务。

执行顺序如下图

![img](https://img-blog.csdnimg.cn/20190711124835996.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MTI1NDQ1,size_16,color_FFFFFF,t_70)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

也就是宏任务多次执行，微任务一次执行。宏任务先执行一个，微任务全部执行，再执行剩余的宏任务

宏任务中执行优先级

![img](https://img-blog.csdnimg.cn/20190711125826841.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

微任务中优先级

![img](https://img-blog.csdnimg.cn/20190711125114405.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

再次总结就是主任务执行后，执行微任务，再执行setTimeout,setInterval,setImmediate

setTimeout(func(){},0),意思是同步任务执行完成后，主线程栈空后，然后再执行，但是主线程一直为空，由于机制问题，还是最小为4ms。

代码示例1：

```
console.log("宏任务优先级最高执行")
     setTimeout(() => {
          console.log("settimeout")
      }, 10);
      setImmediate(()=>{
          console.log("setTmmediate")
      })
      let promise=new Promise((resolve,reject)=>{
          console.log("promise中1执行");
          resolve()
      })
      promise.then(()=>{
          console.log("promise中2执行")
      })
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

![img](https://img-blog.csdnimg.cn/20190711132525274.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)
## JS最初是采用引用计数法

引用计数的含义是跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型值赋给该变量时，则这个值的引用次数就是1。如果同一个值又被赋给另一个变量，则该值的引用次数加1。相反，如果包含对这个值引用的变量又取得了另外一个值，则这个值的引用次数减1。当这个值的引用次数变成0时，则说明没有办法再访问这个值了，因而就可以将其占用的内存空间回收回来。这样，当垃圾回收器下次再运行时，它就会释放那些引用次数为0的值所占用的内存。

缺点：缺点就是无法解决循环引用的问题

## JS采用标记清除法

js中最常用的垃圾回收方式就是标记清除。当变量进入环境时，例如，在函数中声明一个变量，就将这个变量标记为“进入环境”。从逻辑上讲，永远不能释放进入环境的变量所占用的内存，因为只要执行流进入相应的环境，就可能会用到它们。而当变量离开环境时，则将其标记为“离开环境”。通俗来说，就是使用一个函数包裹全局变量，然后执行这个函数不需要的函数变量就无效了，因此像闭包这种引入外部变量被清除了，然后闭包被清除。

JS的V8引擎又做了优化

1.分代回收

2.增量回收

3.空闲时间收集

### 1.分代回收

理解分代回收，先就要理解V8引擎将堆内存怎么分割的，一共分成了6个部分

1.新生区：刚开始的对象都是分配在这里，用于存储操作频繁的对象

2.老生指针区：用于存储老生区的指针对象

3.老生数据区：用于存储老生区数据。

4.大对象区：用于存储大对象

5.代码区：存储代码

6.cell区：存储Map等

然后理解新生代算法和老生代算法

### 新生代算法

scavenge算法

在新生代空间中，内存空间分为两部分，分别为 From 空间和 To 空间。在这两个空间中，必定有一个空间是使用的，另一个空间是空闲的。新分配的对象会被放入 From 空间中，当 From 空间被占满时，新生代 GC 就会启动了。算法会检查 From 空间中存活的对象并复制到 To 空间中，如果有失活的对象就会销毁。当复制完成后将 From 空间和 To 空间互换，这样 GC 就结束了。

### 老生代算法

标记清除法和标记压缩算法

在这个阶段中，会遍历堆中所有的对象，然后标记活的对象，在标记完成后，销毁所有没有被标记的对象。在标记大型对内存时，可能需要几百毫秒才能完成一次标记。这就会导致一些性能上的问题。为了解决这个问题，2011 年，V8 从 stop-the-world 标记切换到增量标志。在增量标记期间，GC 将标记工作分解为更小的模块，可以让 JS 应用逻辑在模块间隙执行一会，从而不至于让应用出现停顿情况。但在 2018 年，GC 技术又有了一个重大突破，这项技术名为并发标记。该技术可以让 GC 扫描和标记对象时，同时允许 JS 运行。

CPU空闲清除对象后会造成堆内存出现碎片的情况，当碎片超过一定限制后会启动压缩算法。在压缩过程中，将活的对象像一端移动，直到所有对象都移动完成，然后CPU空闲时清理掉不需要的内存。
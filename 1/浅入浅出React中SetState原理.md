#  浅入浅出React中SetState原理

## setState批量更新

在react代码中，对于setState我们都会发现多次操纵setState的情况下，setState不会触发多次渲染，里面的state值也不是实时更新的。

例子：

对于一个简单的button点击事件。

```javascript
  render(){
    return (
      <button onClick={this.handleclick.bind(this)}>我这里是APP组件</button>
    )
  }
  handleclick(){
    console.log(this.state.count);
    this.setState({count:this.state.count+1});
    console.log(this.state.count);
    this.setState({state:this.state.count+2});
    console.log(this.state.count);
  }
```

结果是 0 0 0，证明了react中的setState是批量更新的套路，拿到的state值都是不准确的。下面我们来试着看看原理。关于handleclick函数，其实是被类似下面这封装的。

```js
isUpdate = true
try {
  handleClick()
} finally {
  isUpdate = false
  // 然后去更新
}
```

在handleclik内部执行这个setState函数的时候，会将多个setState丢进一个类似队列的形式后续使用。在第一个setState执行的时候，会触发一系列组件更新流程，但是当遇到批量下一个setState的时候，就会停止更新，直到队列里没有发现新增的setState内容。

既然说setState是异步批量更新的，那么有没有办法可以使同步更新。官方提供了一个setState第二个参数使用回调函数，可以起到同步的作用

```js
handleclick(){
    console.log(this.state.count);
    this.setState(state=>state.count+2,()=>{
      console.log("回调函数里面1");
      this.state.count=this.state.count+1
      console.log(this.state.count);
    });
    console.log(this.state.count);
    this.setState({state:this.state.count+3},()=>{
      console.log("回调函数里面2");
      this.state.count=this.state.count+1
      console.log(this.state.count);
    });
    console.log(this.state.count);
  }
```

结果打印的是：0 0 0 1 2，也就是能够在回调函数做同步的事情，前面的回调函数更新了state,后面的state会在此基础上进行更新操作。

## setState参数问题

对于react官网更新计数器的例子，要调用父组件的内容

错误例子，因为setState不接受对象，是接受一个函数

```
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

```
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

## Fiber的引入

在了解 Fiber 之前，我们先来了解下为什么 React 官方要费那么大劲去重构 React。

在 React 15 版本的时候，我们如果有组件需要更新的话，那么就会递归向下遍历整个虚拟 DOM 树来判断需要更新的地方。这种递归的方式弊端在于无法中断，必须更新完所有组件才会停止。这样的弊端会造成如果我们需要更新一些庞大的组件，那么在更新的过程中可能就会长时间阻塞主线程，从而造成用户的交互、动画的更新等等都不能及时响应。

React 的组件更新过程简而言之就是在持续调用函数的一个过程，这样的一个过程会形成一个虚拟的调用栈。假如我们控制这个调用栈的执行，把整个更新任务拆解开来，尽可能地将更新任务放到浏览器空闲的时候去执行，那么就能解决以上的问题。

那么现在是时候介绍 Fiber 了。Fiber 重新实现了 React 的核心算法，带来了杀手锏增量更新功能。它有能力将整个更新任务拆分为一个个小的任务，并且能控制这些任务的执行。

这些功能主要是通过两个核心的技术来实现的：

- 新的数据结构 fiber
- 调度器

### 新的数据结构fiber

在前文中我们说到了需要拆分更新任务，那么如何把控这个拆分的颗粒度呢？答案是 fiber。

我们可以把每个 fiber 认为是一个工作单元，执行更新任务的整个流程（不包括渲染）就是在反复寻找工作单元并运行它们，这样的方式就实现了拆分任务的功能。

拆分成工作单元的目的就是为了让我们能控制 stack frame（调用栈中的内容），可以随时随地去执行它们。由此使得我们在每运行一个工作单元后都可以按情况继续执行或者中断工作（中断的决定权在于调度算法）。

那么 fiber 这个数据结构到底长什么样呢？现在就让我们来一窥究竟。

fiber 内部其实存储了很多上下文信息，我们可以把它认为是改进版的虚拟 DOM，它同样也对应了组件实例及 DOM 元素。同时 fiber 也会组成 fiber tree，但是它的结构不再是一个树形，而是一个链表的结构。

![img](https://user-gold-cdn.xitu.io/2019/7/21/16c14ea212e58566?w=345&h=392&f=png&s=52125)

以下是 fiber 中的一些重要属性：

```js
{
  ...
  // 浏览器环境下指 DOM 节点
  stateNode: any,

  // 形成列表结构
  return: Fiber | null,
  child: Fiber | null,
  sibling: Fiber | null,

  // 更新相关
  pendingProps: any,  // 新的 props
  memoizedProps: any,  // 旧的 props
  // 存储 setState 中的第一个参数
  updateQueue: UpdateQueue<any> | null,
  memoizedState: any, // 旧的 state

  // 调度相关
  expirationTime: ExpirationTime,  // 任务过期时间

  // 大部分情况下每个 fiber 都有一个替身 fiber
  // 在更新过程中，所有的操作都会在替身上完成，当渲染完成后，
  // 替身会代替本身
  alternate: Fiber | null,

  // 先简单认为是更新 DOM 相关的内容
  effectTag: SideEffectTag, // 指这个节点需要进行的 DOM 操作
  // 以下三个属性也会形成一个链表
  nextEffect: Fiber | null, // 下一个需要进行 DOM 操作的节点
  firstEffect: Fiber | null, // 第一个需要进行 DOM 操作的节点
  lastEffect: Fiber | null, // 最后一个需要进行 DOM 操作的节点，同时也可用于恢复任务
  ....
}
```

总的来说，我们可以认为 fiber 就是一个工作单元的数据结构表现，当然它同样也是调用栈中的一个重要组成部分。

```text
Fiber 和 fiber 不是同一个概念。前者代表新的调和器，后者代表 fiber node，也可以认为是改进后的虚拟 DOM。
```

## 调度器简介

每次有新的更新任务发生的时候，调度器都会按照策略给这些任务分配一个优先级。比如说动画的更新优先级会高点，离屏元素的更新优先级会低点。

通过这个优先级我们可以获取一个该更新任务必须执行的截止时间，优先级越高那么截止时间就越近，反之亦然。这个截止时间是用来判断该任务是否已经过期，如果过期的话就会马上执行该任务。

然后调度器通过实现 `requestIdleCallback` 函数来做到在浏览器空闲的时候去执行这些更新任务。

这其中的实现原理略微复杂。简单来说，就是通过定时器的方式，来获取每一帧的结束时间。得到每一帧的结束时间以后我们就能判断当下距离结束时间的一个差值。

如果还未到结束时间，那么也就意味着我可以继续执行更新任务；如果已经过了结束时间，那么就意味着当前帧已经没有时间给我执行任务了，必须把执行权交还给浏览器，也就是打断任务的执行。

另外当开始执行更新任务（也就是寻找工作单元并执行的过程）时，如果有新的更新任务进来，那么调度器就会按照两者的优先级大小来进行决策。如果新的任务优先级小，那么当然继续当下的任务；如果新的任务优先级大，那么会打断任务并开始新的任务。

## 小结

 当交互事件调用 `setState` 后，会触发批量更新，在整个交互事件回调执行完之前 `state` 都不会发生变更。

回调执行完毕后，开始更新任务，并触发调度。调度器会给这些更新任务一一设置优先级，并且在浏览器空闲的时候去执行他们，当然任务过期除外（会立刻触发更新，不再等待）。

如果在执行更新任务的时候，有新的任务进来，会判断两个任务的优先级高低。假如新任务优先级高，那么打断旧的任务，重新开始，否则继续执行任务

# 参考资料

1. 前端凯哥博客
2. react源码
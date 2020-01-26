# React Hooks+Ts深入浅出

## Create-react-app创建Ts项目

借助官网脚手架

```javascript
create-react-app react-ts-practice --typescript
```

关于create-react-app 其实是使用官网维护了一个react scripts的依赖包，这个包里面帮我们屏蔽了很多babel,eslint,webpack的细节，只用专注于组件开发，直接使用封装好的react的命令即可。所以后期做定制化的时候可以使用自己维护react-scripts这个依赖包，但是难度有点大哈哈。一般还是采用eject做定制化。

## 为什么要使用react hooks

动机：

* 在组件之间复用状态逻辑很难，比如使用了很多props和高阶组件。consumer，provider等等复用起来太过于复杂
* 复杂组件变得难以理解，比如componentDidmonut里面写了太多的逻辑，在UnMount里做事件监听，Unmount里面事件移除，组件逻辑又分散了，更加难以理解
* 难以理解的class,this的指向和绑定需要更多的学习成本
* 拥抱函数，使用函数方便自动化测试

## Ts在hooks和class组件中约束

### Ts约束class组件

```javascript
import React,{Fragment} from "react";
import { Button } from "antd";
 
interface Greeting {
   name: string;
   firstName?: string;
   lastName?: string;
}
interface State {
   count: number
}
 
// 泛型类型，第一个传入参数约束属性props，第二个约束状态state(内部数据)
class HelloClass extends React.Component<Greeting, State> {
   state: State = {
      count: 0
   };
   static defaultProps = {  // 属性默认值
      firstName: "",
      lastName: "",
   };
 
   render() {
      return (
         <Fragment>
            <p>点击了{this.state.count}次</p>
            <Button onClick={()=>{this.setState({count:                                                this.state.count+1})}}>Hello{this.props.name}Class</Button>
         </Fragment>
      );
   }
}
 
export default HelloClass;
```

### Ts约束hooks组件

```javascript
import React from "react";
import { Button } from "antd";
 
interface Greeting {
   name: string;
   firstName?: string;
   lastName?: string;
}
 
// 没有使用React.FC
const HelloOld = (props: Greeting) => <Button>你好{props.name}</Button>;
 
// 使用React.FC泛型类型
const Hello: React.FC<Greeting> = (props) => {
   return (
      <Button>Hello {props.name}</Button>
   )
};
 
export { Hello, HelloOld };
```

### Ts约束HOC

```javascript
import React from "react";
import HelloClass from "./HelloClass";
 
interface Loading {
   loading: boolean;
}
 
function HelloHoc<P>(params?: any) {
   return function<P>(WrappedComponent: React.ComponentType<P>) { // P表示被包装组件的属性的类型
      return class NewComponent extends React.Component<P & Loading>{ // 这里使用交叉类型，为新组件增加一些属性,接口Loading定义了新增的属性声明
         render(){
            return this.props.loading ? <div>Loading</div> : <WrappedComponent {...this.props as P}/>
 
         }
      }
   }
}
 
export default HelloHoc()(HelloClass);
```



## react Hooks的使用

### useState

* 调用useState做了什么

它定义一个 “state 变量”。我们的变量叫 `count`， 但是我们可以叫他任何名字，比如 `banana`。这是一种在函数调用时保存变量的方式 —— `useState` 是一种新方法，它与 class 里面的 `this.state` 提供的功能完全相同。一般来说，在函数退出后变量就就会”消失”，而 state 中的变量会被 React 保留

* useState需要哪些参数

**`useState` 需要哪些参数？** `useState()` 方法里面唯一的参数就是初始 state。不同于 class 的是，我们可以按照需要使用数字或字符串对其进行赋值，而不一定是对象。在示例中，只需使用数字来记录用户点击次数，所以我们传了 `0` 作为变量的初始 state。（如果我们想要在 state 中存储两个不同的变量，只需调用 `useState()` 两次即可。）

* useState的返回值是什么

返回值为：当前 state 以及更新 state 的函数。这就是我们写 `const [count, setCount] = useState()` 的原因。这与 class 里面 `this.state.count` 和 `this.setState` 类似，唯一区别就是你需要成对的获取它们

* useState的顺序必须固定

因为每次调用一个useState返回给前面指定的自定义变量名，如果后期使用调用的useState不按照顺序，会让返回的变量名和变量不对应。

***实践***

如果有复杂数据结构的，可以使用 [useImmer](https://github.com/immerjs/use-immer) ，解决深层数据修改，视图不更新的问题

```javascript
import { useImmer } from 'use-immer';
export interface TreeDataItemProps {
  label: string;
  value: string;
  children?: TreeDataItemProps[];
}

// ...
  const [treeData, setTreeData] = useImmer<TreeDataItemProps>({
    label: '',
    value: '',
    children: []
  });
// ...

```

其实使用useImmer的好处在于处理更新深层数据结构的个别参数，不用使用setState一股脑全部更新，可以分别更新,可以独立一个draft出来，使用箭头函数的形式更新单个name属性

```javascript
import React,{useState} from 'react';
import { useImmer } from "use-immer";

const App: React.FC = () => {
  const [person, updatePerson] = useImmer({
    name: "Michel",
    age: 33
  });

  function updateName(name: string) {
    updatePerson((draft: { name: any; }) => {
      draft.name = name;
    });
  }

  function becomeOlder() {
    updatePerson((draft: { age: number; }) => {
      draft.age++;
    });
  }

  return (
    <div className="App">
      <h1>
        Hello {person.name} ({person.age})
      </h1>
      <input
        onChange={e => {
          updateName(e.target.value);
        }}
        value={person.name}
      />
      <br />
      <button onClick={becomeOlder}>Older</button>
    </div>
  );
}

export default App;

```

### useEffect

可以把 `useEffect` Hook 看做 `componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 这三个函数的组合。

* useEffect做了什么

 通过使用这个 Hook，你可以告诉 React 组件需要在渲染后执行某些操作。React 会保存你传递的函数（我们将它称之为 “effect”），并且在执行 DOM 更新之后调用它。

* 为什么在组件内部调用useEffect

将 `useEffect` 放在组件内部让我们可以在 effect 中直接访问 `count` state 变量（或其他 props）。我们不需要特殊的 API 来读取它 —— 它已经保存在函数作用域中。Hook 使用了 JavaScript 的闭包机制，而不用在 JavaScript 已经提供了解决方案的情况下，还引入特定的 React API。

* useEffect每次渲染后都执行吗

 是的，默认情况下，它在第一次渲染之后*和*每次更新之后都会执行。（你可能会更容易接受 effect 发生在“渲染之后”这种概念，不用再去考虑“挂载”还是“更新”。React 保证了每次运行 effect 的同时，DOM 都已经更新完毕。每次我们重新渲染，都会生成*新的* effect，替换掉之前的。某种意义上讲，effect 更像是渲染结果的一部分

***提示：***

与 `componentDidMount` 或 `componentDidUpdate` 不同，使用 `useEffect` 调度的 effect 不会阻塞浏览器更新屏幕，这让你的应用看起来响应更快。

如果只想使用effect执行一次，那么使用传入空数组形式

如果想要想要更新，卸载副作用函数，使用return函数

对于class中prevState比对，使用[count]自动比对变化了没有。

***副作用：***

在 React 组件中有两种常见副作用操作：需要清除的和不需要清除的。

* 有时候，我们只想**在 React 更新 DOM 之后运行一些额外的代码。**比如发送网络请求，手动变更 DOM，记录日志，这些都是常见的无需清除的操作。因为我们在执行完这些操作之后，就可以忽略他们了
* 还有一些副作用是需要清除的。例如**订阅外部数据源**。这种情况下，清除工作是非常重要的，可以防止引起内存泄露！

### useReducer
## React中间件的使用

### React中间件React-thunk

Redux-thunk中间件ajax数据请求
安装这个插件就是为了返回一个函数，而不是只是对象。
先安装依赖
`npm install redux-thunk --save`

使用了中间件redux-thunk的作用是什么呢。就是让createAction中创建的action不一定要返回对象，可以返回方法。因为store.dispatch只接受一个对象，但是想要是一个方法，并且执行，就必须使用thunk中间件。

使用thunk的好处：复杂的业务逻辑应该独立于componentDidMount，因为影响性能，还有就是使用方法做业务逻辑，自动化测试好处挺大。
使用步骤：thunk依赖安装后，你必须在创建store的时候使用这个中间件，本身就有一个reducer参数，还有一个redux-devtools中间件。但是中间件只有一个参数，并且redux-devtools有独特的使用方式，那么就通过github搜索redux-devtools查看文档使用两个插件。
参考文档：https://github.com/zalmoxisus/redux-devtools-extension#installation
使用过程：

```js
import {createStore, applyMiddleware,compose} from 'redux'
import reducer from "./reducer.js"
import thunk from "redux-thunk"

// const store=createStore(reducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),

);
const store = createStore(reducer, enhancer);
export default store;
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

然后就可以使用这个thunk插件了。这样就可以将componentDidMount中的请求逻辑独立到createCreation中创建返回一个方法，不是返回一个action对象了，创建一个方法的好处是可以在里面写处理逻辑，在component直接触发执行就行。减少component中的逻辑执行。

```js
export const getUInitialData=()=>{
        return (dispatch)=>{
        Axios.get("https://www.easy-mock.com/mock/5d0f53982e31f746d8d06037/todolist/api/todolist")
        .then((res)=>{
            const list=res.data.data;
            console.log(list)
            const action={
                type:"initial-list-value",
                list
            };
            dispatch(action);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
}
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

返回了一个逻辑方法，这个方法还没有执行，怎么办呢？在component中引入这个文件，然后触发他。
componentDidMount(){
const action=getUInitialData();
console.log(action)
store.dispatch(action)

触发文件后，你还需要在reducer里面去接收传过去的代码，然后在store中处理这个传过来的数据
if(action.type==="initial-list-value"){
const newState=JSON.parse(JSON.stringify(state));
newState.list=action.list;
return newState;
}

### redux-saga组件的使用

作用：异步请求的实现方式，和saga很相似。
参考github网站：https://github.com/redux-saga/redux-saga
安装依赖
npm install redux-saga --save

配置store中的saga组件，saga组件
const sagaMiddleware = createSagaMiddleware()

将创建的saga容器放在redux-devtools组件引用中引用
const enhancer = composeEnhancers(
applyMiddleware(sagaMiddleware)
);

在store文件夹下创建一个saga文件
在store中运行导入的创建saga文件
sagaMiddleware.run(mySaga)

配置store的，reducer,redux-devtools,saga组件的全部文件

```js
import {createStore, applyMiddleware,compose} from 'redux'
import reducer from "./reducer.js"
import createSagaMiddleware from 'redux-saga'
import saga from "./saga"
const sagaMiddleware=createSagaMiddleware();
const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(sagaMiddleware)
);
const store = createStore(reducer, enhancer);
sagaMiddleware.run(saga);
export default store;

然后创建一个无数据的action，发出请求，让saga接收这个请求，并且这时重发一个action请求内容，使用saga文件解决请求逻辑
saga.js文件
import {REQUEST_ITEM1} from "./action_type"
import {takeLatest, put } from 'redux-saga/effects'
import {getRequest2} from "./createAction"
import Axios from "axios"
function*fetchUser(){
console.log("捕捉到第一次请求");
const res=yield Axios.get("https://www.easy-mock.com/mock/5d0f53982e31f746d8d06037/todolist/api/todolist")
const action=getRequest2(res.data.data);
yield put(action)
}
function* mySaga() {
    yield takeLatest(REQUEST_ITEM1, fetchUser);
  }
  
  export default mySaga;
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

 
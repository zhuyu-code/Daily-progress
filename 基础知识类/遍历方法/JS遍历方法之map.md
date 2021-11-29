### map（）

`map()` 方法会返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。该方法按照原始数组元素顺序依次处理元素。其语法如下

参数

| 参数名             | 含义                                                       |
| ------------------ | ---------------------------------------------------------- |
| **currentValue**   | 数组中正在处理的当前元素。                                 |
| **index**可选      | 数组中正在处理的当前元素的索引。                           |
| `array` **可选**   | `forEach()` 方法正在操作的数组。                           |
| `thisArg` **可选** | 可选参数。当执行回调函数 `callback` 时，用作 `this` 的值。 |

表现

`map` 方法会给原数组中的每个元素都按顺序调用一次  `callback` 函数。`callback` 每次执行后的返回值（包括 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)）组合起来形成一个新数组。 `callback` 函数只会在有值的索引上被调用；那些从来没被赋过值或者使用 `delete` 删除的索引则不会被调用。

因为`map`生成一个新数组，当你不打算使用返回的新数组却使用`map`是违背设计初衷的，请用`forEach`或者`for-of`替代。你不该使用`map`: A)你不打算使用返回的新数组，或/且 B) 你没有从回调函数中返回值。

`callback` 函数会被自动传入三个参数：数组元素，元素索引，原数组本身

```javascript
var map = Array.prototype.map
var a = map.call("Hello World", function(x) {
  return x.charCodeAt(0);
})
// a的值为[72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]
```

可以链式调用

```
arr.map(item=>item.time).map(item=>item.scaner)
```

注意点：

- map 方法不会对空数组进行检测；
- map 方法遍历数组时会返回一个新数组，**不会改变原始数组**；
- map 方法有返回值，可以return出来，map的回调函数中支持return返回值；
- map 方法无法遍历对象，仅适用于数组的遍历。
- `map` 方法处理数组元素的范围是在 `callback` 方法第一次调用之前就已经确定了。调用`map`方法之后追加的数组元素不会被`callback`访问。如果存在的数组元素改变了，那么传给`callback`的值是`map`访问该元素时的值。在`map`函数调用后但在访问该元素前，该元素被删除的话，则无法被访问到。

#### 场景实例

1.使用 map 重新格式化数组中的对象

```
var kvArray = [{key: 1, value: 10},
               {key: 2, value: 20},
               {key: 3, value: 30}];

var reformattedArray = kvArray.map(function(obj) {
   var rObj = {};
   rObj[obj.key] = obj.value;
   return rObj;
});

// reformattedArray 数组为： [{1: 10}, {2: 20}, {3: 30}],

```

2.querySelectorAll 应用

```
var elems = document.querySelectorAll('select option:checked');
var values = Array.prototype.map.call(elems, function(obj) {
  return obj.value;
});
```

3.误导案列

`["1", "2", "3"].map(parseInt);`

结果

`[1,NaN,NaN]`

原理

parseInt作为了一个函数，然后parseInt（表达式值，callback的基数），也就是map将item,index均传进去了，为parseInt(1,0),parseInt(2,1),parseInt(3,2)

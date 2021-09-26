### forEach()

语法

```
arr.forEach(callback(currentValue [, index [, array]])[, thisArg])
```

参数

| 参数名             | 含义                                                       |
| ------------------ | ---------------------------------------------------------- |
| **currentValue**   | 数组中正在处理的当前元素。                                 |
| **index**可选      | 数组中正在处理的当前元素的索引。                           |
| `array` **可选**   | `forEach()` 方法正在操作的数组。                           |
| `thisArg` **可选** | 可选参数。当执行回调函数 `callback` 时，用作 `this` 的值。 |

表现总结：

- **无返回值，不会修改原数组的任何内容**

- **forEach 方法无法遍历对象，仅适用于数组的遍历**。
- **forEach无法使用 break，continue 跳出循环，使用 return 时，效果和在 for 循环中使用 continue 一致；**

1.`forEach()` 遍历的范围在第一次调用 `callback` 前就会确定。调用 `forEach` 后添加到数组中的项不会被 `callback` 访问到。如果已经存在的值被改变，则传递给 `callback` 的值是 `forEach()` 遍历到他们那一刻的值。已删除的项不会被遍历到。如果已访问的元素在迭代时被删除了（例如使用 `shift()`），之后的元素将被跳过

例：

迭代删除被跳过

```
var words = ['one', 'two', 'three', 'four'];
words.forEach(function(word) {
  console.log(word);
  if (word === 'two') {
    words.shift();
  }
});
// one
// two
// four
```

迭代范围被确定

```
var words = ["one", "two", "three", "four"];
words.forEach(function (word) {
  console.log(word);
  if (word === "two") {
    words.push("five");
  }
});
// one
// two
//three
// four
```

2.如果 `thisArg` 参数有值，则每次 `callback` 函数被调用时，`this` 都会指向 `thisArg` 参数。如果省略了 `thisArg` 参数，或者其值为 `null` 或 `undefined`，`this` 则指向全局对象。按照[函数观察到 `this` 的常用规则](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)，`callback` 函数最终可观察到 `this` 值。使用箭头函数this.arg会被忽略，因为箭头函数无this值

定义了this.arg直接指向了arr1

```
let arr = [1, 2, 3, 4, 5];
let arr1 = [9, 8, 7, 6, 5];
arr.forEach(function (item, index,arr) {
  console.log(this[index]); //  9 8 7 6 5
}, arr1);
```

可用场景两个数组每项相加

```
let arr = [1, 2, 3, 4, 5];
let arr1 = [9, 8, 7, 6, 5];
let arr2 = [];
arr.forEach(function (item, index, arr) {
  arr2.push(this[index] + arr[index]);
}, arr1);
console.log(arr2); 
//[ 10, 10, 10, 10, 10 ]
```

3.除了使用抛出异常无法跳出异常

```
let arr = [1, 2, 3, 4, 5];
let arr1 = [9, 8, 7, 6, 5];
try {
  arr.forEach(function () {
    throw new Error();
  }, arr1);
} catch (error) {
  console.log("异常", error);
}
```

4.稀疏数组（不对未初始化的值进行任何操作）

```
const arraySparse = [1, 3, , 7];
let numCallbackRuns = 0;

arraySparse.forEach(function (element) {
  console.log(element);
  numCallbackRuns++;
});

console.log("numCallbackRuns: ", numCallbackRuns);
```

5.数组扁平化

```
function flatten(arr) {
  const result = [];

  arr.forEach((item) => {
    if (Array.isArray(item)) {
      result.push(...flatten(item));
    } else {
      result.push(item);
    }
  });

  return result;
}

// Usage
const problem = [1, 2, 3, [4, 5, [6, 7], 8, 9]];

console.log(flatten(problem)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]

```


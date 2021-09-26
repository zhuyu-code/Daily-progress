### 1.this的概念

在绝大多数情况下，函数的调用方式决定了 `this` 的值（运行时绑定）。`this` 不能在执行期间被赋值，并且在每次函数被调用时 `this` 的值也可能会不同。ES5 引入了 [bind](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) 方法来设置函数的 `this` 值，而不用考虑函数如何被调用的。ES2015 引入了[箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)，箭头函数不提供自身的 this 绑定（`this` 的值将保持为闭合词法上下文的值）。

当前执行上下文（global、function 或 eval）的一个属性，在非严格模式下，总是指向一个对象，在严格模式下可以是任意值。

无论是否在严格模式下，在全局执行环境中（在任何函数体外部）`this` 都指向全局对象。

**全局上下文**

浏览器环境指向window,nodejs环境指向global

**函数上下文**

在函数内部，`this`的值取决于函数被调用的方式

严格模式下由调用函数时设置，所以是undefined

```
function f2() {
  "use strict"; // 这里是严格模式
  return this;
}

console.log(f2());undefined
```

非严格模式下不由调用函数时设置，指向全局上下文

```
function f2() {
  "use strict"; // 这里是严格模式
  return this;
}

console.log(f2());//window对象
```

加入严格模式，但是调用时采用了window，在执行函数时绑定了this

```
function f2() {
  "use strict"; // 这里是严格模式
  return this;
}

console.log(window.f2());//window对象
```

**类上下文**

`this` 在 [类](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes) 中的表现与在函数中类似，因为类本质上也是函数，但也有一些区别和注意事项。

在类的构造函数中，`this` 是一个常规对象。类中所有非静态的方法都会被添加到 `this` 的原型中：

```
class Example {
  constructor() {
    const proto = Object.getPrototypeOf(this);//获取原型上的this
    console.log(Object.getOwnPropertyNames(proto));
  }
  first(){}
  second(){}
  static third(){}
}

new Example(); // ['constructor', 'first', 'second']
```

**派生类**

不像基类的构造函数，派生类的构造函数没有初始的 `this` 绑定。在构造函数中调用 [`super()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/super) 会生成一个 `this` 绑定，并相当于执行如下代码，Base为基类：

```
this = new Base();
```

不能在调用派生类之前执行的方法

```
class Base {}
class Good extends Base {}
class AlsoGood extends Base {
  constructor() {
    return {a: 5};
  }
  f(){
}
}
class Bad extends Base {
  constructor() {}
}

new Good();
new AlsoGood();
new Bad(); // ReferenceError
```

AlsoGood相当于用{}代替了this,那么随意的方法f，也无法找到

**this的绑定**

```
// 对象可以作为 bind 或 apply 的第一个参数传递，并且该参数将绑定到该对象。
var obj = { a: "Custom" };

// 声明一个变量，并将该变量作为全局对象 window 的属性。
var a = "Global";

function whatsThis() {
  return this.a; // this 的值取决于函数被调用的方式
}

whatsThis(); // 'Global' 因为在这个函数中 this 没有被设定，所以它默认为 全局/ window 对象
whatsThis.call(obj); // 'Custom' 因为函数中的 this 被设置为obj
whatsThis.apply(obj); // 'Custom' 因为函数中的 this 被设置为obj
```

在非严格模式下使用 `call` 和 `apply` 时，如果用作 `this` 的值不是对象，则会被尝试转换为对象。`null` 和 `undefined` 被转换为全局对象。原始值如 `7` 或 `'foo'` 会使用相应构造函数转换为对象。因此 `7` 会被转换为 `new Number(7)` 生成的对象，字符串 `'foo'` 会转换为 `new String('foo')` 生成的对象。

```javascript
function add(c, d) {
  return this.a + this.b + c + d;
}

var o = {a: 1, b: 3};

// 第一个参数是用作“this”的对象
// 其余参数用作函数的参数
add.call(o, 5, 7); // 16

// 第一个参数是用作“this”的对象
// 第二个参数是一个数组，数组中的两个成员用作函数参数
add.apply(o, [10, 20]); // 34
```

**bind方法**

调用`f.bind(someObject)`会创建一个与`f`具有相同函数体和作用域的函数，但是在这个新函数中，`this`将永久地被绑定到了`bind`的第一个参数，无论这个函数是如何被调用的。

```javascript
function f(){
  return this.a;
}

var g = f.bind({a:"azerty"});
console.log(g()); // azerty

var h = g.bind({a:'yoo'}); // bind只生效一次！
console.log(h()); // azerty

var o = {a:37, f:f, g:g, h:h};
console.log(o.a, o.f(), o.g(), o.h()); // 37, 37, azerty, azerty
```

**箭头函数**

在[箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)中，`this`与封闭词法环境的`this`保持一致。在全局代码中，它将被设置为全局对象：所有的隐式绑定都无效。无论如何，`foo` 的 `this` 被设置为他被创建时的环境（在上面的例子中，就是全局对象）。这同样适用于在其他函数内创建的箭头函数：这些箭头函数的`this`被设置为封闭的词法环境的。例如vue创建的环境中，this都指向this对象。

**作为对象的方法**

同样，`this` 的绑定只受最接近的成员引用的影响。在下面的这个例子中，我们把一个方法`g`当作对象`o.b`的函数调用。在这次执行期间，函数中的`this`将指向`o.b`。事实证明，这与他是对象 `o` 的成员没有多大关系，最近的引用才是最重要的。

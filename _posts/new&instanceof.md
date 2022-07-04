<description hidden>new&instanceof 代码实现及原理分析</description>

# new

`new` 关键字会进行如下的操作(**MDN**)：

1. 创建一个空的简单 `JavaScript` 对象（即{}）；
2. 为步骤 1 新创建的对象添加属性**proto**，将该属性链接至构造函数的原型对象 ；
3. 将步骤 1 新创建的对象作为 `this` 的上下文 ；
4. 如果该函数没有返回对象，则返回 `this`。

```js
function selfNew(fn) {
  var args = Array.prototype.slice.call(arguments, 1);
  var obj = {};
  obj.__proto__ = fn.prototype;

  var result = fn.apply(obj, args);

  return typeof result === 'function' || typeof result === 'object' ? result : obj;
}
```

# instanceof

`instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

```js
// 判断是否是引用数据类型
function isComplexType(value) {
  return typeof value === 'object' || typeof value === 'function';
}

function instanceOf(left, right) {
  if (!isComplexType(right)) {
    throw new TypeError("Right-hand side of 'instanceof' is not an object");
  }

  if (!isComplexType(left)) {
    return false;
  }

  left = Object.getPrototypeOf(left);
  right = right.prototype;

  while (left !== null) {
    if (left === right) return true;

    left = Object.getPrototypeOf(left);
  }

  return false;
}
```

<description hidden>call_apply_bind 原理分析及代码实现</description>

# call_apply_bind 原理分析及代码实现

`call_apply_bind`的用法在这里就不多赘述了，不清楚的可以到 MDN 上看看

`call_apply_bind`简单来说就是改变`this`的指向,call 和 apply 的实现就是运用了`函数作为某个对象的方法调用时，这时this就指 向这个对象的原理`，然后 call 和 apply 的区别就是 apply 第二个参数是一个数组，里面的元素是要传给调用的函数/方法的参数，而 call 则是把这个数组展开分成多个参数传入，bind 与 call、apply 的区别下面再细说

### call

```js
Function.prototype.selfCall = function () {
  if (typeof this !== 'function') {
    throw new TypeError(this.name + 'is not a function');
  }

  var context = arguments[0] === undefined || arguments[0] === null ? globalThis : Object(arguments[0]);
  var args = [];

  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
  }

  var key = Math.random().toString(36).substring(2);

  context[key] = this;

  var result = eval('context[key](' + args + ')');

  delete context[key];
  return result;
};
```

### apply

```js
Function.prototype.selfApply = function () {
  if (typeof this !== 'function') {
    throw new TypeError(this.name + 'is not a function');
  }

  var context = arguments[0] === undefined || arguments[0] === null ? globalThis : Object(arguments[0]);
  var key = Math.random().toString(36).substring(2);
  var args = [];

  for (var i = 0, len = arguments[1].length; i < len; i++) {
    args.push('arguments[1][' + i + ']');
  }

  context[key] = this;

  var result = eval('context[key](' + args + ')');

  delete context[key];
  return result;
};
```

### bind

bind 与 call、apply 的区别就是 bind 调用后会返回一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。 如果使用 new 运算符构造绑定函数，原来提供的 this 就会被忽略 即第一个参数，然后会调用原来调用 bind 的函数去创建实例。不过提供的参数列表仍然会插入到构造函数调用时的参数列表之前。

```js
Function.prototype.selfBind = function () {
  if (typeof this !== 'function') {
    throw new TypeError(this.name + 'is not a function');
  }

  var context = arguments[0] === undefined || arguments[0] === null ? globalThis : Object(arguments[0]);
  var outerArgs = arguments[1];
  var outerFn = this;
  var innerFn = function (...innerArgs) {
    const allArgs = outerArgs.concat(innerArgs);
    return this instanceof innerFn ? new outerFn(allArgs) : outerFn.selfApply(context, allArgs);
  };
};
```

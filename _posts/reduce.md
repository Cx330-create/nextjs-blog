```js
Array.prototype.selfReduce = function (callback, initValue) {
  // 有可能是这样调用Array.prototype.selfReduce.(call | apply)((null | undefined))
  if (this == null) {
    throw new TypeError('Array.prototype.reduce called on null or undefined');
  }
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  var index = 0;
  var prev = null;
  // 创建数组副本 reduce 不会直接改变调用它的对象，但对象可被调用的 callbackfn 所改变。
  // 遍历的元素范围是在第一次调用 callbackfn 之前确定的。所以即使有元素在调用开始后被追加到数组中，这些元素也不会被 callbackfn 访问。
  // 如果数组现有的元素发生了变化，传递给 callbackfn 的值将会是元素被 reduce 访问时的值（即发生变化后的值）；
  // 在调用 reduce 开始后，尚未被访问的元素若被删除，则其将不会被 reduce 访问。
  var arr = Object(this);
  // 将任意js值转换为数字,且不会出现NaN
  var arrLength = this.length >>> 0;

  if (arguments.length > 1) {
    prev = initValue;
  } else {
    // (!(index in this))的原因是arr有可能是稀疏数组 [1, empty, 2] 下同
    while (index < arrLength && !(index in this)) {
      index++;
    }
    // 如果数组为空且未指定初始值 initialValue，则会抛出 TypeError。
    if (index >= arrLength) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    prev = arr[index++];
  }

  // 如果数组仅有一个元素（无论位置如何）并且没有提供初始值 initialValue，
  // 或者有提供 initialValue 但是数组为空，那么此唯一值将被返回且 callbackfn 不会被执行。
  for (var i = index; i < arrLength; i++) {
    if (i in arr) {
      prev = callback(prev, arr[i], i, arr);
    }
  }

  return prev;
};
```

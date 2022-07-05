<description hidden>JSON.stringify 特性介绍及简单代码实现</description>

# JSON.stringify

**注：JSON.stringify 后两个参数的功能均未实现**

`JSON.stringify`将值转换为相应的 `JSON` 格式：

1. 转换值如果有 `toJSON` 方法，该方法定义什么值将被序列化。
2. 非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中。
3. 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。
4. `undefined`、任意的函数以及 `symbol` 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 `null`（出现在数组中时）。函数、`undefined` 被单独转换时，会返回 `undefined`，如 `JSON.stringify(function(){}) or JSON.stringify(undefined)`.
5. 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。
6. 所有以 `symbol` 为属性键的属性都会被完全忽略掉，即便 `replacer` 参数中强制指定包含了它们。
7. `Date` 日期调用了 `toJSON` 将其转换为了 `string` 字符串（同 `Date.toISOString`），因此会被当做字符串处理。
8. `NaN` 和 `Infinity` 格式的数值及 `null` 都会被当做 `null`。
9. 其他类型的对象，包括 `Map/Set/WeakMap/WeakSet`，仅会序列化可枚举的属性。

```js
// 判断是否是引用类型
function isReferenceType(value) {
  return typeof value === 'function' || (typeof value === 'object' && value !== null);
}

// 检测是否循环引用
function detectCircle(value) {
  var hashMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new WeakMap();

  if (!isReferenceType(value)) {
    return false;
  }

  if (hashMap.has(value)) {
    return true;
  }

  hashMap.set(value, null);

  for (const key in value) {
    if (Object.hasOwnProperty.call(value, key)) {
      if (detectCircle(value[key], hashMap)) {
        return true;
      }
    }
  }

  return false;
}

// Object.is 的 polyfill 其功能是为了解决 -0 === +0 => true 和 NaN === NaN => false
function objectIs(x, y) {
  if (x === y) {
    return 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

JSON.selfStringify = function (value) {
  // 特性5
  if (detectCircle(value)) {
    throw new TypeError('Converting circular structure to JSON');
  }
  // 当尝试去转换 BigInt 类型的值会抛出TypeError
  if (typeof value === 'bigint') {
    throw new TypeError('Do not know how to serialize a BigInt');
  }

  var transformedTypes = ['undefined', 'function', 'symbol'];
  var changeToNullTypes = [NaN, -Infinity, Infinity, null];
  var originalObjectTypes = [Number, String, Boolean];

  if (typeof value === 'object' && value !== null) {
    var isOriginalObject = originalObjectTypes.some(function (type) {
      return value instanceof type;
    });

    // 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值
    if (isOriginalObject) {
      return JSON.selfStringify(value.valueOf());
      // 如果一个被序列化的对象拥有 toJSON 方法，那么该 toJSON 方法就会覆盖该对象默认的序列化行为：不是该对象被序列化，而是调用 toJSON 方法后的返回值会被序列化
    } else if (typeof value.toJSON === 'function') {
      return JSON.selfStringify(value.toJSON());
      // 如果是正则对象则返回'{}'
    } else if (value instanceof RegExp) {
      return '{}';
    }

    var result = [];

    if (Array.isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        // 特性4
        if (transformedTypes.includes(typeof value[i])) {
          result.push('null');
        } else {
          var tempValue = value[i];

          // 对象嵌套对象，递归调用下去 下同
          if (isReferenceType(tempValue)) {
            result.push(JSON.selfStringify(value[i]));
          } else {
            // 特性4
            var isChangeToNull = changeToNullTypes.some(function (type) {
              return objectIs(type, tempValue);
            });
            if (isChangeToNull) {
              result.push('null');
              // 如果是字符串,需要额外加"" 下同
            } else if (typeof tempValue === 'string') {
              result.push('"'.concat(tempValue, '"'));
            } else {
              result.push(tempValue);
            }
          }
        }
      }

      return '['.concat(result.join(','), ']');
    } else {
      for (const key in value) {
        var descriptor = Object.getOwnPropertyDescriptor(value, key);

        // 特性9
        if (Object.hasOwnProperty.call(value, key) && descriptor.enumerable) {
          if (transformedTypes.includes(typeof value[key])) {
            continue;
          } else {
            var tempValue = value[key];

            if (isReferenceType(tempValue)) {
              result.push('"'.concat(key, '":').concat(JSON.selfStringify(value[key])));
            } else {
              var isChangeToNull = changeToNullTypes.some(function (type) {
                return objectIs(type, tempValue);
              });
              if (isChangeToNull) {
                result.push('"'.concat(key, '":null'));
              } else if (typeof tempValue === 'string') {
                result.push('"'.concat(key, '":"').concat(tempValue, '"'));
              } else {
                result.push('"'.concat(key, '":').concat(tempValue));
              }
            }
          }
        }
      }

      return '{'.concat(result.join(','), '}');
    }
    // 特性4
  } else if (transformedTypes.includes(typeof value)) {
    return void 0;
  } else if (
    // 特性4
    changeToNullTypes.some(function (type) {
      return objectIs(type, value);
    })
  ) {
    return 'null';
  } else {
    var result = ''.concat(value);
    return typeof value === 'string' ? '"'.concat(result, '"') : result;
  }
};
```

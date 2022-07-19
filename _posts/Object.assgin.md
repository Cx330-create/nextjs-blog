<description hidden>Object.assgin 代码实现及原理分析</description>

# Object.assign()

`Object.assign()` 方法将所有可枚举（`Object.propertyIsEnumerable()` 返回 `true`）和自有（`Object.hasOwnProperty()` 返回 `true`）属性从一个或多个源对象复制到目标对象，返回修改后的对象。（借用 MDN 的的话简单介绍一下）

**注：Object.assgin 属于浅拷贝**

```js
function isComplexType(value) {
  return typeof value === 'object' || typeof value === 'function';
}

Object.selfAssgin = function (target) {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  if (!isComplexType(target)) {
    // 基本类型会被包装为对象
    target = new Object(target);
  }

  var sources = [];
  for (var i = 1; i < arguments.length; i++) {
    sources[i - 1] = arguments[i];
  }

  // Object.getOwnPropertyDescriptors({}) => undefined
  var targetDescriptors = Object.getOwnPropertyDescriptors(target) || {};
  var targetProtoDescriptors = Object.getOwnPropertyDescriptors(target.__proto__) || {};

  sources.forEach(function (source) {
    if (source != null) {
      if (!isComplexType(source)) {
        source = new Object(source);
      }
      var sourceDescriptors = Object.keys(source)
        // 拷贝 Symbol 类型属性
        .concat(Object.getOwnPropertySymbols(source))
        .reduce(function (descriptor, key) {
          var des = Object.getOwnPropertyDescriptor(source, key);

          // 原型链上的属性和不可枚举属性不能被复制
          if (des.enumerable) {
            var targetDescriptor = targetDescriptors[key] || {};
            var targetProtoDescriptor = targetProtoDescriptors[key] || {};

            if (key in target && (targetDescriptor.writable === false || targetProtoDescriptor.writable === false)) {
              // 如果赋值期间出错，例如如果属性不可写，则会抛出 TypeError(而且会检查原型上的同名属性)
              /*
                var obj = {}

                Object.defineProperty(obj, 'a', {
                  value: 1,
                  writable: false,
                  configurable: true,
                });
                或者是
                Object.defineProperty(obj.__proto__, 'a', {
                  value: 1,
                  writable: false,
                  configurable: true,
                });
                Object.selfAssgin(obj, { a: 2 })
                则抛错
              */
              throw new TypeError('Cannot assign to read only property ' + key + " of object '#<Object>'");
            }

            if (des.get) {
              // 如果源对象存在[[Get]]方法，则调用得到返回值再复制到目标对象上
              /*
                const obj = {
                  _a: 1,
                  get a() {
                    return this._a;
                  },
                  set a(newVal) {
                    this._a = newVal;
                  },
                };
                Object.selfAssgin({}, obj) => {a: 1}
              */
              var value = des.get.call(source);

              Object.defineProperty(target, key, {
                value,
                enumerable: des.enumerable,
                configurable: des.configurable,
                writable: des.writable,
              });
            } else {
              descriptor[key] = Object.getOwnPropertyDescriptor(source, key);
            }
          }
          return descriptor;
        }, {});

      //  如果目标对象与源对象具有相同的 key，则目标对象中的属性将被源对象中的属性覆盖，后面的源对象的属性将类似地覆盖前面的源对象的属性。
      Object.defineProperties(target, sourceDescriptors);
    }
  });

  return target;
};
```

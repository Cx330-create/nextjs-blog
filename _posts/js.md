<description hidden>一些 js 代码面试题</description>

### js 代码面试题

```javascript
(() => {
  var a = { n: 1 };
  var b = a;
  a.x = a = { n: 2 };
  console.log(a.x);
  console.log(b.x);
})();

(() => {
  function fn1(a, b, c) {
    console.log(a, b, c);

    var a = 'a';
    var b = function b() {};
    (function a() {});
    (function b() {});
    function c() {}
    console.log(a, b, c);
  }
  fn1(1, 2, 3);
})();

(() => {
  console.log([1, 2, 3].map(parseInt));
})();
```

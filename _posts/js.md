<description hidden>一些 js 代码面试题</description>

### js 代码面试题

```js
(() => {
  //请写出输出内容
  var a = { n: 1 };
  var b = a;
  a.x = a = { n: 2 };
  console.log(a.x);
  console.log(b.x);
})();

(() => {
  //请写出输出内容
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

(() => {
  //请写出输出内容
  async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
  }
  async function async2() {
    console.log('async2');
  }

  console.log('script start');

  setTimeout(function () {
    console.log('setTimeout');
  }, 0);

  async1();

  new Promise(function (resolve) {
    console.log('promise1');
    resolve();
  }).then(function () {
    console.log('promise2');
  });
  console.log('script end');
})();
```

<description hidden>JSONP 代码实现</description>

### JSONP

`JSONP`(JSON with Padding)是[JSON](https://baike.baidu.com/item/JSON)的一种“使用模式”，可用于解决主流浏览器的跨域数据访问的问题。由于同源策略，一般来说位于 server1.example.com 的网页无法与不是 server1.example.com 的服务器沟通，而 HTML 的`<script> `元素是一个例外。利用`<script>`元素的这个开放策略，网页可以得到从其他来源动态产生的 JSON 资料，而这种使用模式就是所谓的 JSONP。用 `JSONP` 抓到的资料并不是 JSON，而是任意的 JavaScript，用 JavaScript 直译器执行而不是用 JSON 解析器解析。（借用百度百科的解释）,简单来说就是借助 script 标签实现跨域，但是 `JSONP` 只支持 GET 请求，而不支持 POST 等其它类型的 HTTP 请求，还有使用 `JSONP` 跨域，是需要后端配合的，设置 callback，需要后端给前端传的是 `JSONP` 格式（也就是一段`js`脚本）的数据，才能完成跨域请求。

下面是 `JSONP` 的代码实现

**浏览器端**

```js
function jsonp(url, params = {}) {
  let callbackKey = (jsonp.callbackKey = jsonp.callbackKey ? ++jsonp.callbackKey : 1);
  params.callback = `jsonp[${callbackKey}]`;
  const queryUrl = `${url}?${Object.keys(params)
    .map(key => {
      return `${key}=${encodeURIComponent(params[key])}`;
    })
    .join('&')}`;
  return new Promise((resolve, reject) => {
    jsonp[callbackKey] = function (res) {
      resolve(res);
      document.body.removeChild(script);
      Reflect.deleteProperty(jsonp, callbackKey);
    };

    const script = document.createElement('script');

    script.setAttribute('src', queryUrl);
    document.body.append(script);
  });
}

jsonp('http://127.0.0.1:8080/jsonp').then(res => {
  console.log(res);
});
```

**node 端**

```js
const express = require('express');
const app = express();

app.get('/jsonp', (req, res) => {
  res.send(`${req.query.callback}(${JSON.stringify({ a: 1 })})`);
});

app.listen(8080, () => {
  console.log('http://127.0.0.1:8080');
});
```

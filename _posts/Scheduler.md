<description hidden>一个并发限制调度器</description>

# Scheduler（promise）

```js
/**
 * @description 并发限制调度器
 * @author 7+
 * @param options 配置选项
 * @sub-param limit: 并发数量
 * @sub-param values: 源数据
 * @sub-param pCtor: 创建promise的函数
 * @sub-param cb: 每个promise成功或者失败的回调
 * @reference https://github.com/rxaviers/async-pool
 */
function scheduler(options) {
  let { limit, values, pCtor, cb, cur = 0, pool = new Set() } = options;

  if (cur >= values.length) {
    return Promise.race(pool);
  }

  const execute = v => {
    const p = Promise.resolve(pCtor(v));
    const clean = res => {
      cur < values.length && cb?.(res);
      pool.delete(p);
    };

    pool.add(p);
    p.then(clean).catch(clean);
  };

  if (limit) {
    while (cur < limit) {
      execute(values[cur++]);
    }
  } else {
    execute(values[cur++]);
  }

  const final = () => scheduler({ ...options, limit: void 0, cur, pool });
  return Promise.race(pool).then(final).catch(final);
}

const timeout = time =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(time);
    }, time);
  });

const times = [2000, 1000, 900, 3000];

scheduler({
  limit: 2,
  values: times,
  pCtor: timeout,
  cb: res => {
    console.log(res);
  },
}).then(res => {
  console.log(res);
});
```

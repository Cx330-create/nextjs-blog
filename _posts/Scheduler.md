<description hidden>一个基于 promise 的并发调度器</description>

# Scheduler（promise）

```js
/**
 * @description 并发调度器
 * @author 7+
 * @param options 配置选项
 * @sub-param limit: 并发数量
 * @sub-param values: 源数据
 * @sub-param pCtor: 创建promise的函数
 * @sub-param cb: 每个promise成功或者失败的回调
 * @see https://github.com/Cx330-create/async-pool-limit
 * @reference https://github.com/rxaviers/async-pool
 */
function scheduler(options) {
  let { limit, values, pCtor, cb, cur = 0, pool = new Set() } = options;

  if (!Array.isArray(values)) {
    throw new TypeError('values must be a array');
  }

  if (typeof pCtor !== 'function') {
    throw new TypeError('pCtor must be a function');
  }

  const final = () => 'Tasks Ended!';

  if (cur >= values.length) {
    return pool.size ? Promise.race(pool).then(final).catch(final) : Promise.resolve('Tasks Ended!');
  }

  const execute = v => {
    const p = Promise.resolve(pCtor(v));
    const clean = res => {
      cb?.(res);
      pool.delete(p);
    };

    pool.add(p);
    p.then(clean).catch(clean);
  };

  while (pool.size < limit && values[cur]) {
    execute(values[cur++]);
  }

  if (limit > values.length) {
    return Promise.all(pool).then(final).catch(final);
  }

  const next = () => scheduler({ ...options, cur, pool });
  return Promise.race(pool).then(next).catch(next);
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

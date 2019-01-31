# CORS middleware for koa

## install

```
npm i @gem-mine/cors -S
```

## useage
正常使用 koa 的中间件：

```js
app.use(cors({
  /**
   * CORS 跨域请求支持，配置可以是：
   * boolean: true 表示支持任意域的请求；
   * array: 支持多域白名单配置，其中元素可以是 域名字符串、正则表达式。
   */
  origins: boolean | ((string | RegExp)[]);
  /**
   * HTTP 请求方法，默认支持 GET/HEAD/PUT/POST/DELETE/PATCH
   */
  methods?: ('get'|'head'|'put'|'post'|'delete'|'patch')[];
  /**
   * 是否允许发送Cookie，默认 true，发送
   */
  credentials?: boolean;
  /**
   * 设置缓存，单位秒，缓存生效期内不会再次发送 OPTIONS 请求，默认 3600 秒
   */
  maxAge?: number;
}))
```

针对 origins 的取值：
* `true`: 对所有域生效
* `['http://baidu.com', /google\.com$/]`: 支持字符串或正则表达式

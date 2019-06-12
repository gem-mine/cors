import * as Koa from 'koa'

export enum METHOD {
  GET = 'GET',
  HEAD = 'HEAD',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE ',
  PATCH = 'PATCH'
}

export type CROSS_ORIGIN = boolean | ((string | RegExp)[])

export interface OPTIONS {
  /**
   * CORS 跨域请求支持，配置可以是：
   * boolean: true 表示支持任意域的请求；
   * array: 支持多域白名单配置，其中元素可以是 域名字符串、正则表达式。
   */
  origins: CROSS_ORIGIN
  /**
   * HTTP 请求方法，默认支持 GET/HEAD/PUT/POST/DELETE/PATCH
   */
  methods?: METHOD[]
  /**
   * 是否允许发送Cookie，默认 true，发送
   */
  credentials?: boolean
  /**
   * 设置缓存，单位秒，缓存生效期内不会再次发送 OPTIONS 请求，默认 3600 秒
   */
  maxAge?: number
  /**
   * 支持的请求头
   */
  allowHeaders?: Array<string>
}

function cors(options: OPTIONS): (context: Koa.Context, next: () => Promise<any>) => void {
  const { origins } = options
  // 缓存处理，避免每次请求都重新计算
  const _isArray = Array.isArray(origins)
  const _cacheStr: string[] = []
  const _cacheReg: RegExp[] = []
  if (_isArray) {
    for (let i = 0; i < (<[]>origins).length; i++) {
      const item = origins[i]
      const t = typeof item
      if (t === 'string') {
        _cacheStr.push(item)
      } else if (item instanceof RegExp) {
        _cacheReg.push(item)
      }
    }
  }

  return async function(ctx: Koa.Context, next: () => Promise<any>) {
    const origin = <string>ctx.req.headers.origin
    ctx.vary('Origin') // https://github.com/rs/cors/issues/10

    if (!origin) {
      return await next()
    }

    let match: boolean
    if (_isArray) {
      match = _cacheStr.some(item => {
        return item === origin
      })
      if (!match) {
        match = _cacheReg.some(item => {
          return item.test(origin)
        })
      }
    } else {
      match = !!origins
    }

    if (match) {
      const { methods = [METHOD.GET, METHOD.HEAD, METHOD.PUT, METHOD.POST, METHOD.DELETE, METHOD.PATCH], credentials, maxAge = 3600, allowHeaders } = options
      const sendCookie = credentials === false ? 'false' : 'true'

      if (ctx.method === 'OPTIONS') {
        // this not preflight request, ignore it
        if (!ctx.get('Access-Control-Request-Method')) {
          return await next()
        }
        ctx.set('Access-Control-Allow-Methods', methods.join(','))
        ctx.set('Access-Control-Max-Age', maxAge + '')

        ctx.status = 204
      }

      if (allowHeaders) {
        ctx.set('Access-Control-Allow-Headers', allowHeaders.join(','));
      } else {
        ctx.set('Access-Control-Allow-Headers', ctx.get('Access-Control-Request-Headers'));
      }

      ctx.set('Access-Control-Allow-Credentials', sendCookie)
      ctx.set('Access-Control-Allow-Origin', origin)
    }
    await next()
  }
}

export default cors

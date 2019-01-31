'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var METHOD
;(function(METHOD) {
  METHOD['GET'] = 'GET'
  METHOD['HEAD'] = 'HEAD'
  METHOD['PUT'] = 'PUT'
  METHOD['POST'] = 'POST'
  METHOD['DELETE'] = 'DELETE '
  METHOD['PATCH'] = 'PATCH'
})((METHOD = exports.METHOD || (exports.METHOD = {})))
function cors(options) {
  const { origins } = options
  // 缓存处理，避免每次请求都重新计算
  const _isArray = Array.isArray(origins)
  const _cacheStr = []
  const _cacheReg = []
  if (_isArray) {
    for (let i = 0; i < origins.length; i++) {
      const item = origins[i]
      const t = typeof item
      if (t === 'string') {
        _cacheStr.push(item)
      } else if (item instanceof RegExp) {
        _cacheReg.push(item)
      }
    }
  }
  return function(ctx, next) {
    const origin = ctx.req.headers.origin
    ctx.vary('Origin') // https://github.com/rs/cors/issues/10
    if (!origin) {
      return next()
    }
    let match
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
      const { methods = [METHOD.GET, METHOD.HEAD, METHOD.PUT, METHOD.POST, METHOD.DELETE, METHOD.PATCH], credentials, maxAge = 3600 } = options
      const sendCookie = credentials === false ? 'false' : 'true'
      ctx.set('Access-Control-Allow-Credentials', sendCookie)
      ctx.set('Access-Control-Allow-Origin', origin)
      if (ctx.method === 'OPTIONS') {
        // this not preflight request, ignore it
        if (!ctx.get('Access-Control-Request-Method')) {
          return next()
        }
        ctx.set('Access-Control-Allow-Methods', methods.join(','))
        ctx.set('Access-Control-Max-Age', maxAge + '')
      }
    }
    return next()
  }
}
exports.default = cors

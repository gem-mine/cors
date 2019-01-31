import * as Koa from 'koa';
export declare enum METHOD {
    GET = "GET",
    HEAD = "HEAD",
    PUT = "PUT",
    POST = "POST",
    DELETE = "DELETE ",
    PATCH = "PATCH"
}
export declare type CROSS_ORIGIN = boolean | ((string | RegExp)[]);
export interface OPTIONS {
    /**
     * CORS 跨域请求支持，配置可以是：
     * boolean: true 表示支持任意域的请求；
     * array: 支持多域白名单配置，其中元素可以是 域名字符串、正则表达式。
     */
    origins: CROSS_ORIGIN;
    /**
     * HTTP 请求方法，默认支持 GET/HEAD/PUT/POST/DELETE/PATCH
     */
    methods?: METHOD[];
    /**
     * 是否允许发送Cookie，默认 true，发送
     */
    credentials?: boolean;
    /**
     * 设置缓存，单位秒，缓存生效期内不会再次发送 OPTIONS 请求，默认 3600 秒
     */
    maxAge?: number;
}
declare function cors(options: OPTIONS): (context: Koa.Context, next: () => Promise<any>) => void;
export default cors;

/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1588165044435_4263';

  // add your middleware config here
  config.middleware = [];
  config.view = {
    mapping: {
      '.pug': 'pug',
    },
  };
  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/tidb',
  };
  config.static = {
    prefix: '/TIDBStatic/',
  };
  config.security = {
    csrf: {
      // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
      // ignore: ctx => isInnerIp(ctx.ip),
      ignore: ['/analysis', '/reactome'],
    },
  };
  config.io = {
    init: { },
    namespace: {
      '/task_socket': {
        connectionMiddleware: [ 'auth' ],
        packetMiddleware: [],
      },
    },
  };
  config.session = {
    key: '1588165044435_4263',  // 设置session cookie里面的key
    maxAge: 1000*60*30, // 设置过期时间
    httpOnly: true,
    encrypt: true,
    renew: true         // renew等于true 那么每次刷新页面的时候 session都会被延期
  }


  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    reactome_url: "http://reactome.ncpsb.org/"
  };
  config.programPath = "/root/TIDB_api/program";
  config.programResult = "/root/TIDB_api/result";

  return {
    ...config,
    ...userConfig,
  };
};

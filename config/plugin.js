'use strict';

/** @type Egg.EggPlugin */

module.exports = {
  pug: {
    enable: true,
    package: 'egg-view-pug',
  },
  parameters: {
    enable: true,
    package: 'egg-parameters',
  },
  routerPlus: {
    enable: true,
    package: 'egg-router-plus',
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  io: {
    enable: true,
    package: 'egg-socket.io',
  }
};

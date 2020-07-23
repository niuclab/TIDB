'use strict';

const bcrypt = require('bcryptjs');


exports.bhash = str => {
  return bcrypt.hashSync(str, 10);
};

exports.bcompare = (str, hash) => {
  return bcrypt.compareSync(str, hash);
};

exports.parseMsg = (action, payload = {}, metadata = {}) => {
  const meta = Object.assign({}, {
    timestamp: Date.now(),
  }, metadata);

  return {
    meta,
    data: {
      action,
      payload,
    },
  };
};


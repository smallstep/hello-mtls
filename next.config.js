const path = require('path');

const common = require('./webpack/common');

module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules = [...config.module.rules, ...common.module.rules];
    return config;
  },
};

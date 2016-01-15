'use strict';

var
  tryRequire = require('tryrequire'),
  yaml = tryRequire('js-yaml'),
  _ = require('lodash'),
  utils = require('./utils');

var handler = module.exports;


handler.isAvailable = function isAvailable() {
  return yaml !== undefined;
};

handler.loadYaml = function (files) {
  if (handler.isAvailable()) {
    return utils.load(files, yaml.safeLoad);
  } else {
    utils.debuglog('js-yaml not installed; loadYaml transformer not operational');
    return function (config) {
      return _.noop(config);
    };
  }
};

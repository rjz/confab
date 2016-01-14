'use strict';

var fs = require('fs'),
  assign = require('object-assign'),
  debuglog = require('debug-log')('confab');

var utils = module.exports;

utils.debuglog = debuglog;

utils.fileExists = function fileExists(location) {
  try {
    fs.statSync(location);
    return true;
  } catch (err) {
    return false;
  }
};

utils.load = function load(files, parser) {
  files = files || [];
  if (typeof files === 'string') {
    files = [files];
  }

  return function (config) {
    var result = files.reduce(function (memo, file) {
      if (!memo && utils.fileExists(file)) {
        return file;
      }
      return memo;
    }, '');

    if (!result) {
      debuglog('No config available');
      return config;
    }

    return assign(config, parser(fs.readFileSync(result)));
  };
};

utils.getEnv = function getEnv(name, defaultValue) {
  return process.env[name] || defaultValue;
};

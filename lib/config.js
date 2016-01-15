'use strict';

var _ = require('lodash');


function Config(options) {
  options = options || {};

  this._data = {};
}

Config.create = function create(data, options) {
  var cfg = new Config(options);
  _.assign(cfg._data, data);
  return cfg;
};

Config.prototype.get = function get(property) {
  return _.get(this._data, property);
};

Config.prototype.has = function has(property) {
  return _.has(this._data, property);
};

Config.prototype.reset = function reset() {
  this._data = {};
};

Config.prototype.clone = function clone() {
  return _.cloneDeep(this._data);
};

module.exports = Config;

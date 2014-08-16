var fs = require('fs'),
    path = require('path');

var filters = require('./lib/filters');

/**
 * Reduce a list of filter functions to a configuration object
 *
 * @id confilter
 * @type Function
 * @param {Array} filters - a list of filter functions
 */
module.exports = function confilter (filters) {
  return filters.reduce(function (memo, fn) {
    return fn(memo);
  }, {});
};

// Extend with known filters
for (f in filters) {
  module.exports[f] = filters[f];
}


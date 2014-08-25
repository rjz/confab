var fs = require('fs'),
    path = require('path');

var filters = require('./lib/filters');

/**
 * Reduce a list of filter functions to a configuration object
 *
 *      var confilter = require('confilter');
 *      var config = confilter([
 *        confilter.loadJSON([
 *          './config.' + process.env.NODE_ENV + '.json',
 *          './config.json'
 *        ]),
 *
 *        confilter.defaults({
 *          role: 'api',
 *          port: 3200
 *        }),
 *      ]);
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


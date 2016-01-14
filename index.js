'use strict';

var assign = require('object-assign');
var Config = require('./lib/config');

/**
 * Build a configuration object from a list of transformations:
 *
 *      var confab = require('confab');
 *      var config = confab([
 *        confab.loadJSON([
 *          './config.' + process.env.NODE_ENV + '.json',
 *          './config.json'
 *        ]),
 *
 *        confab.defaults({
 *          role: 'api',
 *          port: 3200
 *        })
 *      ]);
 *
 * Later, access the configuration exactly as you would expect.
 *
 *      console.log(config.role); // 'api'
 *
 * @id confab
 * @type Function
 * @param {Array} transforms - a list of transformation functions
 */
module.exports = function confab (transforms) {
  transforms = transforms || [];
  return transforms.reduce(function (memo, fn) {
    return fn(memo);
  }, {});
};

assign(module.exports, require('./lib/transforms'));

module.exports.create = function create(transforms, options) {
    return Config.create(this(transforms), options);
};

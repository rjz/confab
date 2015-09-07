'use strict';

var fs = require('fs'),
    path = require('path');

var transforms = require('./lib/transforms');

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
  return transforms.reduce(function (memo, fn) {
    return fn(memo);
  }, {});
};

// Extend with known transforms
for (var f in transforms) {
  module.exports[f] = transforms[f];
}


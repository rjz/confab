Confilter
===============================================================================

Load and transform configuration files using chains of recycleable filters:

[![Build Status](https://travis-ci.org/rjz/confilter.png)](https://travis-ci.org/rjz/confilter)
[![Coverage Status](https://coveralls.io/repos/rjz/confilter/badge.png?branch=master)](https://coveralls.io/r/rjz/confilter?branch=master)

    var confilter = require('confilter');

    var config = confilter([
      confilter.loadJSON([
        './config.' + process.env.NODE_ENV + '.json',
        './config.json'
      ]),

      confilter.defaults({
        role: 'api',
        port: 3200
      }),
    ]);

### Custom Filters

Custom filters are functions that accept and return the config object. A silly
example from the test suite will multiply any numeric config values by two:

    function timesTwoFilter (config) {
      Object.keys(config).forEach(function (k) {
        if (typeof config[k] === 'number') config[k] *= 2;
      });
      return config;
    }

This filter can then be used like any other:

    var config = confilter([

      confilter.loadJSON([
        './config.json'
      ]),

      timesTwoFilter
    ]);


Installation
-------------------------------------------------------------------------------

    $ npm install confilter

Test
-------------------------------------------------------------------------------

Lint and run test suite:

    $ npm test

Generate code coverage report:

    $ npm run cover

License
-------------------------------------------------------------------------------

MIT


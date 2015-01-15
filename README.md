Confilter
===============================================================================

Load and transform configuration files using chains of recycleable filters:

[![Build Status](https://travis-ci.org/rjz/confab.png)](https://travis-ci.org/rjz/confab)
[![Coverage Status](https://coveralls.io/repos/rjz/confab/badge.png?branch=master)](https://coveralls.io/r/rjz/confab?branch=master)

    var confab = require('confab');

    var config = confab([
      confab.loadJSON([
        './config.' + process.env.NODE_ENV + '.json',
        './config.json'
      ]),

      confab.defaults({
        role: 'api',
        port: 3200
      }),
    ]);

[Reference](http://rjz.github.io/confab/#transformations)

### Custom transformations

Config transformations accept the config object and return it with any
modifications they need to make. A silly example from the test suite will
multiply any numeric config values by two:

    function transformTimesTwo (config) {
      Object.keys(config).forEach(function (k) {
        if (typeof config[k] === 'number') config[k] *= 2;
      });
      return config;
    }

This filter can then be used like any other:

    var config = confab([

      confab.loadJSON([
        './config.json'
      ]),

      transformTimesTwo
    ]);


Installation
-------------------------------------------------------------------------------

    $ npm install confab

Test
-------------------------------------------------------------------------------

Lint and run test suite:

    $ npm test

Generate code coverage report:

    $ npm run cover

License
-------------------------------------------------------------------------------

MIT


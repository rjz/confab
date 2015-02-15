Confab
===============================================================================

Build configuration objects from chains of recycleable transformations:

[![Build Status](https://travis-ci.org/rjz/confab.png)](https://travis-ci.org/rjz/confab)
[![Coverage Status](https://coveralls.io/repos/rjz/confab/badge.png?branch=master)](https://coveralls.io/r/rjz/confab?branch=master)

    // file: myapp.js
    var confab = require('confab');

    var config = confab([
      confab.loadEnvironment({
        PORT: 'port'
      }),

      confab.defaults({
        role: 'api',
        port: 4500
      }),
    ]);

    console.log(config);

With the environment and defaults applied, we see a nicely built configuration:

    $ PORT=3200 node myapp.js
    { role: 'api', port: '3200' }

Installation
-------------------------------------------------------------------------------

    $ npm install confab

Transformations
-------------------------------------------------------------------------------

Confab ships with transformations for:

  * Loading JSON configurations
  * Mapping environment variables to a configuration object
  * Providing default values
  * Marking required values
  * Locking down the configuration

Complete [reference](http://rjz.github.io/confab/#transforms).

### Custom transformations

Every transformation accepts the config object and returns it after any
modifications have been applied. A silly example from the test suite will
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


Test
-------------------------------------------------------------------------------

Lint and run test suite:

    $ npm test

Generate code coverage report:

    $ npm run cover

License
-------------------------------------------------------------------------------

MIT


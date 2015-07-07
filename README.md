Confab
===============================================================================

Build configuration objects from chains of recycleable transformations:

[![Build Status](https://travis-ci.org/rjz/confab.png)](https://travis-ci.org/rjz/confab)
[![Coverage Status](https://coveralls.io/repos/rjz/confab/badge.png?branch=master)](https://coveralls.io/r/rjz/confab?branch=master)

    // file: myapp.js
    'use strict';
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

Convention and Configuration
-------------------------------------------------------------------------------

Confab is configuration-first by nature, as the details of configuration may
vary widely from one project to the next. Nevertheless, the built-in
transformations reflect certain opinions.

Namely, configuration should be:

  * **separate**. Keeping configuration isolated from application logic eases
    deployment across multiple environments. Confab encourages developers to
    author complete configurations independent of the application.

  * **predictable**. Like any other exception, errors in configuration should be
    immediately fatal. All confab transformations will fail immediately if
    unexpected conditions are encountered, while the [`required`][confab-required]
    transformation can assert the presence of certain configuration keys.
    Similarly, the [`defaults`][confab-defaults] transformation--while
    unquestionably useful--should be approached with care.

  * **immutable**. The running application should not be concerned with
    configuration changes: if a change must be applied it should be applied to a
    new process. The [`freeze`][confab-freeze] transformation guarantees that a
    config will not change after initialization.

  * **simple**. File-based configs (JSON, YAML, etc.) make
    it easy to nest data inside multiple levels of keys. This is convenient for
    grouping like data, but it is not immediately clear how these data would map
    to (e.g.) environment variables or command-line arguments.
    Sub-configurations can enhance separation between unrelated concerns, but
    they should be used with care.

##### And one non-opinion

  * Command-line parsing, and what impact (if any) arguments should have on the
    configuration is left as a project-specific decision. No transformations
    are provided for command-line support--but you can write your own!

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

[confab-defaults]: http://rjz.github.io/confab/#transforms-defaults
[confab-required]: http://rjz.github.io/confab/#transforms-required
[confab-freeze]: http://rjz.github.io/confab/#transforms-freeze


var confab = require('../../index');

var config = confab([
  confab.loadEnvironment({
    'SOME_UNDEFINED_KEY': 'undefinedField',
    'SOME_AUTHOR': 'author'
  })
]);

process.stdout.write(JSON.stringify(config));

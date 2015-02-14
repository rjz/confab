// config.js
var confab = require('./index');
var envTransform = confab.mapEnvironment({
  'NODE_ENV': 'environment',
  'PORT': 'port'
});

module.exports = confab([envTransform]);

console.log(module.exports);


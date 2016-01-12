'use strict';

var fs = require('fs'),
  assign = require('object-assign'),
  yaml = require('js-yaml'),
  util = require('util'),
  deprecate = util.deprecate,
  debuglog = util.debuglog('confag');

var transforms = module.exports;

function fileExists(location) {
  try {
    fs.statSync(location);
    return true;
  } catch (err) {
    return false;
  }
}

function load(files, parser) {
  files = files || [];
  if (typeof files === 'string') {
    files = [files];
  }

  return function (config) {
    var result = files.reduce(function (memo, file) {
      if (!memo && fileExists(file)) {
        return file;
      }
      return memo;
    }, '');

    if (!result) {
      debuglog('No config available');
      return config;
    }

    return assign(config, parser(fs.readFileSync(result)));
  };
}

/**
 * Load a configuration from a list of candidate files.
 *
 * Extends the configuration with the contents of the configuration file at the
 * first matched `path`, falling back to subsequent `path`s if the first cannot
 * be found.
 *
 *     var loadJSONTransform = confab.loadJSON([
 *      './config.json',
 *       __dirname + '/config.json',
 *       process.env.HOME + '/config.json'
 *     ]);
 *
 * @id loadJSON
 * @group transforms
 * @type Function
 * @param {Array|String} paths - one or more paths to search for an appropriate
 *   config file
 * @return Function
 */
transforms.loadJSON = function (files) {
  return load(files, JSON.parse);
};

/**
 * Load a configuration from a list of candidate files.
 *
 * Extends the configuration with the contents of the configuration file at the
 * first matched `path`, falling back to subsequent `path`s if the first cannot
 * be found.
 *
 *     var loadYamlTransform = confab.loadYaml([
 *      './config.yaml',
 *       __dirname + '/config.yml',
 *       process.env.HOME + '/config.yaml'
 *     ]);
 *
 * @id loadYaml
 * @group transforms
 * @type Function
 * @param {Array|String} paths - one or more paths to search for an appropriate
 *   config file
 * @return Function
 */
transforms.loadYaml = function (files) {
  return load(files, yaml.safeLoad);
};

/**
 * Map environment variables (if set) to keys in the config. Unset variables are
 * ignored.
 *
 *     var envTransform = confab.loadEnvironment({
 *       'NODE_ENV': 'environment',
 *       'PORT': 'port'
 *     });
 *
 * @id loadEnvironment
 * @group transforms
 * @type Function
 * @param {Object} map - a list of environment variables to map to config keys
 * @param {Object} options - a list of options.
 * @return Function
 */
transforms.loadEnvironment = function (map, opts) {
  map = map || {};
  opts = opts || {};

  function translate(val) {
    try {
      return JSON.parse(val);
    } catch (e) {
      debuglog('translate error: ', e);
      return val;
    }
  }

  return function (config) {
    Object.keys(map).forEach(function (key) {
      if (process.env.hasOwnProperty(key)) {
        config[map[key]] = translate(process.env[key]);
      }
    });

    return config;
  };
};

transforms.mapEnvironment = deprecate(function (map) {  // jshint ignore:line
  return transforms.loadEnvironment.apply(this, arguments);
}, 'mapEnvironment is deprecated; please use loadEnvironment instead');

/**
 * Merge an object with the existing config, replacing any existing keys with
 * the `assign`-ed values.
 *
 *     var envTransform = confab.assign({
 *       port: '1492'
 *     });
 *
 * @id assign
 * @group transforms
 * @type Function
 * @param {Object} obj - an object to merge into the config
 * @param {Object} obj2... - additional objects to merge into the config
 * @return Function
 */
transforms.assign = function (obj) { // jshint ignore:line

  var objects = [].concat([].slice.call(arguments));

  return function (config) {
    return assign.apply(null, [config].concat(objects));
  };
};

/**
 * List required config fields and throw a `ReferenceError` with a list of any
 * missing fields. If all fields are present, `required` acts as a pass-through.
 *
 * @id required
 * @group transforms
 * @type Function
 * @param {Array} required - the names of required fields in the config
 * @return Function
 */
transforms.required = function (fields) {
  fields = fields || [];

  return function (config) {
    var missing = fields.filter(function (key) {
      return !config[key];
    });

    if (missing.length) {
      throw new ReferenceError('Missing required fields: ' + missing.join(', '));
    }

    return config;
  };
};

/**
 * Fill in any missing values in config with specified defaults
 *
 *     var defaultsTransform = confab.defaults({
 *       port: 3200,
 *       logLevel: 'debug'
 *     });
 *
 * @id defaults
 * @group transforms
 * @type Function
 * @param {Object} defaults - default values to fill into the config
 * @param {Boolean} warn - (Optional) print warning to `stdout` when a default
 *   value is being used
 * @return Function
 */
transforms.defaults = function (defaults, warn) {
  defaults = defaults || {};

  return function (config) {
    Object.keys(defaults).forEach(function (key) {
      if (!config.hasOwnProperty(key)) {
        if (warn) {
          console.warn('Using default value for config: ' + key);
        }
        config[key] = defaults[key];
      }
    });
    return config;
  };
};

/**
 * Freeze the config (hint: run this transformation last!)
 *
 * @id freeze
 * @group transforms
 * @type Function
 * @return Function
 */
transforms.freeze = function () {
  return function (config) {
    return Object.freeze(config);
  };
};

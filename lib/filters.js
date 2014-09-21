var fs = require('fs'),
    path = require('path');

var filters = module.exports;

/**
 * Load a configuration from a list of candidate files.
 *
 * Attempts to load a configuration file from the list of locations. Throws a
 * `ReferenceError` if configuration cannot be loaded from any of the specified
 * paths.
 *
 *     var loadJSONFilter = confilter.loadJSON([
 *      './config.json',
 *       __dirname + '/config.json',
 *       process.env.HOME + '/config.json',
 *     ]);
 *
 * @id loadJSON
 * @group filters
 * @type Function
 * @param {Array|String} paths - one or more paths to search for an appropriate
 *   config file
 * @return Function
 */
filters.loadJSON = function (files) {
  if (files instanceof String) {
    files = [files];
  }

  return function (config) {
    var result = files.reduce(function (memo, file) {
      if (!memo && fs.existsSync(file)) return file;
      return memo;
    }, '');

    if (!result) throw new ReferenceError('No config available');

    try {
      return JSON.parse(fs.readFileSync(result));
    }
    catch (e) {
      throw e;
    }
  };
};

/**
 * Map environment variables (if available) to keys in the config.
 *
 *     var envFilter = confilter.mapEnvironment({
 *       'NODE_ENV': 'environment',
 *       'PORT': 'port'
 *     });
 *
 * @id mapEnvironment
 * @group filters
 * @type Function
 * @param {Object} map - a list of environment variables to map to config keys
 * @return Function
 */
filters.mapEnvironment = function (map) {
  if (!map) throw new ReferenceError('Nothing to map');

  return function (config) {
    for (key in map) {
      if (process.env.hasOwnProperty(key)) {
        config[map[key]] = process.env[key];
      }
    }

    return config;
  };
};

/**
 * List required config fields and throw a `ReferenceError` with a list of any
 * missing fields. If all fields are present, `required` acts as a pass-through.
 *
 * @id required
 * @group filters
 * @type Function
 * @param {Array} required - the names of required fields in the config
 * @return Function
 */
filters.required = function (fields) {
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
 *     var defaultsFilter = confilter.defaults({
 *       port: 3200,
 *       logLevel: 'debug'
 *     });
 *
 * @id defaults
 * @group filters
 * @type Function
 * @param {Object} defaults - default values to fill into the config
 * @param {Boolean} warn - (Optional) print warning to `stdout` when a default
 *   value is being used
 * @return Function
 */
filters.defaults = function (defaults, warn) {
  return function (config) {
    Object.keys(defaults).forEach(function (key) {
      if (!config[key]) {
        if (warn) {
          process.stdout.write('Using default value for config.' + key + '\n');
        }
        config[key] = defaults[key];
      }
    });
    return config;
  };
};

/**
 * Freeze the config (hint: run this filter last!)
 *
 * @id freeze
 * @group filters
 * @type Function
 * @return Function
 */
filters.freeze = function () {
  return function (config) {
    Object.freeze(config);
    return config;
  }
};


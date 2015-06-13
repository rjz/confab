var fs = require('fs'),
    path = require('path'),
    deprecate = require('util').deprecate;

function extend (obj) {
  [].slice.call(arguments, 1).forEach(function(source) {
    if (source) {
      Object.keys(source).forEach(function (k) {
        obj[k] = source[k];
      });
    }
  });
  return obj;
}

function isString (obj) {
  return typeof obj === 'string';
}

var transforms = module.exports;

/**
 * Load a configuration from a list of candidate files.
 *
 * Extends the configuration with the contents of the configuration file at the
 * first matched `path`, falling back to subsequent `path`s if the first cannot
 * be found. Throws a `ReferenceError` if none of the specified paths are
 * matched.
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
  if (isString(files)) {
    files = [files];
  }

  return function (config) {
    var result = files.reduce(function (memo, file) {
      if (!memo && fs.existsSync(file)) return file;
      return memo;
    }, '');

    if (!result) throw new ReferenceError('No config available');

    try {
      return extend(config, JSON.parse(fs.readFileSync(result)));
    }
    catch (e) {
      throw e;
    }
  };
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
 * @return Function
 */
transforms.loadEnvironment = function (map) {

  if (!map) throw new ReferenceError('Nothing to map');

  return function (config) {
    Object.keys(map).forEach(function (key) {
      if (process.env.hasOwnProperty(key)) {
        config[map[key]] = process.env[key];
      }
    });

    return config;
  };
};

transforms.mapEnvironment = function (map) {
  deprecate('mapEnvironment is deprecated; please use loadEnvironment instead');
  return transforms.loadEnvironment.apply(this, arguments);
};

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
transforms.assign = function (obj) {

  var objects = [].concat([].slice.call(arguments));

  if (objects.length < 1) throw new Error('No objects merged!');

  return function (config) {
    return extend.apply(null, [config].concat(objects));
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
 * Freeze the config (hint: run this transformation last!)
 *
 * @id freeze
 * @group transforms
 * @type Function
 * @return Function
 */
transforms.freeze = function () {
  return function (config) {
    Object.freeze(config);
    return config;
  }
};


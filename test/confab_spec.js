'use strict';

var _ = require('lodash');
var assign = require('object-assign');
var path = require('path');

var confab = require(path.resolve(__dirname, '../index'));

function populate(val) {
  return function () {
    return val;
  };
}

function jsonFixturePath(name) {
  return path.join(__dirname, 'fixtures', name + '.json');
}

function yamlFixturePath(name) {
  return path.join(__dirname, 'fixtures', name + '.yml');
}

var applyTimesTwo = function (config) {
  Object.keys(config).forEach(function (k) {
    if (typeof config[k] === 'number') config[k] *= 2;
  });

  return config;
};


describe('#confab', function () {

  it('no inputs results in empty object', function () {
    expect(confab()).toEqual({});
  });

  it('starts out empty', function () {
    expect(confab([])).toEqual({});
  });

  it('applies transforms to an object', function () {
    expect(confab([
      populate({
        a: 4
      }),
      applyTimesTwo
    ]).a).toEqual(8);
  });

  describe('#transforms.loadJSON', function () {

    it('passing in no files gets empty object', function () {
      var config = confab([
        confab.loadJSON()
      ]);
      expect(config).toEqual({});
    });

    it('has right author', function () {
      var config = confab([
        confab.loadJSON([
          jsonFixturePath('test')
        ])
      ]);
      expect(config.author).toEqual('Lewis Carroll');
    });

    it('accepts a single file as a string', function () {
      var config = confab([
        confab.loadJSON(jsonFixturePath('test'))
      ]);
      expect(config.author).toEqual('Lewis Carroll');
    });

    it('skips missing files', function () {
      var config = confab([
        confab.loadJSON([
          jsonFixturePath('missing'),
          jsonFixturePath('test')
        ])
      ]);
      expect(config.author).toEqual('Lewis Carroll');
    });

    it('throws when config is not parseable', function () {
      expect(function () {
        confab([
          confab.loadJSON(jsonFixturePath('invalid'))
        ]);
      }).toThrow();
    });

    it('does not clobber existing config', function () {
      var config = confab([
        confab.assign({
          'extra': 'anything'
        }),
        confab.loadJSON(jsonFixturePath('test'))
      ]);

      expect(config.extra).toEqual('anything');
    });

  });

  describe('#transforms.loadYaml', function () {

    it('passing in no files gets empty object', function () {
      var config = confab([
        confab.loadYaml()
      ]);
      expect(config).toEqual({});
    });

    it('has right author', function () {
      var config = confab([
        confab.loadYaml([
          yamlFixturePath('test')
        ])
      ]);
      expect(config.author).toEqual('Lewis Carroll');
    });

    it('accepts a single file as a string', function () {
      var config = confab([
        confab.loadYaml(yamlFixturePath('test'))
      ]);
      expect(config.author).toEqual('Lewis Carroll');
    });

    it('skips missing files', function () {
      var config = confab([
        confab.loadYaml([
          yamlFixturePath('missing'),
          yamlFixturePath('test')
        ])
      ]);
      expect(config.author).toEqual('Lewis Carroll');
    });

    it('throws when config is not parseable', function () {
      expect(function () {
        confab([
          confab.loadYaml(yamlFixturePath('invalid'))
        ]);
      }).toThrow();
    });

    it('does not clobber existing config', function () {
      var config = confab([
        confab.assign({
          'extra': 'anything'
        }),
        confab.loadYaml(yamlFixturePath('test'))
      ]);

      expect(config.extra).toEqual('anything');
    });

  });

  describe('#transforms.loadEnvironment', function () {
    var prevEnv;

    beforeEach(function () {
      prevEnv = _.cloneDeep(process.env);
    });

    it('calling without empty results in empty object', function () {
      var config = confab([
        confab.loadEnvironment()
      ]);
      expect(config).toEqual({});
    });

    it('maps it', function () {
      var env = {
        SOME_AUTHOR: 'Ernest Hemingway'
      };
      assign(process.env, env);

      var config = confab([
        confab.loadEnvironment({
          'SOME_UNDEFINED_KEY': 'undefinedField',
          'SOME_AUTHOR': 'author',
          'SOME_BOOLEAN_KEY': 'booleanKey'
        })
      ]);
      expect(config.author).toEqual('Ernest Hemingway');
    });

    it('does not clobber undefined params', function () {
      var config = confab([
        confab.loadEnvironment({
          'SOME_UNDEFINED_KEY': 'undefinedField',
          'SOME_AUTHOR': 'author',
          'SOME_BOOLEAN_KEY': 'booleanKey'
        })
      ]);
      expect(config.undefinedField).toBeUndefined();
    });

    it('resolves booleans on request', function () {
      var env = {
        SOME_BOOLEAN_KEY: 'true'
      };
      assign(process.env, env);

      var config = confab([
        confab.loadEnvironment({
          'SOME_UNDEFINED_KEY': 'undefinedField',
          'SOME_AUTHOR': 'author',
          'SOME_BOOLEAN_KEY': 'booleanKey'
        })
      ]);

      expect(config.booleanKey).toBe(true);
    });

    it('verify deprecate message when using legacy mapEnvironment', function () {
      spyOn(console, 'error');
      var config = confab([
        confab.mapEnvironment()
      ]);
      expect(config).toEqual({});
      expect(console.error).toHaveBeenCalled();
    });

    afterEach(function () {
      process.env = prevEnv;
    });

  });

  describe('#transforms.assign', function () {

    var config;

    beforeEach(function () {
      config = confab([
        populate({
          a: 4,
          isClobbered: false
        }),

        confab.assign({
          assigned: 'value',
          isClobbered: true
        }, {
          secondObject: true
        })
      ]);
    });

    it('adds the passed object', function () {
      expect(config.assigned).toEqual('value');
    });

    it('retains existing keys', function () {
      expect(config.a).toEqual(4);
    });

    it('clobbers duplicate keys', function () {
      expect(config.isClobbered).toBe(true);
    });

    it('assigns multiple objects', function () {
      expect(config.secondObject).toBe(true);
    });

  });

  describe('#transforms.required', function () {

    it('throws on missing field', function () {
      expect(function () {
        confab([
          confab.loadJSON(jsonFixturePath('test')),
          confab.required(['foo'])
        ]);
      }).toThrow();
    });

    it('passes when field is present', function () {
      expect(function () {
        confab([
          confab.loadJSON(jsonFixturePath('test')),
          confab.required(['author'])
        ]);
      }).not.toThrow();
    });

    it('passes when field list not provided', function () {
      expect(function () {
        confab([
          confab.loadJSON(jsonFixturePath('test')),
          confab.required()
        ]);
      }).not.toThrow();
    });

  });

  describe('#transforms.defaults', function () {

    var config = confab([
      confab.loadJSON(jsonFixturePath('test')),
      confab.assign({
        untrue: false
      }),
      confab.defaults({
        foo: 'bar',
        untrue: true
      })
    ]);

    it('fills in missing values', function () {
      expect(config.foo).toEqual('bar');
    });

    it('does not clobber falsy params', function () {
      expect(config.untrue).toBe(false);
    });

    it('empty defaults and empty config results in empty object', function () {
      expect(confab([confab.defaults()])).toEqual({});
    });

    it('warn the use of defaults', function () {
      spyOn(console, 'warn');

      confab([
        confab.loadJSON(jsonFixturePath('test')),
        confab.assign({
          untrue: false
        }),
        confab.defaults({
          foo: 'bar',
          untrue: true
        }, true)
      ]);

      expect(console.warn).toHaveBeenCalled();

    });

  });

  describe('#transforms.freeze', function () {

    it('freezes the results', function () {
      var config = confab([
        populate({
          a: 4
        }),
        applyTimesTwo,
        confab.freeze()
      ]);

      expect(function () {
        config.a = '14';
      }).toThrowError(TypeError);
    });

  });

});

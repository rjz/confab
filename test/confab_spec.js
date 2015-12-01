'use strict';

var assert = require('assert');
var exec = require('child_process').exec;
var path = require('path');

var confab = require(path.resolve(__dirname, '../index'));

function populate (val) {
  return function () {
    return val;
  };
}

function jsonFixturePath (name) {
  return path.join(__dirname, 'fixtures', name + '.json');
}

describe('confab', function () {

  var applyTimesTwo = function (config) {
    Object.keys(config).forEach(function (k) {
      if (typeof config[k] === 'number') config[k] *= 2;
    });

    return config;
  };

  it('starts out empty', function () {
    assert.deepEqual(confab([]), {});
  });

  it('applies transforms to an object', function () {
    assert.equal(confab([
      populate({ a: 4 }),
      applyTimesTwo
    ]).a, 8);
  });

  describe('transforms.loadJSON', function () {

    it('has right author', function () {
      var config = confab([
        confab.loadJSON([
          jsonFixturePath('test')
        ])
      ]);
      assert.equal(config.author, 'Lewis Carroll');
    });

    it('accepts a single file as a string', function () {
      var config = confab([
        confab.loadJSON(jsonFixturePath('test'))
      ]);
      assert.equal(config.author, 'Lewis Carroll');
    });

    it('skips missing files', function () {
      var config = confab([
        confab.loadJSON([
          jsonFixturePath('missing'),
          jsonFixturePath('test')
        ])
      ]);
      assert.equal(config.author, 'Lewis Carroll');
    });

    it('throws when no config is available', function () {
      assert.throws(function () {
        confab([
          confab.loadJSON(jsonFixturePath('missing'))
        ]);
      });
    });

    it('throws when config is not parseable', function () {
      assert.throws(function () {
        confab([
          confab.loadJSON(jsonFixturePath('invalid'))
        ]);
      });
    });

    it('does not clobber existing config', function () {
      var config = confab([
        confab.assign({ "extra": "anything" }),
        confab.loadJSON(jsonFixturePath('test'))
      ]);

      assert.equal(config.extra, "anything");
    });
  });

  describe('transforms.loadEnvironment', function () {

    function execTestAppWithEnv (env, callback) {
      var testAppPath = path.resolve(__dirname, 'fixtures/app.js');
      var opts = { env: env };
      exec('node ' + testAppPath, opts, function (err, stdout) {
        var config;

        if (err) return callback(err);

        try {
          config = JSON.parse(stdout);
        }
        catch (e) {
          console.error('Failed parsing stdout:', stdout);
          return callback(e);
        }

        callback(null, config);
      });
    }

    it('throws when no map is specified', function () {
      assert.throws(function () {
        confab([
          confab.loadEnvironment()
        ]);
      });
    });

    it('maps it', function (done) {
      var env = { SOME_AUTHOR: 'Ernest Hemingway' };
      execTestAppWithEnv(env, function (err, config) {
        if (err) return done(err);
        assert.equal(config.author, 'Ernest Hemingway');
        done();
      });
    });

    it('does not clobber undefined params', function (done) {
      execTestAppWithEnv({}, function (err, config) {
        if (err) return done(err);
        assert.equal(config.undefinedField, undefined);
        done();
      });
    });
  });

  describe('transforms.assign', function () {

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
      assert.equal(config.assigned, 'value');
    });

    it('retains existing keys', function () {
      assert.equal(config.a, 4);
    });

    it('clobbers duplicate keys', function () {
      assert.equal(config.isClobbered, true);
    });

    it('assigns multiple objects', function () {
      assert.equal(config.secondObject, true);
    });

    it('throws if no object is supplied', function () {
      assert.throws(function () {
        config = confab([
          confab.assign()
        ]);
      });
    });
  });

  describe('transforms.required', function () {

    it('throws on missing field', function () {
      assert.throws(function () {
        confab([
          confab.loadJSON(jsonFixturePath('test')),
          confab.required(['foo'])
        ]);
      });
    });

    it('passes when field is present', function () {
      assert.doesNotThrow(function () {
        confab([
          confab.loadJSON(jsonFixturePath('test')),
          confab.required(['author'])
        ]);
      });
    });
  });

  describe('transforms.defaults', function () {
    var config = confab([
      confab.loadJSON(jsonFixturePath('test')),
      confab.assign({ untrue: false }),
      confab.defaults({
        foo: 'bar',
        untrue: true
      })
    ]);

    it('fills in missing values', function () {
      assert.equal(config.foo, 'bar');
    });

    it('does not clobber falsy params', function () {
      assert.equal(config.untrue, false);
    });
  });

  describe('transforms.freeze', function () {
    it('freezes the results', function () {
      var config = confab([
        populate({ a: 4 }),
        applyTimesTwo,
        confab.freeze()
      ]);

      assert.throws(function () {
        config.a = '14';
      }, TypeError);
    });
  });
});


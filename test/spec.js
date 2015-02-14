var assert = require('assert');

var confab = require('../index');

describe('confab', function () {

  var populateConfig = function (config) {
    return { a: 4 };
  };

  var applyTimesTwo = function (config) {
    Object.keys(config).forEach(function (k) {
      if (typeof config[k] === 'number') config[k] *= 2;
    });

    return config;
  };

  it('applies transforms to an object', function () {
    assert.equal(confab([
      populateConfig,
      applyTimesTwo
    ]).a, 8);
  });

  describe('transforms.loadJSON', function () {

    it('has right author', function () {
      var config = confab([
        confab.loadJSON([__dirname + '/test.json'])
      ]);
      assert.equal(config.author, 'Lewis Carroll');
    });

    it('skips missing files', function () {
      var config = confab([
        confab.loadJSON([
          __dirname + '/missing.json',
          __dirname + '/test.json'
        ])
      ]);
      assert.equal(config.author, 'Lewis Carroll');
    });

    it('throws when no config is available', function () {
      assert.throws(function () {
        confab([
          confab.loadJSON([
            __dirname + '/missing.json'
          ])
        ]);
      });
    });
  });

  describe('transforms.mapEnvironment', function () {

    it('maps it', function () {

      var config = confab([
        confab.mapEnvironment({
          'SOME_AUTHOR': 'author'
        })
      ]);

      assert.equal(config.author, 'Ernest Hemingway');
    });

    it('throws when no map is specified', function () {
      assert.throws(function () {
        confab([
          confab.mapEnvironment()
        ]);
      });
    });
  });



  describe('transforms.required', function () {

    it('throws on missing field', function () {
      assert.throws(function () {
        confab([
          confab.loadJSON([__dirname + '/test.json']),
          confab.required(['foo'])
        ]);
      });
    });

    it('passes when field is present', function () {
      assert.doesNotThrow(function () {
        confab([
          confab.loadJSON([__dirname + '/test.json']),
          confab.required(['author'])
        ]);
      });
    });
  });

  describe('transforms.defaults', function () {
    var config = confab([
      confab.loadJSON([__dirname + '/test.json']),
      confab.defaults({
        foo: 'bar'
      })
    ]);

    it('fills in missing values', function () {
      assert.equal(config.foo, 'bar')
    });
  });

  describe('transforms.freeze', function () {
    it('freezes the results', function () {
      'use strict'

      var config = confab([
        populateConfig,
        applyTimesTwo,
        confab.freeze()
      ]);

      assert.throws(function () {
        config.a = '14';
      }, TypeError);
    });
  });
});


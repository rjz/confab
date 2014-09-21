var assert = require('assert');

var confilter = require('../index');

describe('confilter', function () {

  var aFilter = function (config) {
    return { a: 4 };
  };

  var timesTwoFilter = function (config) {
    Object.keys(config).forEach(function (k) {
      if (typeof config[k] === 'number') config[k] *= 2;
    });

    return config;
  };

  it('applies filters to an object', function () {
    assert.equal(confilter([
      aFilter,
      timesTwoFilter
    ]).a, 8);
  });

  describe('filters.loadJSON', function () {

    it('has right author', function () {
      var config = confilter([
        confilter.loadJSON([__dirname + '/test.json'])
      ]);
      assert.equal(config.author, 'Lewis Carroll');
    });

    it('skips missing files', function () {
      var config = confilter([
        confilter.loadJSON([
          __dirname + '/missing.json',
          __dirname + '/test.json'
        ])
      ]);
      assert.equal(config.author, 'Lewis Carroll');
    });

    it('throws when no config is available', function () {
      assert.throws(function () {
        confilter([
          confilter.loadJSON([
            __dirname + '/missing.json'
          ])
        ]);
      });
    });
  });

  describe('filters.mapEnvironment', function () {

    it('maps it', function () {

      var config = confilter([
        confilter.mapEnvironment({
          'SOME_AUTHOR': 'author'
        })
      ]);

      assert.equal(config.author, 'Ernest Hemingway');
    });

    it('throws when no map is specified', function () {
      assert.throws(function () {
        confilter([
          confilter.mapEnvironment()
        ]);
      });
    });
  });



  describe('filters.required', function () {

    it('throws on missing field', function () {
      assert.throws(function () {
        confilter([
          confilter.loadJSON([__dirname + '/test.json']),
          confilter.required(['foo'])
        ]);
      });
    });

    it('passes when field is present', function () {
      assert.doesNotThrow(function () {
        confilter([
          confilter.loadJSON([__dirname + '/test.json']),
          confilter.required(['author'])
        ]);
      });
    });
  });

  describe('filters.defaults', function () {
    var config = confilter([
      confilter.loadJSON([__dirname + '/test.json']),
      confilter.defaults({
        foo: 'bar'
      })
    ]);

    it('fills in missing values', function () {
      assert.equal(config.foo, 'bar')
    });
  });

  describe('filters.freeze', function () {
    it('freezes the results', function () {
      'use strict'

      var config = confilter([
        aFilter,
        timesTwoFilter,
        confilter.freeze()
      ]);

      assert.throws(function () {
        config.a = '14';
      }, TypeError);
    });
  });
});


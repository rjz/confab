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
    var stuff = confilter([confilter.loadJSON([__dirname + '/test.json'])]);

    it('has right author', function () {
      assert.equal(stuff.author, 'Lewis Carroll');
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


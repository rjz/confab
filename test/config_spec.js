'use strict';

var path = require('path');
var Config = require(path.resolve(__dirname, '../lib/config'));


describe('config', function () {
  var cfg;

  beforeAll(function () {
    cfg = Config.create({
      a: 1,
      b: 'xyz',
      fun: null,
      sample: {
        x: 'three',
        y: [{
          d: 3,
          f: 5
        }, {
          temp: 'value'
        }]
      }
    });
  });

  describe('#create', function () {

    it('data no options', function () {
      var myCfg = Config.create({
        a: 1
      });
      expect(myCfg).toBeDefined();
      expect(myCfg.get).toBeDefined();
      expect(myCfg.has).toBeDefined();
      expect(myCfg.clone).toBeDefined();
      expect(myCfg.reset).toBeDefined();
    });

    it('data with options', function () {
      var myCfg = Config.create({
        a: 1
      }, {});
      expect(myCfg).toBeDefined();
      expect(myCfg.get).toBeDefined();
      expect(myCfg.has).toBeDefined();
      expect(myCfg.clone).toBeDefined();
      expect(myCfg.reset).toBeDefined();
    });

  });

  describe('#get', function () {

    it('no property', function () {
      expect(cfg.get()).toBeUndefined();
    });

    it('attribute not found', function () {
      expect(cfg.get('mine')).toBeUndefined();
    });

    it('attribute found and value is null', function () {
      expect(cfg.get('fun')).toBeNull();
    });

    it('attriute found with value', function () {
      expect(cfg.get('b')).toEqual('xyz');
    });

    it('attribute with dot notation', function () {
      expect(cfg.get('sample.y[1].temp')).toEqual('value');
    });

  });

  describe('#has', function () {

    it('no property', function () {
      expect(cfg.has()).toBe(false);
    });

    it('attribute not found', function () {
      expect(cfg.has('mine')).toBe(false);
    });

    it('attribute found and value is null', function () {
      expect(cfg.has('fun')).toBe(true);
    });

    it('attriute found with value', function () {
      expect(cfg.has('b')).toBe(true);
    });

    it('attribute with dot notation', function () {
      expect(cfg.has('sample.y[1].temp')).toBe(true);
    });

  });

  describe('#clone', function () {

    it('no data', function () {
      var myCfg = Config.create();
      expect(myCfg.clone()).toEqual({});
    });

    it('multiple levels of data', function () {
      expect(cfg.clone()).toEqual({
        a: 1,
        b: 'xyz',
        fun: null,
        sample: {
          x: 'three',
          y: [{
            d: 3,
            f: 5
          }, {
            temp: 'value'
          }]
        }
      });
    });

  });

  describe('#reset', function () {

    it('successful', function () {
      var myCfg = Config.create({
        a: 1,
        b: 'xyz'
      });

      expect(myCfg.get('b')).toEqual('xyz');
      myCfg.reset();
      expect(myCfg.has('a')).toBe(false);
    });

  });

});

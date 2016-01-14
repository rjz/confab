'use strict';

var path = require('path');

var confab = require(path.resolve(__dirname, '../index'));
var yaml = require(path.resolve(__dirname, '../lib/yaml'));

function yamlFixturePath(name) {
  return path.join(__dirname, 'fixtures', name + '.yml');
}

describe('confab-yaml', function () {

  describe('#loadYaml', function () {

    it('passing in no files gets empty object', function () {
      var config = confab([
        confab.loadYaml()
      ]);
      if (yaml.isAvailable()) {
        expect(config).toEqual({});
      } else {
        expect(config).toBeUndefined();
      }
    });

    it('has right author', function () {
      var config = confab([
        confab.loadYaml([
          yamlFixturePath('test')
        ])
      ]);
      if (yaml.isAvailable()) {
        expect(config.author).toEqual('Lewis Carroll');
      } else {
        expect(config).toBeUndefined();
      }
    });

    it('accepts a single file as a string', function () {
      var config = confab([
        confab.loadYaml(yamlFixturePath('test'))
      ]);
      if (yaml.isAvailable()) {
        expect(config.author).toEqual('Lewis Carroll');
      } else {
        expect(config).toBeUndefined();
      }
    });

    it('skips missing files', function () {
      var config = confab([
        confab.loadYaml([
          yamlFixturePath('missing'),
          yamlFixturePath('test')
        ])
      ]);
      if (yaml.isAvailable()) {
        expect(config.author).toEqual('Lewis Carroll');
      } else {
        expect(config).toBeUndefined();
      }
    });

    it('throws when config is not parseable', function () {
      var shouldThrow = function () {
        confab([
          confab.loadYaml(yamlFixturePath('invalid'))
        ]);
      };

      if (yaml.isAvailable()) {
        expect(shouldThrow).toThrow();
      } else {
        expect(shouldThrow).not.toThrow();
      }
    });

    it('does not clobber existing config', function () {
      var config = confab([
        confab.assign({
          'extra': 'anything'
        }),
        confab.loadYaml(yamlFixturePath('test'))
      ]);
      if (yaml.isAvailable()) {
        expect(config.extra).toEqual('anything');
      } else {
        expect(config).toBeUndefined();
      }
    });

  });

});
var path = require('path'),
    fs = require('fs');

function fatalOr (orElse) {
  return function (err, result) {
    if (err) {
      process.stderr.write(err.toString() + '\n');
      process.exit(1);
    }
    else {
      orElse.apply(this, [].slice.call(arguments, 1));
    }
  }
}

// Generate documentation
//
//    $ npm run-script docs
//
module.exports.docs = function () {

  var glob = require('glob'),
      hogan = require('hogan.js'),
      scrawl = require('scrawl');

  // TODO: make this (much) more generic
  var files = {};

  ['index', 'lib/filters'].forEach(function (path) {
    files[path] = scrawl.parse(fs.readFileSync('./' + path + '.js', 'utf8'));
  });


  var packageJson = require(path.resolve(__dirname, '../package.json'));

  glob(path.resolve(__dirname, './*.hogan'), fatalOr(function (templateFiles) {

    var templates = templateFiles.reduce(function (ts, f) {
      var name = path.basename(f, '.hogan');
      ts[name] = hogan.compile(fs.readFileSync(f, 'utf8'));
      return ts;
    }, {});

    var tmpl = templates['template'].render({
      files       : files,
      repository  : packageJson.repository.url,
      name        : packageJson.name,
      description : packageJson.description
    }, templates);

    if (!fs.existsSync('./docs')) {
      fs.mkdirSync('./docs');
    }

    fs.createReadStream(__dirname + '/style.css')
      .pipe(fs.createWriteStream('./docs/style.css'));

    fs.writeFileSync('./docs/index.html', tmpl);
  }));
};


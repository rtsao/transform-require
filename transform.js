'use strict';

var filename = process.argv[2];

var fs = require('fs');
var assign = require('object-assign');
var multipipe = require('multipipe');
var through2 = require('through2');
var mdeps = require('module-deps');
var resolve = require('resolve');

function transpile(filename) {
  var source = fs.createReadStream(filename);

  var retStream = through2();

  getPackage(filename, function(err, pkg) {
    var transformers = getTransformers(pkg['__dirname'], pkg.browserify);

    if (transformers.length === 0) {
      source.pipe(retStream);
      return;
    }

    var transform = transformers.map(function (tr) {
      // clone the options so that userland transforms can't mutate
      var transformOpts = assign({}, tr[1])
      return tr[0](filename, transformOpts);
    });

    multipipe.apply(null,
      [ source ].concat(transform)
    ).pipe(retStream);

  });

  return retStream;
}

transpile(filename).pipe(process.stdout);

function getPackage(filename, cb) {
  var md = mdeps();
  md.lookupPackage(filename, cb);
}

// -> fn(err, [ [ transformFn, transformOpts ] ])
function getTransformers (cwd, opts) {
  var transforms = [].concat(opts.transform).filter(Boolean)
  return transforms.map(function (item) {
    // support [ 'brfs', {} ] and 'brfs'
    var transform
    var transformOpts = {}
    if (Array.isArray(item)) {
      transform = item[0]
      transformOpts = item[1] || {}
    } else {
      transform = item
    }
    if (typeof transform === 'string') {
      // resolve module names like in browserify
      var file = resolve.sync(transform, {
        basedir: cwd
      })
      transform = require(file)
      if (typeof transform !== 'function') {
        throw new Error(
          'Transform at ' + file + ' must export a function'
        )
      }
    } else if (typeof transform !== 'function') {
      throw new Error(
        'Expected string or function for transform, got ' + item
      )
    }
    return [ transform, transformOpts ]
  });
}

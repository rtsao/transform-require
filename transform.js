'use strict';

var filename = process.argv[2];

var fs = require('fs');
var assign = require('object-assign');
var multipipe = require('multipipe');
var lowercase = require('./lowercase');

var transformers = [[lowercase, {}]];

function transpile(filename) {
  var source = fs.createReadStream(filename)
  if (transformers.length === 0) {
    return source;
  }

  var transform = transformers.map(function (tr) {
    // clone the options so that userland transforms can't mutate
    var transformOpts = assign({}, tr[1])
    return tr[0](filename, transformOpts)
  })

  return multipipe.apply(null,
    [ source ].concat(transform)
  )
}

transpile(filename).pipe(process.stdout);

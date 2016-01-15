'use strict';

var execFileSync = require('exec-file-sync');
var path = require('path');

var cwd = process.cwd();

var oldHandlers = {};

function attachHook(extension) {
  oldHandlers[extension] = require.extensions[extension];
  var old = oldHandlers[extension] || oldHandlers['.js'] || require.extensions['.js'];

  require.extensions[extension] = function hook(m, filename) {
    var handler = shouldIgnore(filename) ? old : function(m, filename) {
      console.log('woah', filename);
      var result = execFileSync('node', ['transform.js', filename], {cwd: __dirname}).toString();
      return m._compile(result, filename);
    };

    return handler(m, filename);
  };
}

module.exports = attachHook;

function getRelativePath(filename){
  return path.relative(cwd, filename);
}

function shouldIgnore(filename) {
  return getRelativePath(filename).split(path.sep).indexOf('node_modules') >= 0;
}

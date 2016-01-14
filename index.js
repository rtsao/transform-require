'use strict';

var execFileSync = require('exec-file-sync');

function attachHook(extension) {
  require.extensions[extension] = function hook(m, filename) {
    var result = execFileSync('node', ['transform.js', filename], {cwd: __dirname}).toString();
    return m._compile(result, filename);
  };
}

module.exports = attachHook;

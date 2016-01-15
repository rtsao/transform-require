# transform-require

[![build status][build-badge]][build-href]

A node require hook for running browserify transforms

*please note this is still highly experimental*

# usage
```javascript
var transformHook = require('transform-require');
transformHook('.js');
// now all subsequent requires for .js files will be transformed
```

`transform-require` detects which, if any package-level transforms are needed for a given file and then applies them.

By default, `transform-require` ignores node_modules.

### known limitations
* Unlike with browserify transforms, you must enumerate the file extensions for which the require hook will apply the transforms. (With browserify, all requires, regardless of extension are transformed by default)

[build-badge]: https://travis-ci.org/rtsao/transform-require.svg?branch=master
[build-href]: https://travis-ci.org/rtsao/transform-require

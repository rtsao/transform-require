'use strict';

var test = require('tape');

var attachHook = require('../');

attachHook('.js');

test('basic functionality', function t(assert) {

  var actual = require('./fixtures/uppercase');
  var expected = 'i was previously uppercase';

  assert.equal(actual, expected);
  assert.end();
});

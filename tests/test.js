QUnit.test( "Basic Test", function( assert ) {
  assert.equal(typeof window.$, "function", 'window.$ should be a function' );
  assert.equal(typeof window.iQuery, "function", 'window.iQuery should be a function' );
});

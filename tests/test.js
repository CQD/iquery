QUnit.test("Basic Test", function(assert) {
    assert.equal(typeof window.$, "function", 'window.$ should be a function');
    assert.equal(typeof window.iQuery, "function", 'window.iQuery should be a function');
});


QUnit.test("Select elements", function(assert) {
    var $e;

    // Selector is `falsy`
    [undefined, '', false].forEach(function(v){
        $e = $(v);
        assert.equal(0, $e.length, 'Falsy selector');
        assert.equal(undefined, $e[0], 'Falsy selector');
    });

    // single element select
    $e = $('body');
    assert.equal($e.length, 1, 'Single element');
    assert.equal($e[0].tagName, 'BODY', 'Single element');

    // multiple element select
    $e = $('div#iqueryPlayGround ul');
    assert.equal($e.length, 2, 'Multiple elements');
    assert.equal($e[0].tagName, 'UL', 'Multiple elements');

    // find sub elements
    $e = $('div#iqueryPlayGround ul').find('li');
    assert.equal($e.length, 6, 'Find');
    assert.equal($e[0].tagName, 'LI', 'Find');
    assert.equal($e[1].id, 'a2', 'Find');
    assert.equal($e[5].id, 'b3', 'Find');

    $e = $('div#iqueryPlayGround ul#b').find('li');
    assert.equal($e.length, 3, 'Find');
    assert.equal($e[0].tagName, 'LI', 'Find');
    assert.equal($e[2].id, 'b3', 'Find');

    // select with context
    $e = $('li', document.getElementById('a'));
    assert.equal($e.length, 3, 'Query with context');
    assert.equal($e[0].tagName, 'LI', 'Query with context');
    assert.equal($e[2].id, 'a3', 'Query with context');

});

QUnit.test("Create element", function(assert) {
    $e = $('<div>');
    assert.equal($e.length, 1, 'Create div');
    assert.equal($e[0].tagName, 'DIV', 'Create div');

    $e = $('<div></div>');
    assert.equal($e.length, 1, 'Create div');
    assert.equal($e[0].tagName, 'DIV', 'Create div');
});

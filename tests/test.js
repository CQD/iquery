QUnit.config.noglobals = true;

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
    var $e;

    $e = $('<div>');
    assert.equal($e.length, 1, 'Create div');
    assert.equal($e[0].tagName, 'DIV', 'Create div');

    $e = $('<div></div>');
    assert.equal($e.length, 1, 'Create div');
    assert.equal($e[0].tagName, 'DIV', 'Create div');
});

QUnit.test("css()", function(assert) {
    var $e;
    $e = $('#iqueryPlayGround li').css({
        'background': 'red',
        'font-size': '10px',
        'color': 'white',
        'border': '1px solid green'
    })
    assert.ok($e.iQuery, 'Returns iQuery object');

    $e = $('#iqueryPlayGround #b li').css('background', 'blue');
    assert.ok($e.iQuery, 'Returns iQuery object');

    assert.equal($('#iqueryPlayGround #a li').css('background-color'), 'red', 'Set style by object then read');
    assert.equal($('#iqueryPlayGround #a li').css('font-size'), '10px', 'Set style by object then read');
    assert.equal($('#iqueryPlayGround #a li').css('border-color'), 'green', 'Set style by object then read');

    $e = $('#iqueryPlayGround #b li').css('font-size', '8px');
    assert.ok($e.iQuery, 'Returns iQuery object');

    assert.equal($('#iqueryPlayGround #b li').css('font-size'), '8px', 'Override style then read');
    assert.equal($('#iqueryPlayGround #b li').css('background-color'), 'blue', 'Override style by function then read');

    assert.deepEqual(
        $('#iqueryPlayGround #b li').css(['border-width', 'font-size']),
        {'border-width':'1px', 'font-size':'8px'},
        'Read multiple styles'
    );

    assert.ok($('no-such-element').css({'border':'1px solid #ccc'}).iQuery, 'Set style to empty object returns iQuery object');
    assert.equal($('no-such-element').css('font-size'), undefined,'Get style from empty object returns `undefined`');
});

QUnit.test("class methods", function(assert) {
    var e1 = document.createElement('div');
    var e2 = document.createElement('div');
    var $e = $([e1,e2]);

    $e.addClass('clazz1');
    assert.equal($e[0].className, 'clazz1', 'Add class')
    assert.equal($e[1].className, 'clazz1', 'Add class')

    $e.addClass('clazz1');
    assert.equal($e[0].className, 'clazz1', 'Add existing class has no effect')
    assert.equal($e[1].className, 'clazz1', 'Add existing class has no effect')

    $e.addClass('clazz2');
    $e.addClass('clazz3');
    $e.addClass('clazz4');
    assert.equal($e[0].className, 'clazz1 clazz2 clazz3 clazz4', 'Add more class')
    assert.equal($e[1].className, 'clazz1 clazz2 clazz3 clazz4', 'Add more class')

    $e.toggleClass('clazz3')
    assert.equal($e[0].className, 'clazz1 clazz2 clazz4', 'Toggle more class out')
    assert.equal($e[1].className, 'clazz1 clazz2 clazz4', 'Toggle more class out')

    $e.toggleClass('clazz3')
    assert.equal($e[0].className, 'clazz1 clazz2 clazz4 clazz3', 'Toggle more class in')
    assert.equal($e[1].className, 'clazz1 clazz2 clazz4 clazz3', 'Toggle more class in')

    $e.removeClass('clazz1')
    assert.equal($e[0].className, 'clazz2 clazz4 clazz3', 'Remove class')
    assert.equal($e[1].className, 'clazz2 clazz4 clazz3', 'Remove class')

    $e.removeClass('clazz1')
    assert.equal($e[0].className, 'clazz2 clazz4 clazz3', 'Remove non-existing class has no effect')
    assert.equal($e[1].className, 'clazz2 clazz4 clazz3', 'Remove non-existing class has no effect')

    e1.remove();
    e2.remove();
});

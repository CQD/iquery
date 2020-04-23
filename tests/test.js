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

QUnit.test("append/prepend/remove functions", function(assert) {
    var $a1 = $('#a1');
    var $a2 = $('#a2');
    var $a3 = $('#a3');
    var $a = $('#a');
    var $b = $('#b');
    var $eles;

    // a: a1 a2
    // b: b1 b2 b3
    $a3.remove();
    assert.equal($('#a li').length, 2, 'Remove a child from #a');

    // a: a1 a2
    // b: b1 b2 b3 a3
    $a3.appendTo($b);
    assert.equal($('#b li').length, 4, 'Append a child to #b');
    assert.equal($('#b li').eq(3)[0].id, 'a3', 'Append a child to #b');

    // a: a1 a2
    // b: b1 b2 b3 a3
    $a3.appendTo($b);
    assert.equal($('#b li').length, 4, 'Append same child to #b');
    assert.equal($('#b li').eq(3)[0].id, 'a3', 'Append same child to #b');

    // a: a1
    // b: a2 b1 b2 b3 a3
    $b.prepend($a2);
    assert.equal($('#b li').length, 5, 'Prepend another child to #b');
    assert.equal($('#b li').eq(0)[0].id, 'a2', 'Prepend another child to #b');
    assert.equal($('#b li').eq(3)[0].id, 'b3', 'Prepend another child to #b');
    assert.equal($('#b li').eq(4)[0].id, 'a3', 'Prepend another child to #b');

    // a: a2 b1 b2 b3 a3 a1
    // b:
    $b.find('li').prependTo($a);
    assert.equal($a.find('li').length, 6, 'Move all children to #a');
    assert.equal($a.find('li').eq(0)[0].id, 'a2', 'Move all children to #a');
    assert.equal($a.find('li').eq(1)[0].id, 'b1', 'Move all children to #a');
    assert.equal($a.find('li').eq(5)[0].id, 'a1', 'Move all children to #a');

    // a: a2 a3 a1
    // b: b1 b2 b3
    $b.append($('#b2')[0]);
    $('#b3').appendTo($b[0]);
    $b.prepend($('#b1')[0]);
    assert.equal($a.find('li').length, 3, 'Move everything back');
    assert.equal($a.find('li').eq(1)[0].id, 'a3', 'Move everything back');

    assert.equal($b.find('li').length, 3, 'Move everything back');
    assert.equal($b.find('li').eq(0)[0].id, 'b1', 'Move everything back');
    assert.equal($b.find('li').eq(1)[0].id, 'b2', 'Move everything back');
    assert.equal($b.find('li').eq(2)[0].id, 'b3', 'Move everything back');

    // a: a1 a2 a3
    // b: b1 b2 b3
    $a3.appendTo($('#a'));
    $a1.prependTo($('#a'));
    assert.equal($a.find('li').length, 3, 'Move everything back');
    assert.equal($a.find('li')[0].id, 'a1', 'Move everything back');
    assert.equal($a.find('li')[1].id, 'a2', 'Move everything back');
    assert.equal($a.find('li')[2].id, 'a3', 'Move everything back');

});

QUnit.test("each()", function(assert) {
    var $a = $('#a li');

    var text = '';
    $a.each(function(i){
        text += i + ":" + this.id + ",";
    });
    assert.equal(text, '0:a1,1:a2,2:a3,', 'each() every elements');
});

QUnit.test("html()", function(assert) {
    var $p = $('#iqueryPlayGround p');
    var $e, html;

    assert.equal($p.html(), 'ppppp', 'html() basic get html');

    $e = $('<div>').append($('<span>')).append($('<div>').html('<p>AA<span>QQQ</span>BB</p>'))
    html = $e.html().split("\n").join('');
    assert.equal(html, '<span></span><div><p>AA<span>QQQ</span>BB</p></div>', 'html() set and get html');

    assert.equal($e.find('p').html(), 'AA<span>QQQ</span>BB', 'Get html from dynamicly created element');
});

QUnit.test("text()", function(assert){
    var $e;
    $e = $('<div>');
    assert.equal($e.text(), '');
    $e.text('<script></script>');
    assert.equal($e.html(), '&lt;script&gt;&lt;/script&gt;');
    assert.equal($e.text(), '<script></script>');
    $e.text(7533967);
    assert.equal($e.html(), '7533967', 'Set text with number');
    assert.equal($e.text(), '7533967', 'Set text with number');

    $e = $('<input>')
    assert.equal($e.text(), '');
    $e.text('<script></script>');
    assert.equal($e.html(), '');
    assert.equal($e.text(), '<script></script>');

    $e = $('<textarea>')
    assert.equal($e.text(), '');
    $e.text('<script></script>');
    assert.equal($e.html(), '&lt;script&gt;&lt;/script&gt;');
    assert.equal($e.text(), '<script></script>');
});

QUnit.test("attr()", function(assert){
    var $e;
    $e = $('<div>')
        .text('attr_test~')
        .appendTo($('#iqueryPlayGround'));

    assert.equal($e.attr('id', 'attr_test'), $e);
    assert.equal($e.attr({'className':'attr_test_class', 'title': 'attr_test_title'}), $e);
    assert.equal($e.attr('id'), 'attr_test');
    assert.equal($e.attr('className'), 'attr_test_class');
    assert.equal($e.attr('title'), 'attr_test_title');

    assert.equal($('#attr_test').text(), 'attr_test~');

    console.log($('#attr_test'));
    assert.equal($('.attr_test_class').text(), 'attr_test~');

    $e.remove();
});

QUnit.test("data() basic set / get", function(assert){
    var $e;
    $e = $('<div>')
        .text('data_test~')
        .appendTo($('#iqueryPlayGround'));

    assert.equal($e.data('aaa', 'data_aaa'), $e);
    assert.equal($e.data({'bbb':'data_bbb', 'ccc': 'data_ccc'}), $e);
    assert.equal($e.data('aaa'), 'data_aaa');
    assert.equal($e.data('bbb'), 'data_bbb');
    assert.equal($e.data('ccc'), 'data_ccc');

    assert.equal(JSON.stringify($e.data()), '{"aaa":"data_aaa","bbb":"data_bbb","ccc":"data_ccc"}');

    $e.remove();
});

QUnit.test("data() dataset operation/ get", function(assert){
    var $e;
    $e = $('#data-test');

    assert.equal(JSON.stringify($e.data()), '{"a":"AAA","b":"BBB","aaBbCc":"CCC","json":"{\\"name\\":\\"John\\"}"}');
    assert.equal($e.data('a'), 'AAA');

    $e.data('a', 'XXX');
    assert.equal(JSON.stringify($e.data()), '{"a":"XXX","b":"BBB","aaBbCc":"CCC","json":"{\\"name\\":\\"John\\"}"}');
    assert.equal($e.data('a'), 'XXX');

    $e.data({a: "ABC", b: "DEF"});
    assert.equal(JSON.stringify($e.data()), '{"a":"ABC","b":"DEF","aaBbCc":"CCC","json":"{\\"name\\":\\"John\\"}"}');

    $e.data({z: "ZZZ", b: "zzz"});
    assert.equal(JSON.stringify($e.data()), '{"a":"ABC","b":"zzz","aaBbCc":"CCC","json":"{\\"name\\":\\"John\\"}","z":"ZZZ"}');
    assert.equal($e.data('z'), 'ZZZ');
    assert.equal($e.data('b'), 'zzz');
    assert.equal($e.data('aaBbCc'), 'CCC');
});

QUnit.test("val() / <input> ", function(assert){
    var $e;

    $e = $('#testInput')
    assert.equal($e.val(), 'valllll');
    assert.equal($e.val('xx'), $e);
    assert.equal($e.val(), 'xx');
    assert.equal($e.val('valllll'), $e);
    assert.equal($e.val(), 'valllll');

    $e = $('#iqueryPlayGround input');
    assert.equal($e.val(), 'valllll');
    assert.equal($('#testInput').val(), 'valllll');
    assert.equal($e.eq(1).val(), 'valllllllllll');
    assert.equal($e.eq(2).val(), 'moo');

    assert.equal($e.val('love'), $e);
    assert.equal($e.val(), 'love');
    assert.equal($e.eq(0).val(), 'love');
    assert.equal($e.eq(1).val(), 'love');
    assert.equal($e.eq(2).val(), 'love');
    assert.equal($('#testInput3').val(), 'love');

    $('#testInput').val('valllll');
    $('#testInput2').val('valllllllllll');
    $('#testInput3').val('moo');
    $e = $('#iqueryPlayGround input');
    assert.equal($e.val(), 'valllll');
    assert.equal($('#testInput').val(), 'valllll');
    assert.equal($e.eq(1).val(), 'valllllllllll');
    assert.equal($e.eq(2).val(), 'moo');
});

QUnit.test("val() / <select> ", function(assert){
    var $e, e;

    $e = $('#testSelect')
    e = $e[0];

    assert.equal($e.val(), 'op2');
    assert.equal(e.options[e.selectedIndex].value, 'op2');

    assert.equal($e.val('op1'), $e);
    assert.equal($e.val(), 'op1');
    assert.equal(e.options[e.selectedIndex].value, 'op1');
});
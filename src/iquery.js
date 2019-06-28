(function(){
var selectElements = function(selector, context){
    if (!selector) return [];
    context = context || document;

    var elems = [];
    if ( typeof selector === "string") {
        // Create an element by tag name
        var gtPos = selector.indexOf(">");
        if (selector[0] === "<" && gtPos >= 2) {
            elems = [ document.createElement(selector.substring(1, gtPos)) ];
        }

        // Select elements with query selector
        else if (context.querySelectorAll) {
            elems = context.querySelectorAll(selector);
        }
    }

    // $(DOMElement)
    else if (selector.nodeType) {
        elems = [selector];
    }

    // $([DOMElement, DOMElement, DOMElement]), for internal use only
    else if (
        typeof selector.length === "number" &&
        (selector.length === 0 || ( selector.length - 1 ) in selector)
    ) {
        var i = 0;
        for (; i < selector.length; i++) {
            if (selector[i].nodeType && containElement(context, selector[i])) {
                elems.push(selector[i]);
            }
        }
    }

    return elems;
}

var containElement = function(tree, node)
{
    if (tree === document) return true;

    while (node = node.parentNode) {
        if (tree === node) {
            return true;
        }
    }
    return false;
}

var iQuery = function(selector, context){

    var elems = selectElements(selector, context);
    var i = 0;

    for (; i < elems.length; i++) {
        this[i] = elems[i];
    }
    this.length = elems.length;

    return this;
}

iQuery.prototype = {
    iQuery: true,
    length: 0,
    eq: function(idx){
        return new iQuery(this[idx])
    },
    find: function(selector){
        // TODO need speed up...?
        var i = 0, j = 0, elems = [], subElems;
        for (; i < this.length; i++) {
            subElems = selectElements(selector, this[i]);
            for (j = 0; j < subElems.length; j++) {
                elems.push(subElems[j])
            }
        }

        elems.filter(function(v,idx,self){
            return self.indexOf(v) === idx;
        });

        return new iQuery(elems);
    }
};

window.iQuery = window.$ = function(selector, context){
    return new iQuery(selector, context);
};

})()

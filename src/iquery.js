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

var camelize = function(name){
    return name.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' })
}

var type = function(val){
    var type = typeof val;
    switch (type) {
    case 'object':
        if (Array.isArray(val)) {
            type = 'array';
        }
    }
    return type;
}

var uniqueFilter = function(v,idx,self){
    return v && self.indexOf(v) === idx;
}

var setParent = function(parent, childs, func){
    var i;
    func = func || 'append';

    parent = (parent && parent.iQuery) ? parent[0]        : parent;
    childs = (childs && childs.iQuery) ? iq2elems(childs) : childs;

    parent = (parent && parent.nodeType) ? parent   : undefined;
    childs = (childs && childs.nodeType) ? [childs] : childs;

    if (parent && childs) {
        // NOTE: if migrate to ES6, no reverse and for loop needed
        // use `parent[func](...childs);` instead
        childs = ('prepend' === func) ? childs.reverse() : childs;
        for (i in childs) {
            parent[func](childs[i]);
        }
    }
}

var iq2elems = function(iq) {
    var i, elems = [];
    for (i = 0; i < iq.length; i++) {
        elems.push(iq[i]);
    }
    return elems;
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
    css: function(name, value) {
        var names, obj, i, k, ele;

        switch (type(name)) {
        case 'string':
            names = [name];
        case 'array':
            names = names || name;
            if (value) {
                obj = {};
                for (k in names) {
                    obj[names[k]] = value
                }
                return this.css(obj);
            } else {
                ele = this[0];
                if (!ele) return undefined;

                obj = {};
                for (k in names) {
                    k = names[k];
                    obj[k] = ele.style[camelize(k)];
                }

                return (names === name) ? obj : obj[name];
            }
        case 'object':
            for (i = 0; i < this.length; i++) {
                for (k in name) {
                    this[i].style[camelize(k)] = name[k];
                }
            }
        }
        return this;
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

        return new iQuery(elems.filter(uniqueFilter));
    },
    addClass: function(className){
        for (var i = 0; i < this.length; i++) {
            this[i].classList.add(className);
        }
        return this;
    },
    removeClass: function(className){
        for (var i = 0; i < this.length; i++) {
            this[i].classList.remove(className);
        }
        return this;
    },
    toggleClass: function(className){
        for (var i = 0; i < this.length; i++) {
            this[i].classList.toggle(className);
        }
        return this;
    },

    prepend: function(dst){
        setParent(this, dst, 'prepend');
        return this;
    },
    prependTo: function(dst){
        setParent(dst, this, 'prepend');
        return this;
    },
    append: function(dst){
        setParent(this, dst, 'append');
        return this;
    },
    appendTo: function(dst){
        setParent(dst, this, 'append');
        return this;
    },
    remove: function(){
        for (var i = 0; i < this.length; i++) {
            this[i].parentNode.removeChild(this[i]);
        }
        return this;
    },

    each: function(func){
        for (var i = 0; i < this.length; i++) {
            func.call(this[i], i);
        }
        return this;
    }
};

window.iQuery = window.$ = function(selector, context){
    return new iQuery(selector, context);
};

})()

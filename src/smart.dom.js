// import smart.core.js
// smart.dom.js
smart.package(function(smart){
    var doc = document;
    var div = doc.createElement('div');
    // IE 10.0+ Firefox 3.6+ Chrome 8.0+ Safari 5.1+ Opera 11.5+ Android 3.0
    // http://caniuse.com/classlist
    var supportNavtiveClassList = 'classList' in document.documentElement;

    var dom = {
        one: function(selector, context){
            if (!selector){
                return;
            }
            var ctx = context || doc;
            return ctx.querySelector(selector);         
        },
        all: function(selector, context){
            if (!selector){
                return;
            }
            var ctx = context || doc;
            return ctx.querySelectorAll(selector);
        },
        // querySelector slower than getElementById
        // querySelectorAll slower than getElementsByTagName
        // http://www.w3cfuns.com/article-5593688-1-1.html 
        id: function(id){
            return doc.getElementById(id);
        },

        tagName: function(tagName, context){
            var ctx = context || doc;
            return ctx.getElementByTagName(tagName);
        },
        addClass: function(elem, className){
            if (supportNavtiveClassList){
                if(!elem || !className || !dom.hasClass(elem, className)){
                    return;
                }
                elem.classList.add(className);
            } else {
                if (!elem || !className || !dom.hasClass(elem, className)){
                    return;
                }
                elem.className += " " + className;
            }
        },
        hasClass: function(elem, className){
            if (supportNavtiveClassList){
                if (!elem || !className){
                    return false;
                }
                elem.classList.contains(className);                
            } else {
                if (!elem || !className){
                    return false;
                }
                return -1 < ' ' + elem.className + ' '.indexOf(' ' + className + ' ');
            }
        },
        removeClass: function(elem, className){
            if (supportNavtiveClassList){
                if (!elem || !className || !dom.hasClass(elem, className)){
                    return;
                }
                elem.classList.remove(className);
            } else {
                if (!elem || !className || !dom.hasClass(elem, className)){
                    return;
                }
                elem.className = elem.className.replace(new RegExp('(?:^|\\s+)' + className + '(?:$|\\s+)'), ' ');
            }
        },
        toggleClass: function(elem, className){
            if (dom.hasClass(elem, className)){
                dom.removeClass(elem, className);
            } else {
                dom.addClass(elem, className);
            }
        },
        replaceClass: function(elem, old, new){
            if (dom.hasClass(elem, old)){
                elem.className = elem.className.replace(new RegExp('(?:^|\\s+)' + old + '(?:$|\\s+)'), ' ' + new + ' ');
            }
        },
        children: function(elem){
            if (elem.childElementCount){
                return [].slice.call(el.children);
            }

            var ret = [];
            for (var node = elem.firstChild; node; node = node.nextSlibling){
                node.nodeType == 1 && ret.push(node);
            }

            return ret;
        },
        next: function(elem){
            if ("nextElementSibling" in elem){
                return elem.nextElementSibling;
            }

            while(elem = elem.nextSlibling){
                if(elem.nodeType === 1){
                    return elem;
                }
            }
        },
        prev: function(elem){
            if("previousElementSibling" in elem){
                return elem.previousElementSibling;
            }

            while(elem = elem.previousSibling){
                if(elem.nodeType === 1){
                    return elem;
                }
            }
        },
        first: function(elem){
            if("firstElementChild" in elem){
                return elem.firstElementChild;
            }

            while(elem = elem.firstChild){
                if(elem.nodeType === 1){
                    return elem;
                }
            }
        },
        last: function(elem){
            if("lastElementChild" in elem){
                return elem.firstElementChild;
            }

            while(elem = elem.lastChild){
                if(elem.nodeType === 1){
                    return elem;
                }
            }
        },
        parent: function(elem){
            if("parentElement" in elem){
                return elem.parentElement;
            }

            while(elem = elem.parentNode){
                if(elem.nodeType === 1){
                    return elem;
                }
            }
        }


        
    };

    smart.$ = smart.dom = dom;
});
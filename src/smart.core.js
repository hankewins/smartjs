/**
 * 起源：涉世未深的三个臭皮匠，因对前端的执着，带着各自的信念，开始 smart 创作之路。
 * 定位：smart 因智慧过生，有你、有我、有他，简单、易懂、轻便。
 */
(function(undefined) {
    //'use strict'
    var root = this || (typeof window !== 'undefined' ? window : global),
        win = window,
        doc = document,
        slice = Array.prototype.slice,
        jsTypeArr = ['Object', 'Array', 'Function', 'String', 'Number', 'Null', 'Undefined'],
        smart = smart || {};

    // use jquery or zepto selector enginer
    smart.$ = win.jQuery || win.Zepto || win.ender || win.$;

    extend(smart, {
        each: each,
        forEach: each,
        trim: function(str) {
            return str.replace(/^\s+|\s+$/g, '');
        },
        trimLeft: function(str) {
            return str.replace(/^\s+/g, '');
        },
        trimRight: function(str) {
            return str.replace(/\s+$/g, '');
        },
        isEmptyObject: function(obj) {
            for (var name in obj) {
                return false;
            }
            return true;
        },
        namespace: function(str) {
            var target = null,
                i, arr = str.split('.'),
                len = arr.length;

            target = this;

            for (i = 0; i < arr.length; i++) {
                tmp = arr[i];
                target = target[tmp] = target[tmp] || {};
            }
            return this[arr[0]];
        },
        extend: function(target) {
            var deep, args = slice.call(arguments, 1);
            if (typeof target == 'boolean') {
                deep = target;
                target = args.shift();
            }

            each(args, function(index, item) {
                extend(target, item, deep);
            });

            return target;
        },
        package: function(name, func) {
            var target;
            if (typeof name == "function") {
                func = name;
                target = window;
            } else if (typeof name == "string") {
                target = this.namespace(name);
            } else if (typeof name == "object") {
                target = name;
            }

            func.call(target, this);

            return target;
        },
        util: function(name, func) {
            func = smart.isFunction(func) ? func : empty;

            if (smart.isString(name)) {
                smart.util[name] = func;
            } else if (smart.isFunction(name)) {
                smart.extend(smart.util, name());
            } else if (smart.isObject(name)) {
                smart.extend(smart.util, name);
            }
        },
        // http://www.cnblogs.com/haogj/archive/2013/01/15/2861950.html
        // http://www.cnblogs.com/zhangziqiu/archive/2011/06/27/DOMReady.html
        // https://github.com/jquery/jquery/blob/master/src/core/ready.js
        // https://github.com/ded/domready/blob/master/ready.js
        // Compatibility with IE6, IE7, and IE8 has been fully dropped. 
        ready: function(func) {
            var readyList = [],
                ieHack = doc.documentElement.doScroll,
                completed,
                loaded = (ieHack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);

            if (!loaded) {
                doc.addEventListener('DOMContentLoaded', completed = function() {
                    doc.removeEventListener('DOMContentLoaded', completed, false);
                    loaded = 1;
                    while ((completed = readyList.shift())) {
                        completed();
                    }
                }, false);
            }

            return loaded ? setTimeout(func) : readyList.push(func);
        }
    });

    each(jsTypeArr, function(index, item) {
        smart['is' + item] = function(obj) {
            return Object.prototype.toString.call(obj) === '[object ' + item + ']' ? true : false;
        };
    });

    // 参考的资料信息
    // https://github.com/JamesMGreene/document.currentScript
    // https://developer.mozilla.org/zh-CN/docs/Web/API/document.currentScript
    smart.util('currentScript', function() {
        var scriptEls = doc.getElementsByTagName('script'),
            scriptLen = scriptEls.length,
            fileSrc;

        if (doc.currentScript) {
            return doc.currentScript;
        }

        if (scriptLen === 0) {
            return;
        }

        if (scriptEls === 1) {
            return scriptEls[0];
        }

        if ('readyState' in scriptEls[0]) {
            for (var i = scriptEls.length; i--;) {
                if (scriptEls[i].readyState === 'interactive') {
                    return scriptEls[i];
                }
            }
        }

        if (doc.readyState === 'loading') {
            return scriptEls[len - 1];
        }

        try {
            throw Error('get currentJS');
        } catch (e) {
            if (e.fileName) //firefox
                fileSrc = e.fileName;
            else if (e.stack) //chrome
            //fileSrc = e.stack.split(/\s+/).pop().replace(/(\:\d+)+$/, '');
                fileSrc = e.stack.match(/\([^\)]+\:\d+\)/)[0].replace(/^\(|(\:\d+)+\)$/g, '');
            else if (e.sourceURL) //safari
                fileSrc = e.sourceURL;
        }

        if (fileSrc) {
            for (var j = 0; j < scriptLen; j++) {
                if (scriptEls[j].src === fileSrc) return scriptEls[j];
            }
        }

        return fileSrc || scriptEls[scriptLen - 1];

    });

    // 定义应用的相关基础配置信息
    smart.util('application', function(options) {
        // 获取正在执行的Javascript文件的路径
        var currentScript = smart.util.currentScript();
        var staticPath = '',
            format = 'json',
            assetsRoot, webRoot, modulePath, env, reg;
        var defaults = {};
        var opts = smart.extend(defaults, options);

        module = opts.module || '';

        if (module) {
            reg = new RegExp(module + '\\S+', 'ig');
        } else {
            reg = new RegExp(module + '\/[^\/]+$', 'ig');
        }
        modulePath = currentScript.src.replace(reg, module);
        staticPath = modulePath;

        if (currentScript.src.indexOf(location.host) > -1) {
            webRoot = location.protocol + '//' + location.host;
            assetsRoot = webRoot;
        } else {
            webRoot = location.protocol + '//' + location.host;
            if (currentScript.src.indexOf('localhost') > -1) {
                assetsRoot = 'http://localhost';
            } else {
                if (currentScript.src.indexOf('//') > -1) {
                    var protocol = currentScript.src.substring(0, currentScript.src.indexOf('//') + 2);
                    var host = currentScript.src.replace(protocol, '');
                    host = host.substring(0, host.indexOf('/'));
                    assetsRoot = protocol + host;
                }
            }
        }

        console.log(/localhost|dev.demo.gionee.com|demo.3gtest.gionee.com/.test(webRoot));
        console.log(opts.env === 'test');

        if (opts.env === 'test' && /localhost|dev.demo.gionee.com|demo.3gtest.gionee.com/.test(webRoot)) {
            format = 'jsonp';
        }

        return {
            staticPath: staticPath,
            assetsRoot: assetsRoot,
            webRoot: webRoot,
            format: format
        };
    });

    // Empty function, used as default callback
    function empty() {}

    function each(collection, callback) {
        var oToString = Object.prototype.toString;

        if (oToString.call(collection) === '[object Array]') {
            for (var i = 0, lens = collection.length; i < lens; i++) {
                callback.call(collection, i, collection[i]);
            }
        }

        if (oToString.call(collection) === '[object Object]') {
            for (var k in collection) {
                callback.call(collection, k, collection[k]);
            }
        }
    }

    function extend(target, source, deep) {
        for (var k in source) {
            if (deep && (smart.isObject(source[k]) || smart.isArray(source[k]))) {
                if (smart.isObject(source[k]) && !smart.isObject(target[k])) {
                    target[k] = {};
                }

                if (smart.isArray(source[k]) && !smart.isArray(target[k])) {
                    target[k] = [];
                }

                extend(target[k], source[k], deep);

            } else if (source[k] !== undefined) {
                target[k] = source[k];
            }
        }
    }

    // http://www.360doc.com/content/13/0419/11/11247313_279415878.shtml
    function _initStartTime() {
        var performance, startTime;

        performance = win.performance || win.webkitPerformance || win.mozPerformance || win.msPerformance;

        if (performance && performance.timing && performance.timing.navigationStart) {

            startTime = performance.timing.navigationStart;

            // chrome browser

        } else if (win.chrome && win.chrome.csi && win.chrome.csi().startE) {

            startTime = win.chrome.csi().startE;

            //http://www.360doc.com/content/13/0419/11/11247313_279415878.shtml
        } else if (win.gtbExternal && win.gtbExternal.startE) {

            startTime = win.gtbExternal.startE;

        }

        // 解决火狐7.8的bug
        if (navigator.userAgent.match(/Firefox\/[78]\./)) {

            this.navigationStart = performance.timing.unloadEventStart || performance.timing.fetchStart || undefined;

        }

        return startTime;
    }


    win.smart = smart;

}.call(this));
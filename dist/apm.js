/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.obj2str = obj2str;
exports.stringify = stringify;
exports.assign = assign;
exports.eventListener = eventListener;
exports.returnPerfTime = returnPerfTime;
exports.isObj = isObj;
exports.isObjByType = isObjByType;
exports.isEmpty = isEmpty;
/**
 * @file 工具函数
 */

/**
 * 对象转字符串
 * @param {Object} obj 对象
 * @return {string} 字符串
 */
function obj2str(obj) {
    var keys = Object.keys(obj);
    var str = '';
    for (var i = 0; i < keys.length; i++) {
        var kv = keys[i] + '=' + obj[keys[i]] + (i === keys.length - 1 ? '' : '&');
        str += kv;
    }
    return str;
}

/**
 * 序列化接收的参数
 * @param {Object}
 * @return {string}
 */

function stringify(data) {
    switch (typeof data === 'undefined' ? 'undefined' : _typeof(data)) {
        case 'object':
            if (!data) {
                return 'null';
            }
            if (data instanceof Array) {
                var arrayLength = data.length;
                var _s = '[';
                for (var i = 0; i < arrayLength; i++) {
                    _s += (i > 0 ? ',' : '') + stringify(data[i]);
                }
                return _s + ']';
            }
            var s = '{';
            var n = 0;
            for (var a in data) {
                if ('function' !== typeof data[a]) {
                    var temp = stringify(data[a]);
                    s += (n > 0 ? ',' : '') + stringify(a) + ':' + temp, n++;
                }
            }
            return s + '}';
        case 'string':
            return '"' + data.replace(/([\"\\])/g, '\\$1').replace(/\n/g, '\\n') + '"';
        case 'number':
            return data.toString();
        case 'boolean':
            return data ? 'true' : 'false';
        case 'function':
            return stringify(data.toString());
        case 'undefined':
            return 'undefined';
        default:
            return 'undefined';
    }
}

// 是否有localStorage
var hasStorage = exports.hasStorage = window.localStorage !== 'undefined';

/**
 * 合并两个对象
 *
 * @param {Object} a 对象1
 * @param {Object} b 对象2
 * @return {Object} 返回合并后的对象
 */
function assign(a, b) {
    var result = {};
    for (var p in a) {
        if (a.hasOwnProperty(p)) {
            result[p] = a[p];
        }
    }
    for (var q in b) {
        if (b.hasOwnProperty(q)) {
            result[q] = b[q];
        }
    }
    return result;
}

/**
 * @param  {Object}
 * @param  {string}
 * @param  {Object} 回调
 * @param  {boolean} 是否捕获
 * @return {Object}
 */
function eventListener(obj, event, func) {
    var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (obj.addEventListener) {
        return obj.addEventListener(event, func, useCapture);
    } else if (obj.attachEvent) {
        return obj.attachEvent('on' + event, func);
    } else {
        return false;
    }
}

/**
 * @param  {Object}
 * @param  {string}
 * @return {number}
 */
function returnPerfTime(obj, key, navStart) {
    return obj[key] > 0 ? obj[key] - navStart : 0;
}

/**
 * 是否是对象
 * @param  {Object}  obj
 * @return {boolean}
 */
function isObj(obj) {
    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !!obj;
}

/**
 * 判断是否某类型
 * @param  {Object}  o
 * @param  {string}  type
 * @return {boolean}
 */
function isObjByType(o, type) {
    return Object.prototype.toString.call(o) === '[object' + (type || 'Object') + ']';
}

/**
 * 判断是否为空
 * @param  {Object}  obj
 * @return {boolean}
 */
function isEmpty(obj) {
    if (obj === null) {
        return true;
    }
    if (isObjByType(obj, 'Number')) {
        return false;
    }
    return !!obj;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file 上传功能
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author lyb
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _utils = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Report = function () {
    function Report() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
            url: '127.0.0.1:3000',
            appKey: 'powerbylyb',
            isWebview: false
        };

        _classCallCheck(this, Report);

        this.options = options;
        this.baseUrl = this.mkurl(options);
    }

    _createClass(Report, [{
        key: 'mkurl',
        value: function mkurl(options) {
            var url = /^https/i.test(document.URL) ? 'https' : 'http';
            url += '://' + options.url + '/apminfo?appKey=' + options.appKey;
            if ((arguments.length <= 1 ? 0 : arguments.length - 1) > 0) {
                var otherParamObj = arguments.length <= 2 ? undefined : arguments[2];
                for (var k in otherParamObj) {
                    url += '&' + k + '=' + otherParamObj[k];
                }
            }
            return url;
        }

        /**
         * @param  {string}
         * @return 
         * 考虑到向下降级，固采用url拼接的方法，直接将参数塞入到url中去
         */

    }, {
        key: 'get',
        value: function get(data) {
            if (window.navigator && window.navigator.sendBeacon) {
                return navigator.sendBeacon(this.baseUrl, (0, _utils.stringify)(data));
            }
            var img = new Image();
            // 原URL已经格式为http://loaclhost:3000/apmget?appkey=abc
            // let urlWithParam = url + '&perf=' + encodeURIComponent(stringify(data));
            var urlWithParam = this.baseUrl + '&perf=' + encodeURIComponent((0, _utils.stringify)(data));
            img.setAttribute('src', urlWithParam);
            img.setAttribute('style', 'display:none');

            // onload不会触发，因为没有图片成功被解析。
            img.onload = function () {
                // alert('发送成功，接收成功？');
                img.parentNode && img.parentNode.removeChild(img);
            };

            // 只捕获到了error事件。但是数据确实被捕获了。
            img.onerror = function () {
                // alert('发送成功，接收失败？');
                img.parentNode && img.parentNode.removeChild(img);
            };
            document.body.appendChild(img);
            // img.src = url;
        }

        /**
         * post跨域传输，如果不支持post可能需要降级为使用ftp
         * @param  {object}   data   需要传输的数据
         * @param  {object}   header 需要设置的头
         * @param  {Function} callback 成功后执行的回调函数
         * @return
         */

    }, {
        key: 'post',
        value: function post(data, header, callback) {
            // ie低版本暂不考虑
            if (window.navigator && window.navigator.sendBeacon) {
                // let nav = navigator.sendBeacon(this.baseUrl, stringify(data));
                // return callback(!nav), nav;
            }

            if (!window.XMLHttpRequest) {
                return false;
            }

            var xhr = new XMLHttpRequest();

            if (xhr.overrideMimeType) {
                xhr.overrideMimeType('text/html');
            }

            (0, _utils.eventListener)(xhr, 'readystatechange', function () {
                if (4 === xhr.readState && 200 === xhr.status) {
                    return callback(xhr.responseText);
                }
            });

            xhr.open('POST', this.baseUrl, true);

            for (var k in header) {
                xhr.setRequestHeader(k, header[k]);
            }

            xhr.send((0, _utils.stringify)(data));
            // xhr.onreadystatechange = function () {
            //     if (4 === xhr.readState && 200 === xhr.status) {
            //         callback(xhr.responseText);
            //     }
            // };
        }

        /**
         * 当post无法使用的情况下，考虑使用iframe、form、input进行表单提交
         * @return {[type]} [description]
         */

    }, {
        key: 'ftp',
        value: function ftp() {}
    }]);

    return Report;
}();

exports.default = Report;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _info = __webpack_require__(5);

var _info2 = _interopRequireDefault(_info);

var _msg = __webpack_require__(6);

var _msg2 = _interopRequireDefault(_msg);

var _xhr = __webpack_require__(9);

var _xhr2 = _interopRequireDefault(_xhr);

var _perf = __webpack_require__(7);

var _perf2 = _interopRequireDefault(_perf);

var _report = __webpack_require__(1);

var _report2 = _interopRequireDefault(_report);

var _resource = __webpack_require__(8);

var _resource2 = _interopRequireDefault(_resource);

var _error = __webpack_require__(3);

var _error2 = _interopRequireDefault(_error);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * @file 程序入口
                                                                                                                                                           * @author lyb
                                                                                                                                                           */


var Apm = function Apm() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        // 这里需要根据宿主本身的协议来选择是http还是https
        url: '127.0.0.1:3000',
        appKey: 'powerbylyb',
        isWebview: false
    };

    _classCallCheck(this, Apm);

    console.log(123 + 'begin');
    // 进入该脚本时间
    var BEGINTIME = Date.now();
    // 白屏时间定位
    var raf = new Promise(function (resolve) {
        requestAnimationFrame(function () {
            var FP = Date.now();
            resolve(FP);
        });
    });
    this.resource = new _resource2.default();
    this.error = new _error2.default();
    // 自定义设置
    this.options = options;
    // 浏览器信息
    this.info = _info2.default;
    // 消息栈
    this.msg = new _msg2.default();
    // ajax消息栈, 貌似没啥卵用
    this.ajaxMsg = new _msg2.default();
    // default src
    console.log('options');
    console.log(options);
    // this.src = this.options.url + '/apmget?' + `appKey=${this.options.appKey}&`;
    // 拦截ajax请求
    this.xhr = new _xhr2.default();
    this.xhr.on('xhr_done', function (payload) {
        var _ajaxMsg;

        // NOTE: 这里得去重，或者重新写一个事件
        console.log(payload);
        (_ajaxMsg = _this.ajaxMsg).push.apply(_ajaxMsg, _toConsumableArray(payload.map(function (e) {
            return JSON.stringify(e);
        })));
        // this.report(payload);
    });
    this.report = new _report2.default();

    var self = this;

    this.perf = new _perf2.default({
        beginTime: BEGINTIME
    });

    this.perf.getFirstScreenTime();

    (0, _utils.eventListener)(window, 'DOMContentLoaded', function () {
        var DOMREADYTIME = Date.now();
        // domready时间塞入对象
        self.perf.setDomReadyTime(DOMREADYTIME);
        // 查询图片个数，没图片则直接让首屏时间为dom加载完成时间
        var imgs = document.querySelectorAll('img');
        if (!imgs.length) {
            self.perf.firstScreenObj.isFindLastImg = true;
            console.log('imgs.length is DomReady' + imgs.length);
        }
    });

    (0, _utils.eventListener)(window, 'load', function () {
        var ONLOADTIME = Date.now();
        // onload时间塞入对象
        self.perf.setOnLoadTime(ONLOADTIME);
        // load后如果轮训还没结束，则强行结束
        self.perf.firstScreenObj.allImgLoaded = true;
        self.perf.firstScreenObj.isFindLastImg = true;
        if (self.perf.firstScreenObj.t && self.perf.firstScreenObj.intervalFlag) {
            self.perf.firstScreenObj.firstScreenTime = Date.now();
            clearInterval(self.perf.firstScreenObj.t);
            console.log('imgs.length is onloaded，外部结束循环');
        }
        //白屏时间捕获
        raf.then(function (fp) {
            self.perf.setFirstPaintTime(fp);
            var perfData = self.perf.getPerf();
            console.log(perfData);
            self.report.get(perfData);
        });
    });
};

exports.default = Apm;

new Apm();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @file 错误信息收集
 */

var Error = function () {
    function Error() {
        _classCallCheck(this, Error);

        this.getError();
    }

    _createClass(Error, [{
        key: 'getError',
        value: function getError() {
            var self = this;
            var orgError = window.onerror;
            // window.onerror = function (msg, url, line, col, error) {
            window.onerror = function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                var msg = args[0];
                var url = args[1];
                var line = args[2];
                var col = args[3];
                var error = args[4];
                var newMsg = msg;
                if (error && error.stack) {
                    newMsg = self._processStackMsg(error);
                }

                var tempErrorObj = {
                    msg: newMsg,
                    target: url,
                    rowNum: line,
                    colNum: col,
                    time: Date.now()
                };

                console.log(tempErrorObj);
                orgError && orgError.apply(window, args);
            };
        }
    }, {
        key: '_processStackMsg',
        value: function _processStackMsg(errObj) {
            var stack = errObj.stack.replace(/\n/gi, '').split(/\bat\b/).slice(0, 9).join('@').replace(/\?[^:]+/gi, '');

            var msg = errObj.toString();
            if (stack.indexOf(msg) < 0) {
                stack = msg + '@' + stack;
            }
            return stack;
        }
    }, {
        key: '_processError',
        value: function _processError(errObj) {
            try {
                if (errObj.stack) {
                    // 下面这个正则会匹配到一个括号？
                    var url = errObj.stack.match('https?://[^\n]+');
                    console.log(url);
                    url = url ? url[0] : '';
                    var rowCols = url.match(':(\\d+):(\\d+)');
                    if (!rowCols) {
                        rowCols = [0, 0, 0];
                    }
                    var stack = this._processStackMsg(errObj);
                    return {
                        msg: stack,
                        rowNum: rowCols[1],
                        colNum: rowCols[2],
                        target: url.replace(rowCols[0], '')
                    };
                } else {
                    // ie的error信息单独处理
                    if (errObj.name && errObj.message && errObj.description) {
                        return {
                            msg: JSON.stringify(errObj)
                        };
                    }
                }
            } catch (err) {
                return errObj;
            }
        }
    }]);

    return Error;
}();

exports.default = Error;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @file 事件父类
 *
 */
var Event = function () {
    function Event() {
        _classCallCheck(this, Event);

        this.handlers = {};
    }

    _createClass(Event, [{
        key: "on",
        value: function on(name, handler) {
            if (!(this.handlers[name] instanceof Array)) {
                this.handlers[name] = [];
            }
            this.handlers[name].push(handler);
        }
    }, {
        key: "emit",
        value: function emit(name, payload) {
            if (this.handlers[name] instanceof Array) {
                this.handlers[name].forEach(function (cb) {
                    cb(payload);
                });
            }
        }
    }, {
        key: "remove",
        value: function remove(name, handler) {
            var _this = this;

            if (this.handlers[name] instanceof Array) {
                this.handlers[name].forEach(function (e, i) {
                    if (e === handler) {
                        _this.handlers[name].splice(i, 1);
                        return false;
                    }
                });
            }
        }
    }]);

    return Event;
}();

exports.default = Event;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @file 搜集浏览器信息
 *
 */

// 这部分或者可以交给后端做
// 后端可以获取相应的userAgent

// const ua = window.navigator.userAgent.toLowerCase();
// 自己解析貌似不太准确，待定

/**
 * 解析useragent
 * @return {Object}
 * 不太准确，浏览器版本太多可能需要维护一个字典，交给后端了。
 */

// function parserAgent() {
//     let s = navigator.userAgent.toLowerCase();
//     let match = /(webkit)[ \/]([\w.]+)/.exec(s)
//                 || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(s)
//                 || /(msie) ([\w.]+)/.exec(s)
//                 || !/compatible/.test(s) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(s)
//                 || [];
//     return {name: match[1] || '', version: match[2] || '0'};
// }

/**
 * 判断操作系统
 * @return {string} 操作系统
 */
function defineOs() {
  // TODO: 判断操作系统
  return '';
}

/**
 * 判断浏览器类型
 * @return {string} 浏览器类型
 */
function defineBrowser() {
  // TODO: 判断浏览器类型
  return '';
}

/**
 * 判断浏览器版本
 * @return {string} 浏览器版本
 */
function defineVn() {
  // TODO: 判断浏览器版本
  return '';
}

/**
 * @return {Object}
 */
function defineMedia() {
  return {
    screenHeight: window.screen && window.screen.height,
    screenWidth: window.screen && window.screen.width
  };
}

exports.default = {
  os: encodeURIComponent(defineOs()),
  browser: encodeURIComponent(defineBrowser()),
  vn: encodeURIComponent(defineVn()),
  screen: defineMedia(),
  userAgent: window.navigator.userAgent.toLowerCase()
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @file msg类，栈结构
 *
 */

var Msg = function () {
    function Msg() {
        _classCallCheck(this, Msg);

        // etc: ['a=123&b=345&', 'c=123']
        // 最后一个字符串的最后一位不含'&'
        this.msg = [];
    }

    /**
     * 获取消息栈的长度
     * @return {number} 消息栈的长度
     */


    _createClass(Msg, [{
        key: 'getLength',
        value: function getLength() {
            return this.msg.length;
        }

        /**
         * 获取消息字符串
         * @return {string} 消息字符串
         */

    }, {
        key: 'getMsg',
        value: function getMsg() {
            return this.msg.join('');
        }

        /**
         * 将元素压入消息栈中
         * @param {string} ele 字符串元素
         * @return {string} 栈顶元素
         */

    }, {
        key: 'push',
        value: function push(ele) {
            var length = this.getLength();
            if (length && ele) {
                // 给前一个加一个'&'
                this.msg[length - 1] += '&';
            }
            // 将元素压入栈中
            return this.msg.push(ele);
        }

        /**
         * 将栈顶元素从消息栈中弹出
         * @return {string} 栈顶元素
         */

    }, {
        key: 'pop',
        value: function pop() {
            var length = this.getLength();
            if (length) {
                // 给前一个去掉'&'
                var tmpArr = this.msg[length - 1].split('');
                tmpArr.pop();
                this.msg[length - 1] = tmpArr.join('');
            }
            // 将元素从栈内弹出
            return this.msg.pop();
        }

        /**
         * 清空消息栈
         *
         */

    }, {
        key: 'clear',
        value: function clear() {
            this.msg.length = 0;
        }
    }]);

    return Msg;
}();

exports.default = Msg;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file 获取性能信息
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author lyb
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _utils = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Perf = function () {
    function Perf() {
        var timeObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
            beginTime: 0,
            onLoadTime: 0,
            domReadyTime: 0,
            firstRequestAnimationFrameTime: 0
        };

        _classCallCheck(this, Perf);

        this.timeObj = timeObj;
        this.perf = window.performance ? window.performance : window.Performance;
        this.data = {};
    }

    _createClass(Perf, [{
        key: 'getPerf',
        value: function getPerf() {
            if (this.perf && this.perf.timing) {
                var timing = this.perf.timing;
                var navigationStart = timing.navigationStart,
                    domainLookupStart = (0, _utils.returnPerfTime)(timing, 'domainLookupStart', navigationStart),
                    domainLookupEnd = (0, _utils.returnPerfTime)(timing, 'domainLookupEnd', navigationStart),
                    redirectStart = (0, _utils.returnPerfTime)(timing, 'redirectStart', navigationStart),
                    redirectEnd = (0, _utils.returnPerfTime)(timing, 'redirectEnd', navigationStart),
                    connectStart = (0, _utils.returnPerfTime)(timing, 'connectStart', navigationStart),
                    connectEnd = (0, _utils.returnPerfTime)(timing, 'connectEnd', navigationStart);

                this.data = {
                    fetchStart: (0, _utils.returnPerfTime)(timing, 'fetchStart', navigationStart),
                    requestStart: (0, _utils.returnPerfTime)(timing, 'requestStart', navigationStart),
                    responseStart: (0, _utils.returnPerfTime)(timing, 'responseStart', navigationStart),
                    responseEnd: (0, _utils.returnPerfTime)(timing, 'responseEnd', navigationStart),
                    domContentLoadedEventStart: (0, _utils.returnPerfTime)(timing, 'domContentLoadedEventStart', navigationStart),
                    domContentLoadedEventEnd: (0, _utils.returnPerfTime)(timing, 'domContentLoadedEventEnd', navigationStart),
                    domInteractive: (0, _utils.returnPerfTime)(timing, 'domInteractive', navigationStart),
                    domComplete: (0, _utils.returnPerfTime)(timing, 'domComplete', navigationStart),
                    loadEventStart: (0, _utils.returnPerfTime)(timing, 'loadEventStart', navigationStart),
                    loadEventEnd: (0, _utils.returnPerfTime)(timing, 'loadEventEnd', navigationStart),
                    unloadEventStart: (0, _utils.returnPerfTime)(timing, 'unloadEventStart', navigationStart),
                    unloadEventEnd: (0, _utils.returnPerfTime)(timing, 'unloadEventEnd', navigationStart)
                };

                // 如果有的话
                if (redirectEnd - redirectStart > 0 || redirectEnd > 0) {
                    this.data.redirectStart = redirectStart;
                    this.data.redirectEnd = redirectEnd;
                }

                // 如果有的话
                if (domainLookupEnd - domainLookupStart > 0) {
                    this.data.domainLookupStart = domainLookupStart;
                    this.data.domainLookupEnd = domainLookupEnd;
                }

                // 如果有的话
                if (connectEnd - connectStart > 0) {
                    this.data.connectStart = connectStart;
                    this.data.connectEnd = connectEnd;
                }

                // 如果有的话
                if (timing.secureConnectionStart) {
                    this.data.secureConnectionStart = timing.secureConnectionStart;
                }

                // 白屏时间
                var firstPaint = this.getFirstPaint(timing, this.timeObj.firstRequestAnimationFrameTime);
                if (firstPaint - navigationStart > 0) {
                    this.data.firstPaint = Math.round(firstPaint - navigationStart);
                }

                // 首屏时间
                // TODO
                var firstScreenTime = this.firstScreenObj.firstScreenTime;
                if (firstScreenTime - navigationStart > 0) {
                    this.data.firstScreenTime = Math.round(firstScreenTime - navigationStart);
                }
            } else {
                // 降级方案，与听云类似，以进入apm的时间为开始
                // 统计不准，会丢失网络信息，不能与之前的数据放在一起处理，意义不大，先删除
                // this.data = {
                //     beginTime: timeObj.beginTime, //待定
                //     loadEventStart: timeObj.onLoadTime - timeObj.beginTime, // 触发onload时间减去开始时间
                //     domContentLoadedEventStart: timeObj.domReadyTime - timeObj.beginTime, // 触发onload时间减去开始时间
                // };
            }
            return this.data;
        }
    }, {
        key: 'getFirstPaint',
        value: function getFirstPaint(timing, firstRequestAnimationFrameTime) {
            // 先计算chrome和ie高版本
            var firstPaint = 0;
            if (timing.msFirstPaint) {
                firstPaint = timing.msFirstPaint;
                console.log('iepf:', firstPaint);
            } else if (window.chrome && window.chrome.loadTimes && window.chrome.loadTimes().firstPaintTime > 0) {
                // 执行时机待查
                firstPaint = 1e3 * window.chrome.loadTimes().firstPaintTime;
                console.log('chromepf:', firstPaint);
            } else {
                // 如果不是chrome或者高版本ie，则使用requestAnimationFrame计算出的白屏时间
                firstPaint = firstRequestAnimationFrameTime;
                console.log('rafpf:', firstPaint);
            }
            return firstPaint;
        }

        /**
         *
         * 该方案判断首屏有没有图片，如果没，就是DomReady时间，如果有，则分图在首屏和不在首屏。
         * 方案问题在于对于图片的判断，如果没有使用img标签，而是使用background-image的方式嵌入，则无法判断。
         * 对于background-image判断图片是否出现在首屏基线以内的代价太大，会影响到页面本身的性能。
         * 目前听云已不提供首屏时间，其他每家的计算方式不尽相同。待讨论。
         * 
         * @return {[type]}
         */

    }, {
        key: 'getFirstScreenTime',
        value: function getFirstScreenTime() {
            function getOffsetTop(ele) {
                var offsetTop = ele.offsetTop;
                if (ele.offsetParent !== null) {
                    offsetTop += getOffsetTop(ele.offsetParent);
                }
                return offsetTop;
            }

            var firstScreenHeight = window.screen.height;
            var firstScreenImgs = [];
            var self = this;
            this.firstScreenObj = {};
            this.firstScreenObj.isFindLastImg = false;
            this.firstScreenObj.allImgLoaded = false;
            this.firstScreenObj.intervalFlag = true;
            this.firstScreenObj.t = setInterval(function () {
                console.log('循环呢');
                var i = void 0,
                    img = void 0;
                if (self.firstScreenObj.isFindLastImg) {
                    if (firstScreenImgs.length) {
                        for (i = 0; i < firstScreenImgs.length; i++) {
                            img = firstScreenImgs[i];
                            if (!img.complete) {
                                // console.log('图还没加载好');
                                self.firstScreenObj.allImgLoaded = false;
                                break;
                            } else {
                                self.firstScreenObj.allImgLoaded = true;
                            }
                        }
                    } else {
                        // console.log('图加载好啦！');
                        self.firstScreenObj.allImgLoaded = true;
                    }
                    if (self.firstScreenObj.allImgLoaded && self.firstScreenObj.intervalFlag) {
                        self.firstScreenObj.firstScreenTime = Date.now();
                        // console.log('firstScreenLoaded', self.firstScreenObj.firstScreenTime);
                        // console.log(self.firstScreenObj.t);
                        clearInterval(self.firstScreenObj.t);
                        self.firstScreenObj.intervalFlag = false;
                        // console.log('内部结束循环');
                    }
                } else {
                    var imgs = document.querySelectorAll('img');
                    for (i = 0; i < imgs.length; i++) {
                        console.log('found the imgs:' + imgs.length);
                        img = imgs[i];
                        var imgOffsetTop = getOffsetTop(img);
                        console.log('imgOffsetTop:' + imgOffsetTop);
                        console.log('firstScreenHeight:' + firstScreenHeight);
                        if (imgOffsetTop > firstScreenHeight) {
                            self.firstScreenObj.isFindLastImg = true;
                            console.log('一共计算的图片个数:' + i);
                            break;
                        } else if (imgOffsetTop <= firstScreenHeight && !img.hasPushed) {
                            img.hasPushed = true;
                            firstScreenImgs.push(img);
                        }
                    }
                }
            }, 0);
        }
    }, {
        key: 'setOnLoadTime',
        value: function setOnLoadTime(onLoadTime) {
            this.timeObj.onLoadTime = onLoadTime;
        }
    }, {
        key: 'setDomReadyTime',
        value: function setDomReadyTime(domReadyTime) {
            this.timeObj.domReadyTime = domReadyTime;
        }
    }, {
        key: 'setBeginTime',
        value: function setBeginTime(beginTime) {
            this.timeObj.beginTime = beginTime;
        }
    }, {
        key: 'setFirstPaintTime',
        value: function setFirstPaintTime(firstPaintTime) {
            this.timeObj.firstRequestAnimationFrameTime = firstPaintTime;
        }
    }]);

    return Perf;
}();

exports.default = Perf;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file 静态资源性能捕获
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * author lyb
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _utils = __webpack_require__(0);

var _report = __webpack_require__(1);

var _report2 = _interopRequireDefault(_report);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Resource = function () {
    function Resource() {
        _classCallCheck(this, Resource);

        this.report = new _report2.default();
        this.data = [];
        // 当resource满了，需要压入这个buffer中去待处理
        this.dataBuffer = [];
        var self = this;
        this.performance = window.performance ? window.performance : window.Performance;
        (0, _utils.eventListener)(this.performance, 'resourcetimingbufferfull', function () {
            var tempBuffer = this.performance.getEntriesByType('resource');
            if (tempBuffer) {
                self.dataBuffer = self.dataBuffer.concat(tempBuffer);
                this.performance.clearResourceTimings();
            }
        });
        (0, _utils.eventListener)(this.performance, 'webkitresourcetimingbufferfull', function () {
            var tempBuffer = this.performance.getEntriesByType('resource');
            if (tempBuffer) {
                self.dataBuffer = self.dataBuffer.concat(tempBuffer);
                this.performance.webkitClearResourceTimings();
            }
        });
        (0, _utils.eventListener)(window, 'unload', function () {
            self.report.post(self.dataBuffer);
        });
    }

    _createClass(Resource, [{
        key: 'getResource',
        value: function getResource() {
            // let performance = window.performance ? window.performance : window.Performance;

            if (this.performance && this.performance.getEntriesByType) {
                var resourceNow = this.performance.getEntriesByType('resource');
                if (resourceNow || this.dataBuffer) {
                    // 这里需要合并之前超出界限的内容
                    resourceNow = resourceNow.concat(this.dataBuffer);
                    this.performance.webkitClearResourceTimings && this.performance.webkitClearResourceTimings();
                    this.performance.clearResourceTimings && this.performance.clearResourceTimings();
                    this.dataBuffer.length = 0;
                }
                var resourceNowLength = resourceNow.length;
                for (var i = 0; i < resourceNowLength; i++) {
                    var temp = resourceNow[i];
                    var tempObj = {
                        startTime: temp.startTime > 0 ? temp.startTime : 0,
                        fetchStart: temp.fetchStart > 0 ? temp.fetchStart : 0,
                        domainLookupStart: temp.domainLookupStart > 0 ? temp.domainLookupStart : 0,
                        domainLookupEnd: temp.domainLookupEnd > 0 ? temp.domainLookupEnd : 0,
                        connectStart: temp.connectStart > 0 ? temp.connectStart : 0,
                        connectEnd: temp.connectEnd > 0 ? temp.connectEnd : 0,
                        secureConnectionStart: temp.secureConnectionStart > 0 ? temp.secureConnectionStart : 0,
                        requestStart: temp.requestStart > 0 ? temp.requestStart : 0,
                        responseStart: temp.responseStart > 0 ? temp.responseStart : 0,
                        responseEnd: temp.responseEnd > 0 ? temp.responseEnd : 0,
                        initiatorType: temp.initiatorType,
                        name: temp.name
                    };

                    // 这里考虑去重，对探针自身的xhr信息进行过滤，或者也可以发送，因为发送后可以看到探针的执行情况
                    this.data.push(tempObj);
                }
            }
        }
    }]);

    return Resource;
}();

exports.default = Resource;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _event = __webpack_require__(4);

var _event2 = _interopRequireDefault(_event);

var _report = __webpack_require__(1);

var _report2 = _interopRequireDefault(_report);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 拦截Ajax请求
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author lyb
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Xhr = function (_Event) {
    _inherits(Xhr, _Event);

    function Xhr() {
        var xhrOpt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
            maxNum: 5, // 最多攒5个
            maxDur: 1e4 // 最多间隔10s
        };

        _classCallCheck(this, Xhr);

        // 请求信息, etc:
        // this.msg = [{
        //     method: 'get',
        //     url: '/demo',
        //     status: 200,
        //     errCode: 0,
        //     responseSize: 1234,
        // }]
        var _this = _possibleConstructorReturn(this, (Xhr.__proto__ || Object.getPrototypeOf(Xhr)).call(this));
        // 继承父类constructor


        _this.xhrOpt = xhrOpt;
        _this.msg = [];
        // 请求总数
        // this.count = 0;
        // 上次发送时间
        _this.lastSentTime = 0;
        _this.report = new _report2.default();
        var self = _this;
        var tempData = {};
        // 保存原始的open方法
        var open = window.XMLHttpRequest.prototype.open;
        // 保存原始的sent方法
        var send = window.XMLHttpRequest.prototype.send;
        // 改写open方法，后续可以更改为柯里化写法，更加安全
        window.XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
            // 请求开始时间
            var start = Date.now();
            tempData = {};
            tempData.method = method;
            tempData.url = url;

            // self.count++;

            (0, _utils.eventListener)(this, 'load', function () {
                tempData.responseTime = Date.now() - start;
                tempData.status = this.status;
                tempData.errCode = 0;
                // tempData.headerSize = self.dataSize(this.getAllResponseHeaders());
                // headerSize无意义，因为有些header是无法通过getAllresponseHeaders获取的。
                // response需要try catch处理，因为不是所有的response都是字符串
                tempData.responseSize = self.dataSize(this.response);
            });
            (0, _utils.eventListener)(this, 'loadstart', function () {
                start = Date.now();
            });
            (0, _utils.eventListener)(this, 'error', function () {
                tempData.responseTime = Date.now() - start;
                tempData.status = this.status;
                tempData.errCode = 990;
            });
            (0, _utils.eventListener)(this, 'abort', function () {
                tempData.responseTime = Date.now() - start;
                tempData.status = this.status;
                tempData.errCode = 905;
            });
            (0, _utils.eventListener)(this, 'timeout', function () {
                tempData.responseTime = Date.now() - start;
                tempData.status = this.status;
                tempData.errCode = 903;
            });
            (0, _utils.eventListener)(this, 'loadend', function () {
                // TODO:这里需要去重，去掉自己域名的东西。
                var reportXhr = new _report2.default();
                var reg = new RegExp(reportXhr.options.url, 'i');
                if (!reg.test(tempData.url)) {
                    self.msg.push(tempData);
                    console.log(self.msg);
                } else {
                    console.log('没进来');
                }
                if (self.msg.length > 0 && (Date.now() - self.lastSentTime > self.xhrOpt.maxDur || self.msg.length > self.xhrOpt.maxNum)) {
                    // 这里会把消息发送出去，回调会清空数组
                    console.log(self.msg.length);
                    reportXhr.post(self.msg, {}, function () {
                        self.msg.length = 0;
                    });
                    self.lastSentTime = Date.now();
                }
            });

            // 将上下文传到原始的open方法
            // 并将所有参数传进去
            // 避免原始调用的出错
            open.call(this, method, url, async, user, pass);
        };
        // 改写send方法，后续可以更改为柯里化写法，更加安全
        window.XMLHttpRequest.prototype.send = function (data) {
            tempData.requestSize = self.dataSize(data);
            send.call(this, data);
        };
        return _this;
    }

    _createClass(Xhr, [{
        key: 'dataSize',
        value: function dataSize(response) {
            return 'string' === typeof response ? response.replace(/[^\u0000-\u00ff]/g, 'aa').length : window.ArrayBuffer && response instanceof ArrayBuffer ? response.byteLength : window.Blob && response instanceof Blob ? response.size : response && response.length ? response.length : 0;
        }
    }]);

    return Xhr;
}(_event2.default);

exports.default = Xhr;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ })
/******/ ]);
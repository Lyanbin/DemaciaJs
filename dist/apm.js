(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Apm = factory());
}(this, (function () { 'use strict';

function defineOs() {
    return '';
}
function defineBrowser() {
    return '';
}
function defineVn() {
    return '';
}
function defineMedia() {
    return {
        screenHeight: window.screen && window.screen.height,
        screenWidth: window.screen && window.screen.width
    };
}
var info = {
    os: encodeURIComponent(defineOs()),
    browser: encodeURIComponent(defineBrowser()),
    vn: encodeURIComponent(defineVn()),
    screen: defineMedia(),
    userAgent: window.navigator.userAgent.toLowerCase()
};

var Msg = function Msg() {
    this.msg = [];
};
Msg.prototype.getLength = function getLength () {
    return this.msg.length;
};
Msg.prototype.getMsg = function getMsg () {
    return this.msg.join('');
};
Msg.prototype.push = function push (ele) {
    var length = this.getLength();
    if (length && ele) {
        this.msg[length - 1] += '&';
    }
    return this.msg.push(ele);
};
Msg.prototype.pop = function pop () {
    var length = this.getLength();
    if (length) {
        var tmpArr = this.msg[length - 1].split('');
        tmpArr.pop();
        this.msg[length - 1] = tmpArr.join('');
    }
    return this.msg.pop();
};
Msg.prototype.clear = function clear () {
    this.msg.length = 0;
};

var Event = function Event() {
    this.handlers = {};
};
Event.prototype.on = function on (name, handler) {
    if (!(this.handlers[name] instanceof Array)) {
        this.handlers[name] = [];
    }
    this.handlers[name].push(handler);
};
Event.prototype.emit = function emit (name, payload) {
    if (this.handlers[name] instanceof Array) {
        this.handlers[name].forEach(function (cb) {
            cb(payload);
        });
    }
};
Event.prototype.remove = function remove (name, handler) {
        var this$1 = this;
    if (this.handlers[name] instanceof Array) {
        this.handlers[name].forEach(function (e, i) {
            if (e === handler) {
                this$1.handlers[name].splice(i, 1);
                return false;
            }
        });
    }
};

function stringify(data) {
    switch (typeof data) {
        case 'object':
            if (!data) {
                return 'null';
            }
            if (data instanceof Array) {
                var arrayLength = data.length;
                var s$1 = '[';
                for (var i = 0; i < arrayLength; i++) {
                    s$1 += (i > 0 ? ',' : '') + stringify(data[i]);
                }
                return s$1 + ']';
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


function eventListener(obj, event, func, useCapture) {
    if ( useCapture === void 0 ) useCapture=false;
    if (obj.addEventListener) {
        return obj.addEventListener(event, func, useCapture);
    } else if (obj.attachEvent) {
        return obj.attachEvent('on' + event, func);
    } else {
        return false;
    }
}
function returnPerfTime(obj, key, navStart) {
    return obj[key] > 0 ? obj[key] - navStart : 0;
}

var Report = function Report(options) {
    if ( options === void 0 ) options = {
    url: '127.0.0.1:3000',
    appKey: 'powerbylyb',
    isWebview: false
};
    this.options = options;
    this.baseUrl = this.mkurl(options);
};
Report.prototype.mkurl = function mkurl (options) {
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];
    var url = /^https/i.test(document.URL) ? 'https' : 'http';
    url += '://' + options.url + '/apminfo?appKey=' + options.appKey;
    if (args.length > 0) {
        var otherParamObj = args[1];
        for (var k in otherParamObj) {
            url += '&' + k + '=' + otherParamObj[k];
        }
    }
    return url;
};
Report.prototype.get = function get (data) {
    if (window.navigator && window.navigator.sendBeacon) {
        return navigator.sendBeacon(this.baseUrl, stringify(data));
    }
    var img = new Image();
    var urlWithParam = this.baseUrl + '&perf=' + encodeURIComponent(stringify(data));
    img.setAttribute('src', urlWithParam);
    img.setAttribute('style', 'display:none');
    img.onload = function () {
        img.parentNode && img.parentNode.removeChild(img);
    };
    img.onerror = function () {
        img.parentNode && img.parentNode.removeChild(img);
    };
    document.body.appendChild(img);
};
Report.prototype.post = function post (data, header, callback) {
    if (window.navigator && window.navigator.sendBeacon) {
    }
    if (!window.XMLHttpRequest) {
        return false;
    }
    var xhr = new XMLHttpRequest();
    if (xhr.overrideMimeType) {
        xhr.overrideMimeType('text/html');
    }
    eventListener(xhr, 'readystatechange', function () {
        if (4 === xhr.readState && 200 === xhr.status) {
            return callback(xhr.responseText);
        }
    });
    xhr.open('POST', this.baseUrl, true);
    for (var k in header) {
        xhr.setRequestHeader(k, header[k]);
    }
    xhr.send(stringify(data));
};
Report.prototype.ftp = function ftp () {
};

var Xhr = (function (Event$$1) {
    function Xhr(xhrOpt) {
        if ( xhrOpt === void 0 ) xhrOpt = {
        maxNum: 5,
        maxDur: 1e4
    };
        Event$$1.call(this);
        this.xhrOpt = xhrOpt;
        this.msg = [];
        this.lastSentTime = 0;
        this.report = new Report();
        var self = this;
        var tempData = {};
        var open = window.XMLHttpRequest.prototype.open;
        var send = window.XMLHttpRequest.prototype.send;
        window.XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
            var start = Date.now();
            tempData = {};
            tempData.method = method;
            tempData.url = url;
            eventListener(this, 'load', function () {
                tempData.responseTime = Date.now() - start;
                tempData.status = this.status;
                tempData.errCode = 0;
                tempData.responseSize = self.dataSize(this.response);
            });
            eventListener(this, 'loadstart', function () {
                start = Date.now();
            });
            eventListener(this, 'error', function () {
                tempData.responseTime = Date.now() - start;
                tempData.status = this.status;
                tempData.errCode = 990;
            });
            eventListener(this, 'abort', function () {
                tempData.responseTime = Date.now() - start;
                tempData.status = this.status;
                tempData.errCode = 905;
            });
            eventListener(this, 'timeout', function () {
                tempData.responseTime = Date.now() - start;
                tempData.status = this.status;
                tempData.errCode = 903;
            });
            eventListener(this, 'loadend', function () {
                var reportXhr = new Report();
                var reg = new RegExp(reportXhr.options.url, 'i');
                if (!reg.test(tempData.url)) {
                    self.msg.push(tempData);
                    console.log(self.msg);
                } else {
                    console.log('没进来');
                }
                if (self.msg.length > 0 && (Date.now() - self.lastSentTime > self.xhrOpt.maxDur || self.msg.length > self.xhrOpt.maxNum)) {
                    console.log(self.msg.length);
                    reportXhr.post(self.msg, {}, function () {
                        self.msg.length = 0;
                    });
                    self.lastSentTime = Date.now();
                }
            });
            open.call(this, method, url, async, user, pass);
        };
        window.XMLHttpRequest.prototype.send = function (data) {
            tempData.requestSize = self.dataSize(data);
            send.call(this, data);
        };
    }
    if ( Event$$1 ) Xhr.__proto__ = Event$$1;
    Xhr.prototype = Object.create( Event$$1 && Event$$1.prototype );
    Xhr.prototype.constructor = Xhr;
    Xhr.prototype.dataSize = function dataSize (response) {
        return 'string' === typeof response ? response.replace(/[^\u0000-\u00ff]/g, 'aa').length
            : window.ArrayBuffer && response instanceof ArrayBuffer ? response.byteLength
            : window.Blob && response instanceof Blob ? response.size
            : response && response.length ? response.length : 0;
    };
    return Xhr;
}(Event));

var Perf = function Perf(timeObj) {
    if ( timeObj === void 0 ) timeObj = {
    beginTime: 0,
    onLoadTime: 0,
    domReadyTime: 0,
    firstRequestAnimationFrameTime: 0
};
    this.timeObj = timeObj;
    this.perf = window.performance ? window.performance : window.Performance;
    this.data = {};
};
Perf.prototype.getPerf = function getPerf () {
    if (this.perf && this.perf.timing) {
        var timing = this.perf.timing;
        var navigationStart = timing.navigationStart,
            domainLookupStart = returnPerfTime(timing, 'domainLookupStart', navigationStart),
            domainLookupEnd = returnPerfTime(timing, 'domainLookupEnd', navigationStart),
            redirectStart = returnPerfTime(timing, 'redirectStart', navigationStart),
            redirectEnd = returnPerfTime(timing, 'redirectEnd', navigationStart),
            connectStart = returnPerfTime(timing, 'connectStart', navigationStart),
            connectEnd = returnPerfTime(timing, 'connectEnd', navigationStart);
        this.data = {
            fetchStart: returnPerfTime(timing, 'fetchStart', navigationStart),
            requestStart: returnPerfTime(timing, 'requestStart', navigationStart),
            responseStart: returnPerfTime(timing, 'responseStart', navigationStart),
            responseEnd: returnPerfTime(timing, 'responseEnd', navigationStart),
            domContentLoadedEventStart: returnPerfTime(timing, 'domContentLoadedEventStart', navigationStart),
            domContentLoadedEventEnd: returnPerfTime(timing, 'domContentLoadedEventEnd', navigationStart),
            domInteractive: returnPerfTime(timing, 'domInteractive', navigationStart),
            domComplete: returnPerfTime(timing, 'domComplete', navigationStart),
            loadEventStart: returnPerfTime(timing, 'loadEventStart', navigationStart),
            loadEventEnd: returnPerfTime(timing, 'loadEventEnd', navigationStart),
            unloadEventStart: returnPerfTime(timing, 'unloadEventStart', navigationStart),
            unloadEventEnd: returnPerfTime(timing, 'unloadEventEnd', navigationStart)
        };
        if (redirectEnd - redirectStart > 0 || redirectEnd > 0) {
            this.data.redirectStart = redirectStart;
            this.data.redirectEnd = redirectEnd;
        }
        if (domainLookupEnd - domainLookupStart > 0) {
            this.data.domainLookupStart = domainLookupStart;
            this.data.domainLookupEnd = domainLookupEnd;
        }
        if (connectEnd - connectStart > 0) {
            this.data.connectStart = connectStart;
            this.data.connectEnd = connectEnd;
        }
        if (timing.secureConnectionStart) {
            this.data.secureConnectionStart = timing.secureConnectionStart;
        }
        var firstPaint = this.getFirstPaint(timing, this.timeObj.firstRequestAnimationFrameTime);
        if (firstPaint - navigationStart > 0) {
            this.data.firstPaint = Math.round(firstPaint - navigationStart);
        }
        var firstScreenTime = this.firstScreenObj.firstScreenTime;
        if (firstScreenTime - navigationStart > 0) {
            this.data.firstScreenTime = Math.round(firstScreenTime - navigationStart);
        }
    } else {
    }
    return this.data;
};
Perf.prototype.getFirstPaint = function getFirstPaint (timing, firstRequestAnimationFrameTime) {
    var firstPaint = 0;
    if (timing.msFirstPaint) {
        firstPaint = timing.msFirstPaint;
        console.log('iepf:', firstPaint);
    } else if (window.chrome && window.chrome.loadTimes && window.chrome.loadTimes().firstPaintTime > 0) {
        firstPaint = 1e3 * window.chrome.loadTimes().firstPaintTime;
        console.log('chromepf:', firstPaint);
    } else {
        firstPaint = firstRequestAnimationFrameTime;
        console.log('rafpf:', firstPaint);
    }
    return firstPaint;
};
Perf.prototype.getFirstScreenTime = function getFirstScreenTime () {
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
        var i, img;
        if (self.firstScreenObj.isFindLastImg) {
            if (firstScreenImgs.length) {
                for (i = 0; i < firstScreenImgs.length; i++) {
                    img = firstScreenImgs[i];
                    if (!img.complete) {
                        self.firstScreenObj.allImgLoaded = false;
                        break;
                    } else {
                        self.firstScreenObj.allImgLoaded = true;
                    }
                }
            } else {
                self.firstScreenObj.allImgLoaded = true;
            }
            if (self.firstScreenObj.allImgLoaded && self.firstScreenObj.intervalFlag) {
                self.firstScreenObj.firstScreenTime = Date.now();
                clearInterval(self.firstScreenObj.t);
                self.firstScreenObj.intervalFlag = false;
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
                    console.log('一共计算的图片个数:'+i);
                    break;
                } else if (imgOffsetTop <= firstScreenHeight && !img.hasPushed) {
                    img.hasPushed = true;
                    firstScreenImgs.push(img);
                }
            }
        }
    }, 0);
};
Perf.prototype.setOnLoadTime = function setOnLoadTime (onLoadTime) {
    this.timeObj.onLoadTime = onLoadTime;
};
Perf.prototype.setDomReadyTime = function setDomReadyTime (domReadyTime) {
    this.timeObj.domReadyTime = domReadyTime;
};
Perf.prototype.setBeginTime = function setBeginTime (beginTime) {
    this.timeObj.beginTime = beginTime;
};
Perf.prototype.setFirstPaintTime = function setFirstPaintTime (firstPaintTime) {
    this.timeObj.firstRequestAnimationFrameTime = firstPaintTime;
};

var Resource = function Resource() {
    this.Report = new Report();
    this.data = [];
    this.dataBuffer = [];
    var self = this;
    this.performance = window.performance ? window.performance : window.Performance;
    eventListener(this.performance, 'resourcetimingbufferfull', function () {
        var tempBuffer = this.performance.getEntriesByType('resource');
        if (tempBuffer) {
            self.dataBuffer = self.dataBuffer.concat(tempBuffer);
            this.performance.clearResourceTimings();
        }
    });
    eventListener(this.performance, 'webkitresourcetimingbufferfull', function () {
        var tempBuffer = this.performance.getEntriesByType('resource');
        if (tempBuffer) {
            self.dataBuffer = self.dataBuffer.concat(tempBuffer);
            this.performance.webkitClearResourceTimings();
        }
    });
    eventListener(window, 'beforeunload', function () {
        self.Report.post(self.getResource());
    });
};
Resource.prototype.getResource = function getResource () {
        var this$1 = this;
    if (this.performance && this.performance.getEntriesByType) {
        var resourceNow = this.performance.getEntriesByType('resource');
        if (resourceNow && this.dataBuffer) {
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
            this$1.data.push(tempObj);
        }
        return this.data;
    }
};

var Error = function Error() {
    this.getError();
    this.Report = new Report();
};
Error.prototype.getError = function getError () {
    var self = this;
    var orgError = window.onerror;
    window.onerror = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];
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
        self.Report.post(tempErrorObj);
        orgError && orgError.apply(window, args);
    };
};
Error.prototype._processStackMsg = function _processStackMsg (errObj) {
    var stack = errObj.stack
        .replace(/\n/gi, '')
        .split(/\bat\b/)
        .slice(0, 9)
        .join('@')
        .replace(/\?[^:]+/gi, '');
    var msg = errObj.toString();
    if (stack.indexOf(msg) < 0) {
        stack = msg + '@' + stack;
    }
    return stack;
};
Error.prototype._processError = function _processError (errObj) {
    try {
        if (errObj.stack) {
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
            if (errObj.name && errObj.message && errObj.description) {
                return  {
                    msg: JSON.stringify(errObj)
                };
            }
        }
    } catch (err) {
        return errObj;
    }
};

var Apm = function Apm(options) {
    var this$1 = this;
    if ( options === void 0 ) options = {
    url: '127.0.0.1:3000',
    appKey: 'powerbylyb',
    isWebview: false
};
    console.log(123+'begin');
    var BEGINTIME = Date.now();
    var raf = new Promise(function (resolve) {
        requestAnimationFrame(function () {
            var FP = Date.now();
            resolve(FP);
        });
    });
    this.resource = new Resource();
    this.error = new Error();
    this.options = options;
    this.info = info;
    this.msg = new Msg();
    this.ajaxMsg = new Msg();
    console.log('options');
    console.log(options);
    this.xhr = new Xhr();
    this.xhr.on('xhr_done', function (payload) {
        console.log(payload);
        (ref = this$1.ajaxMsg).push.apply(ref, payload.map(function (e) { return JSON.stringify(e); }));
        var ref;
    });
    this.report = new Report();
    var self = this;
    this.perf = new Perf({
        beginTime: BEGINTIME
    });
    this.perf.getFirstScreenTime();
    eventListener(window, 'DOMContentLoaded', function () {
        var DOMREADYTIME = Date.now();
        self.perf.setDomReadyTime(DOMREADYTIME);
        var imgs = document.querySelectorAll('img');
        if (!imgs.length) {
            self.perf.firstScreenObj.isFindLastImg = true;
            console.log('imgs.length is DomReady' + imgs.length);
        }
    });
    eventListener(window, 'load', function () {
        var ONLOADTIME = Date.now();
        self.perf.setOnLoadTime(ONLOADTIME);
        self.perf.firstScreenObj.allImgLoaded = true;
        self.perf.firstScreenObj.isFindLastImg = true;
        if (self.perf.firstScreenObj.t && self.perf.firstScreenObj.intervalFlag) {
            self.perf.firstScreenObj.firstScreenTime = Date.now();
            clearInterval(self.perf.firstScreenObj.t);
            console.log('imgs.length is onloaded，外部结束循环');
        }
        raf.then(function (fp) {
            self.perf.setFirstPaintTime(fp);
            var perfData = self.perf.getPerf();
            console.log(perfData);
            self.report.get(perfData);
        });
    });
};
new Apm();

return Apm;

})));

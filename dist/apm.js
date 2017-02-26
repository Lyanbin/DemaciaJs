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

function obj2str(obj) {
    var keys = Object.keys(obj);
    var str = '';
    for (var i = 0; i < keys.length; i++) {
        var kv = (keys[i]) + "=" + (obj[keys[i]]) + (i === (keys.length - 1) ? '' : '&');
        str += kv;
    }
    return str;
}

var hasStorage = (window.localStorage !== 'undefined');

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

var Xhr = (function (Event$$1) {
    function Xhr(xhrOpt) {
        if ( xhrOpt === void 0 ) xhrOpt = {
        maxNum: 5,
        maxDur: 1e4
    };
        Event$$1.call(this);
        this.xhrOpt = xhrOpt;
        this.msg = [];
        this.count = 0;
        this.lastSentTime = 0;
        var self = this;
        var open = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
            var start = Date.now();
            var tempData = {};
            tempData.method = method;
            tempData.url = url;
            self.count++;
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
                console.log('loadend');
                console.log(self);
                self.msg.push(tempData);
                if (Date.now() - self.lastSentTime > self.xhrOpt.maxDur || self.msg.length > self.xhrOpt.maxNum) {
                    console.log(self.msg);
                    self.lastSentTime = Date.now();
                }
            });
            open.call(this, method, url, async, user, pass);
        };
    }
    if ( Event$$1 ) Xhr.__proto__ = Event$$1;
    Xhr.prototype = Object.create( Event$$1 && Event$$1.prototype );
    Xhr.prototype.constructor = Xhr;
    Xhr.prototype.dataSize = function dataSize (response) {
        return "string" == typeof response ? response.replace(/[^\u0000-\u00ff]/g,"aa").length :
                window.ArrayBuffer && response instanceof ArrayBuffer ? response.byteLength :
                            window.Blob && response instanceof Blob ? response.size :
                                    response && response.length ? response.length : 0;
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
            unloadEventEnd: returnPerfTime(timing, 'unloadEventEnd', navigationStart),
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

var Report = function Report() {
};
Report.prototype.get = function get (url) {
    if (window.navigator && window.navigator.sendBeacon) {
    }
    var img = new Image();
    img.setAttribute('src', url);
    img.setAttribute('style', 'display:none');
    img.onload = function () {
        alert('成功发送');
    };
    img.onerror = function () {
        alert('没成功发送');
    };
    img.src = url;
};
Report.prototype.post = function post () {
};
Report.prototype.ftp = function ftp () {
};

var Apm = function Apm(options) {
    var this$1 = this;
    if ( options === void 0 ) options = {
    url: 'http://127.0.0.1:3000',
    appKey: '',
    isWebview: false
};
    console.log(123+'begin');
    var BEGINTIME = Date.now();
    var raf = new Promise(function (resolve, reject) {
        requestAnimationFrame(function () {
            var FP = Date.now();
            resolve(FP);
        });
    });
    this.options = options;
    this.info = info;
    this.msg = new Msg();
    this.ajaxMsg = new Msg();
    this.src = options.url + '/apm.gif?'
    + "appKey=" + (options.appKey) + "&"
    + "_os=" + (this.info.os) + "&"
    + "_browser=" + (this.info.browser) + "&"
    + "_vn=" + (this.info.vn) + "&";
    this.xhr = new Xhr();
    this.xhr.on('xhr_done', function (payload) {
        console.log(payload);
        (ref = this$1.ajaxMsg).push.apply(ref, payload.map(function (e) { return JSON.stringify(e); }));
        var ref;
    });
    var self = this;
    this.perf = new Perf({
        beginTime: BEGINTIME,
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
        }).then(function () {
            var perfReport = new Report();
            perfReport.get('https://content.nike.com/content/dam/one-nike/en_us/season-2016-sp/Shop/Launch/01-2016/air-jordan-4-retro-alternate-89/Air-Jordan-4-Alternate-89-Pair.jpg.transform/default/Air-Jordan-4-Alternate-89-Pair.jpg');
        });
    });
};
Apm.prototype.report = function report (msg) {
        var this$1 = this;
        if ( msg === void 0 ) msg = {};
    var img = new Image();
    this.msg.push(obj2str(msg));
    if (hasStorage) {
        var s = window.localStorage;
        if (JSON.parse(s.getItem('APM_IS_SENT') === null)) {
            s.setItem('APM_IS_SENT', true);
            s.setItem('APM_MSG', '');
        }
        if (!JSON.parse(s.getItem('APM_IS_SENT'))) {
            this.msg.push(s.getItem('APM_MSG'));
            s.clear();
            s.setItem('APM_IS_SENT', true);
            s.setItem('APM_MSG', '');
        }
    }
    img.onload = function () {
        this$1.msg.clear();
    };
    img.onerror = function () {
        if (hasStorage) {
            var s = window.localStorage;
            var str = s.getItem('APM_MSG');
            s.setItem('APM_IS_SENT', false);
            if (str.indexOf(this$1.msg.getMsg()) !== -1) {
                s.setItem('APM_MSG', this$1.msg.getMsg());
            }
            this$1.msg.clear();
        }
    };
    img.src = this.src + this.msg.getMsg();
};
var apm = new Apm({
    url: 'http://cq01-tdw-bfe02.cq01.baidu.com:8123/api'
});

return Apm;

})));

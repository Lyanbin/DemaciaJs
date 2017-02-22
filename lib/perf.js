/**
 * @file 获取性能信息
 * @author lyb
 */

import {returnPerfTime} from './utils.js';

export default class Perf {

    constructor(timeObj = {
        beginTime: 0,
        onLoadTime: 0,
        domReadyTime: 0,
        firstRequestAnimationFrameTime: 0
    }) {
        this.timeObj = timeObj;
        this.perf = window.performance ? window.performance : window.Performance;
        this.data = {};
    }

    getPerf() {
        if (this.perf && this.perf.timing) {
            let timing = this.perf.timing;
            let navigationStart = timing.navigationStart,
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
            let firstPaint = this.getFirstPaint(timing, this.timeObj.firstRequestAnimationFrameTime);
            if (firstPaint - navigationStart > 0) {
                this.data.firstPaint = Math.round(firstPaint - navigationStart);
            }

            // 首屏时间
            // TODO
            let firstScreenTime = this.firstScreenObj.firstScreenTime;
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

    getFirstPaint(timing, firstRequestAnimationFrameTime) {
        // 先计算chrome和ie高版本
        let firstPaint = 0;
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
    getFirstScreenTime() {
        function getOffsetTop(ele) {
            var offsetTop = ele.offsetTop;
            if (ele.offsetParent !== null) {
                offsetTop += getOffsetTop(ele.offsetParent);
            }
            return offsetTop;
        }

        let firstScreenHeight = window.screen.height;
        let firstScreenImgs = [];
        let self = this;
        this.firstScreenObj = {};
        this.firstScreenObj.isFindLastImg = false;
        this.firstScreenObj.allImgLoaded = false;
        this.firstScreenObj.intervalFlag = true;
        this.firstScreenObj.t = setInterval(function () {
            console.log('循环呢');
            let i, img;
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
                let imgs = document.querySelectorAll('img');
                for (i = 0; i < imgs.length; i++) {
                    console.log('found the imgs:' + imgs.length);
                    img = imgs[i];
                    let imgOffsetTop = getOffsetTop(img);
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
    }

    setOnLoadTime(onLoadTime) {
        this.timeObj.onLoadTime = onLoadTime;
    }

    setDomReadyTime(domReadyTime) {
        this.timeObj.domReadyTime = domReadyTime;
    }

    setBeginTime(beginTime) {
        this.timeObj.beginTime = beginTime;
    }

    setFirstPaintTime(firstPaintTime) {
        this.timeObj.firstRequestAnimationFrameTime = firstPaintTime;
    }
}

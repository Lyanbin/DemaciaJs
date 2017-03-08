/**
 * @file 程序入口
 * @author lyb
 */
import info from './info';
import Msg from './msg';
import Xhr from './xhr';
import Perf from './perf';
import Report from './report';
import Resource from './resource';
import Error from './error';
import {obj2str, hasStorage, eventListener} from './utils';

export default class Apm {
    constructor(options = {
        // 这里需要根据宿主本身的协议来选择是http还是https
        url: '127.0.0.1:3000',
        appKey: 'powerbylyb',
        isWebview: false
    }) {
        console.log(123+'begin');
        // 进入该脚本时间
        const BEGINTIME = Date.now();
        // 白屏时间定位
        let raf = new Promise(function (resolve, reject) {
            requestAnimationFrame(function () {
                const FP = Date.now();
                resolve(FP);
            });
        });
        this.resource = new Resource();
        this.error = new Error();
        // 自定义设置
        this.options = options;
        // 浏览器信息
        this.info = info;
        // 消息栈
        this.msg = new Msg();
        // ajax消息栈, 貌似没啥卵用
        this.ajaxMsg = new Msg();
        // default src
        console.log('options');
        console.log(options);
        // this.src = this.options.url + '/apmget?' + `appKey=${this.options.appKey}&`;
        // 拦截ajax请求
        this.xhr = new Xhr();
        this.xhr.on('xhr_done', payload => {
            // NOTE: 这里得去重，或者重新写一个事件
            console.log(payload);
            this.ajaxMsg.push(...payload.map(e => JSON.stringify(e)));
            // this.report(payload);
        });
        this.report = new Report();

        let self = this;

        this.perf = new Perf({
            beginTime: BEGINTIME,
        });

        this.perf.getFirstScreenTime();

        eventListener(window, 'DOMContentLoaded', function () {
            const DOMREADYTIME = Date.now();
            // domready时间塞入对象
            self.perf.setDomReadyTime(DOMREADYTIME);
            // 查询图片个数，没图片则直接让首屏时间为dom加载完成时间
            let imgs = document.querySelectorAll('img');
            if (!imgs.length) {
                self.perf.firstScreenObj.isFindLastImg = true;
                console.log('imgs.length is DomReady' + imgs.length);
            }
        });

        eventListener(window, 'load', function () {
            const ONLOADTIME = Date.now();
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
                let perfData = self.perf.getPerf();
                console.log(perfData);
                self.report.get(perfData);
            });


        });
    }
}
let apm = new Apm();

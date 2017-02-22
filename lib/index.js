/**
 * @file 程序入口
 * @author guoxianglin@baidu.com
 */
import info from './info';
import Msg from './msg';
import Xhr from './xhr';
import Perf from './perf';
import Report from './report'
import {obj2str, hasStorage, eventListener} from './utils';

export default class Apm {
    constructor(options = {
        url: 'http://127.0.0.1:3000',
        appKey: '',
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

        // 自定义设置
        this.options = options;
        // 浏览器信息
        this.info = info;
        // 消息栈
        this.msg = new Msg();
        // ajax消息栈
        this.ajaxMsg = new Msg();
        // default src
        this.src = options.url + '/apm.gif?'
        + `appKey=${options.appKey}&`
        + `_os=${this.info.os}&`
        + `_browser=${this.info.browser}&`
        + `_vn=${this.info.vn}&`;
        // 拦截ajax请求
        this.xhr = new Xhr();
        this.xhr.on('xhr_done', payload => {
            // NOTE: 这里得去重，或者重新写一个事件
            console.log(payload);
            this.ajaxMsg.push(...payload.map(e => JSON.stringify(e)));
            // this.report(payload);
        });

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
            }).then(function () {
                let perfReport = new Report();
                perfReport.get('https://iiig-s-a-a.akamaihd.net/hphotos-ak-xpa1/t51.2885-15/e35/14583492_1771631776496488_3767788261171265536_n.jpg');
            });


        });
    }

    /**
     * 报告函数
     * @param {Object} msg 传入的消息
     */
    report(msg = {}) {
        // 请求一个1 * 1的gif
        let img = new Image();
        this.msg.push(obj2str(msg));
        // 判断浏览器是否有localStorage
        if (hasStorage) {
            let s = window.localStorage;
            // 若未初始化则先初始化
            if (JSON.parse(s.getItem('APM_IS_SENT') === null)) {
                s.setItem('APM_IS_SENT', true);
                s.setItem('APM_MSG', '');
            }
            // 假如有数据没有发送
            if (!JSON.parse(s.getItem('APM_IS_SENT'))) {
                this.msg.push(s.getItem('APM_MSG'));
                s.clear();
                s.setItem('APM_IS_SENT', true);
                s.setItem('APM_MSG', '');
            }
        }
        img.onload = () => {
            // 成功了之后就清空消息栈
            this.msg.clear();
        };
        img.onerror = () => {
            // 失败的话就存入localStorage
            if (hasStorage) {
                let s = window.localStorage;
                let str = s.getItem('APM_MSG');
                s.setItem('APM_IS_SENT', false);
                // 避免重传相同的消息
                if (str.indexOf(this.msg.getMsg()) !== -1) {
                    s.setItem('APM_MSG', this.msg.getMsg());
                }
                this.msg.clear();
            }
        };
        img.src = this.src + this.msg.getMsg();
    }
}
var apm = new Apm({
    url: 'http://cq01-tdw-bfe02.cq01.baidu.com:8123/api'
});

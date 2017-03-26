/**
 * @file 拦截Ajax请求
 * @author lyb
 */

import Event from './event';
import Report from './report';
import {eventListener} from './utils';
export default class Xhr extends Event {
    constructor(xhrOpt = {
        maxNum: 5, // 最多攒5个
        maxDur: 1e4 // 最多间隔10s
    }) {
        // 继承父类constructor
        // super();
        // 请求信息, etc:
        // this.msg = [{
        //     method: 'get',
        //     url: '/demo',
        //     status: 200,
        //     errCode: 0,
        //     responseSize: 1234,
        // }]
        this.xhrOpt = xhrOpt;
        this.msg = [];
        // 请求总数
        // this.count = 0;
        // 上次发送时间
        this.lastSentTime = 0;
        this.report = new Report();
        let self = this;
        let tempData = {};
        // 保存原始的open方法
        const open = window.XMLHttpRequest.prototype.open;
        // 保存原始的sent方法
        const send = window.XMLHttpRequest.prototype.send;
        // 改写open方法，后续可以更改为柯里化写法，更加安全
        window.XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
            // 请求开始时间
            let start = Date.now();
            tempData = {};
            tempData.method = method;
            tempData.url = url;

            // self.count++;

            eventListener(this, 'load', function () {
                tempData.responseTime = Date.now() - start;
                tempData.status = this.status;
                tempData.errCode = 0;
                // tempData.headerSize = self.dataSize(this.getAllResponseHeaders());
                // headerSize无意义，因为有些header是无法通过getAllresponseHeaders获取的。
                // response需要try catch处理，因为不是所有的response都是字符串
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
                // TODO:这里需要去重，去掉自己域名的东西。
                let reg = new RegExp(self.report.options.url, 'i');
                if (!reg.test(tempData.url)) {
                    self.msg.push(tempData);
                    console.log(self.msg);
                } else {
                    console.log('别开枪，自己人');
                }
                if (self.msg.length > 0 && (Date.now() - self.lastSentTime > self.xhrOpt.maxDur || self.msg.length > self.xhrOpt.maxNum)) {
                    // 这里会把消息发送出去，回调会清空数组
                    self.report.post(self.msg, {}, function () {
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
        // 页面关闭后发送剩余数据
        eventListener(window, 'beforeunload', function () {
            if (self.msg.length !== 0) {
                self.report.post(self.msg, {}, function () {
                    self.msg.length = 0;
                });
            }
        });
    }

    dataSize(response) {
        return 'string' === typeof response ? response.replace(/[^\u0000-\u00ff]/g, 'aa').length
            : window.ArrayBuffer && response instanceof ArrayBuffer ? response.byteLength
            : window.Blob && response instanceof Blob ? response.size
            : response && response.length ? response.length : 0;
    }
}

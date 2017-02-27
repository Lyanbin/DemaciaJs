/**
 * @file 拦截Ajax请求
 * @author lyb
 */
import Event from './event';
import {eventListener} from './utils';
export default class Xhr extends Event {
    constructor(xhrOpt = {
        maxNum: 5, // 最多攒5个
        maxDur: 1e4 // 最多间隔10s
    }) {
        // 继承父类constructor
        super();
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
        this.count = 0;
        // 上次发送时间
        this.lastSentTime = 0;
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

            self.count++;

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
                console.log('loadend');
                console.log(self);
                // TODO:这里需要去重，去掉自己域名的东西。
                self.msg.push(tempData);
                if (Date.now() - self.lastSentTime > self.xhrOpt.maxDur || self.msg.length > self.xhrOpt.maxNum) {
                    // 这里会把消息发送出去，回调会清空数组
                    console.log(self.msg);
                    self.lastSentTime = Date.now();
                }
            });


            // this.addEventListener('load', function () {
            //     // 请求结束时间
            //     const responseTime = new Date() - start;
            //     const status = this.status;
            //     const length = self.msg.length;
            //     const headers = this.getAllResponseHeaders();
            //     const response = this.response;
            //     console.log(typeof response);
            //     self.currentCount++;
            //     console.log('responseSize:', self.responseDataSize(response));
            //     // for (let i = 0; i < length; i++) {
            //     //     if (self.msg[i].method === method
            //     //     && self.msg[i].url === url
            //     //     && self.msg[i].status === status) {
            //     //         self.msg[i].times++;
            //     //         self.msg[i].responseTime += responseTime;
            //     //         break;
            //     //     } else if (i === (length - 1)) {

            //     //         // TODO: 获取的headers是包括换行符的字符串
            //     //         // 需要正则匹配成一个对象
            //     //         // 然后再用`JSON.stringify`来转成对象字符串传到后台

            //     //         self.msg.push({
            //     //             method, url, status, times: 1, responseTime, headers
            //     //         });
            //     //     }
            //     // }
            //     // if (!length) {
            //     //     self.msg.push({
            //     //         method, url, status, times: 1, responseTime, headers
            //     //     });
            //     // }
            //     // if (self.currentCount === self.count) {
            //     //     self.emit('xhr_done', self.msg);
            //     // }
            // });
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
    }

    dataSize(response) {
        return 'string' === typeof response ? response.replace(/[^\u0000-\u00ff]/g, 'aa').length
            : window.ArrayBuffer && response instanceof ArrayBuffer ? response.byteLength
            : window.Blob && response instanceof Blob ? response.size
            : response && response.length ? response.length : 0;
    }
}

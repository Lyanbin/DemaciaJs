/**
 * @file 拦截Ajax请求
 * @author guoxianglin@baidu.com
 */
import Event from './event';
export default class Xhr extends Event {
    constructor() {
        // 继承父类constructor
        super();
        // 请求信息, etc:
        // this.msg = [{
        //     method: 'get',
        //     url: '/demo',
        //     status: 200,
        //     times: 3,
        //     headers: ''
        // }]
        this.msg = [];
        // 请求总数
        this.count = 0;
        // 已处理连接数
        this.currentCount = 0;
        let self = this;
        // 保存原始的open方法
        const open = window.XMLHttpRequest.prototype.open;
        // 改写open方法
        window.XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
            // 请求开始时间
            const start = new Date();

            self.count++;

            // TODO: 还需考虑兼容性问题(attcheEvent)

            this.addEventListener('load', function () {
                // 请求结束时间
                const responseTime = new Date() - start;
                const status = this.status;
                const length = self.msg.length;
                const headers = this.getAllResponseHeaders();

                self.currentCount++;

                for (let i = 0; i < length; i++) {
                    if (self.msg[i].method === method
                    && self.msg[i].url === url
                    && self.msg[i].status === status) {
                        self.msg[i].times++;
                        self.msg[i].responseTime += responseTime;
                        break;
                    } else if (i === (length - 1)) {

                        // TODO: 获取的headers是包括换行符的字符串
                        // 需要正则匹配成一个对象
                        // 然后再用`JSON.stringify`来转成对象字符串传到后台

                        self.msg.push({
                            method, url, status, times: 1, responseTime, headers
                        });
                    }
                }
                if (!length) {
                    self.msg.push({
                        method, url, status, times: 1, responseTime, headers
                    });
                }
                if (self.currentCount === self.count) {
                    self.emit('xhr_done', self.msg);
                }
            });
            // 将上下文传到原始的open方法
            // 并将所有参数传进去
            // 避免原始调用的出错
            open.call(this, method, url, async, user, pass);
        };
    }
}

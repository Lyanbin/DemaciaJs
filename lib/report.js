/**
 * @file 上传功能
 * @author lyb
 */

import {stringify} from './utils';

export default class Report {
    constructor() {}

    /**
     * @param  {string}
     * @return 
     * 考虑到向下降级，固采用url拼接的方法，直接将参数塞入到url中去
     */
    get(url, data) {
        if (window.navigator && window.navigator.sendBeacon) {
            // return navigator.sendBeacon(data, null);
        }
        let img = new Image();
        // 原URL已经格式为http://loaclhost:3000/apm?appkey=abc&
        let urlWithParam = url + 'perf=' + encodeURIComponent(stringify(data));
        console.log(urlWithParam);
        console.log(typeof urlWithParam);
        img.setAttribute('src', url); 
        img.setAttribute('style', 'display:none');

        // onload不会触发，因为没有图片成功被解析。
        img.onload = function () {
            // alert('发送成功，接收成功？');
        };

        // 只捕获到了error事件。但是数据确实被捕获了。
        img.onerror = function () {
            // alert('发送成功，接收失败？');
        };

        img.src = url;

    }

    post() {
        /**
         * 
         */
    }

    ftp() {

    }
    
}



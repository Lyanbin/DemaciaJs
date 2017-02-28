/**
 * @file 上传功能
 * @author lyb
 */

import {eventListener, stringify} from './utils';

export default class Report {
    constructor(options = {
        url: '127.0.0.1:3000',
        appKey: 'powerbylyb',
        isWebview: false
    }) {
        this.options = options;
        this.baseUrl = this.mkurl(options);
    }

    mkurl(options) {
        let url = /^https/i.test(document.URL) ? 'https' : 'http';
        url += '://' + options.url + '/apminfo?appKey=' + options.appKey;
        if (arguments.length > 1) {
            let otherParamObj = arguments[1];
            for (let k in otherParamObj) {
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
    get(data) {
        if (window.navigator && window.navigator.sendBeacon) {
            return navigator.sendBeacon(this.baseUrl, stringify(data));
        }
        let img = new Image();
        // 原URL已经格式为http://loaclhost:3000/apmget?appkey=abc
        // let urlWithParam = url + '&perf=' + encodeURIComponent(stringify(data));
        let urlWithParam = this.baseUrl + '&perf=' + encodeURIComponent(stringify(data));
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
    post(data, header, callback) {
        // ie低版本暂不考虑
        if (window.navigator && window.navigator.sendBeacon) {
            // let nav = navigator.sendBeacon(this.baseUrl, stringify(data));
            // return callback(!nav), nav;
        }

        if (!window.XMLHttpRequest) {
            return false;
        }

        let xhr = new XMLHttpRequest();

        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/html');
        }

        eventListener(xhr, 'readystatechange', function () {
            if (4 === xhr.readState && 200 === xhr.status) {
                return callback(xhr.responseText);
            }
        });

        xhr.open('POST', this.baseUrl, true);

        for (let k in header) {
            xhr.setRequestHeader(k, header[k]);
        }

        xhr.send(stringify(data));
        // xhr.onreadystatechange = function () {
        //     if (4 === xhr.readState && 200 === xhr.status) {
        //         callback(xhr.responseText);
        //     }
        // };
    }

    ftp() {

    }
    
}



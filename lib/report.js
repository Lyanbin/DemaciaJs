/**
 * @file 上传功能
 * @author lyb
 */

export default class Report {
    constructor() {

    }

    /**
     * @param  {string}
     * @return 
     * 考虑到向下降级，固采用url拼接的方法，直接将参数塞入到url中去
     */
    get(url) {
        if (window.navigator && window.navigator.sendBeacon) {
            // return navigator.sendBeacon(url, null);
        }
        let img = new Image();
        img.setAttribute('src', url); 
        img.setAttribute('style', 'display:none');

        img.onload = function () {
            console.log('成功发送');
        };
        img.onerror = function () {
            alert('没成功发送');
        };

        img.src = url;

    }

    post() {

    }
}
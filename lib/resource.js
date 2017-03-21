/**
 * @file 静态资源性能捕获
 * author lyb
 */
import {eventListener} from './utils.js';
import Report from './report';
export default class Resource {

    constructor() {
        this.Report = new Report();
        this.data = [];
        // 当resource满了，需要压入这个buffer中去待处理
        this.dataBuffer = [];
        let self = this;
        this.performance = window.performance ? window.performance : window.Performance;
        eventListener(this.performance, 'resourcetimingbufferfull', function () {
            let tempBuffer = this.performance.getEntriesByType('resource');
            if (tempBuffer) {
                self.dataBuffer = self.dataBuffer.concat(tempBuffer);
                this.performance.clearResourceTimings();
            }
        });
        eventListener(this.performance, 'webkitresourcetimingbufferfull', function () {
            let tempBuffer = this.performance.getEntriesByType('resource');
            if (tempBuffer) {
                self.dataBuffer = self.dataBuffer.concat(tempBuffer);
                this.performance.webkitClearResourceTimings();
            }
        });
        eventListener(window, 'beforeunload', function () {
            self.Report.post(self.getResource());
        });
    }

    getResource() {
        // let performance = window.performance ? window.performance : window.Performance;

        if (this.performance && this.performance.getEntriesByType) {
            let resourceNow = this.performance.getEntriesByType('resource');
            if (resourceNow && this.dataBuffer) {
                // 这里需要合并之前超出界限的内容
                resourceNow = resourceNow.concat(this.dataBuffer);
                this.performance.webkitClearResourceTimings && this.performance.webkitClearResourceTimings();
                this.performance.clearResourceTimings && this.performance.clearResourceTimings();
                this.dataBuffer.length = 0;
            }
            let resourceNowLength = resourceNow.length;
            for (let i = 0; i < resourceNowLength; i++) {
                let temp = resourceNow[i];
                let tempObj = {
                    startTime: temp.startTime > 0 ? temp.startTime : 0,
                    fetchStart: temp.fetchStart > 0 ? temp.fetchStart : 0,
                    domainLookupStart: temp.domainLookupStart > 0 ? temp.domainLookupStart : 0,
                    domainLookupEnd: temp.domainLookupEnd > 0 ? temp.domainLookupEnd : 0,
                    connectStart: temp.connectStart > 0 ? temp.connectStart : 0,
                    connectEnd: temp.connectEnd > 0 ? temp.connectEnd : 0,
                    secureConnectionStart: temp.secureConnectionStart > 0 ? temp.secureConnectionStart : 0,
                    requestStart: temp.requestStart > 0 ? temp.requestStart : 0,
                    responseStart: temp.responseStart > 0 ? temp.responseStart : 0,
                    responseEnd: temp.responseEnd > 0 ? temp.responseEnd : 0,
                    initiatorType: temp.initiatorType,
                    name: temp.name
                };

                // 这里考虑去重，对探针自身的xhr信息进行过滤，或者也可以发送，因为发送后可以看到探针的执行情况
                this.data.push(tempObj);
            }
            return this.data;
        }
    }
}

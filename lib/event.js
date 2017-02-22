/**
 * @file 事件父类
 * @author guoxianglin@baidu.com
 */
export default class Event {
    constructor() {
        this.handlers = {};
    }

    on(name, handler) {
        if (!(this.handlers[name] instanceof Array)) {
            this.handlers[name] = [];
        }
        this.handlers[name].push(handler);
    }

    emit(name, payload) {
        if (this.handlers[name] instanceof Array) {
            this.handlers[name].forEach(cb => {
                cb(payload);
            });
        }
    }

    remove(name, handler) {
        if (this.handlers[name] instanceof Array) {
            this.handlers[name].forEach((e, i) => {
                if (e === handler) {
                    this.handlers[name].splice(i, 1);
                    return false;
                }
            });
        }
    }
}

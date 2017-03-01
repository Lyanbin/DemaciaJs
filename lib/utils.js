/**
 * @file 工具函数
 * 
 */

/**
 * 对象转字符串
 * @param {Object} obj 对象
 * @return {string} 字符串
 */
export function obj2str(obj) {
    let keys = Object.keys(obj);
    let str = '';
    for (let i = 0; i < keys.length; i++) {
        let kv = `${keys[i]}=${obj[keys[i]]}${i === (keys.length - 1) ? '' : '&'}`;
        str += kv;
    }
    return str;
}

/**
 * 序列化接收的参数
 * @param {Object}
 * @return {string}
 */

export function stringify(data) {
    switch (typeof data) {
        case 'object':
            if (!data) {
                return 'null';
            }
            if (data instanceof Array) {
                let arrayLength = data.length;
                let s = '[';
                for (let i = 0; i < arrayLength; i++) {
                    s += (i > 0 ? ',' : '') + stringify(data[i]);
                }
                return s + ']';
            }
            let s = '{';
            let n = 0;
            for (let a in data) {
                if ('function' !== typeof data[a]) {
                    let temp = stringify(data[a]);
                    s += (n > 0 ? ',' : '') + stringify(a) + ':' + temp, n++;
                }
            }
            return s + '}';
        case 'string':
            return '"' + data.replace(/([\"\\])/g, '\\$1').replace(/\n/g, '\\n') + '"';
        case 'number':
            return data.toString();
        case 'boolean':
            return data ? 'true' : 'false';
        case 'function':
            return stringify(data.toString());
        case 'undefined':
            return 'undefined';
        default:
            return 'undefined';
    }
}

// 是否有localStorage
export const hasStorage = (window.localStorage !== 'undefined');

/**
 * 合并两个对象
 *
 * @param {Object} a 对象1
 * @param {Object} b 对象2
 * @return {Object} 返回合并后的对象
 */
export function assign(a, b) {
    let result = {};
    for (let p in a) {
        if (a.hasOwnProperty(p)) {
            result[p] = a[p];
        }
    }
    for (let q in b) {
        if (b.hasOwnProperty(q)) {
            result[q] = b[q];
        }
    }
    return result;
}

/**
 * @param  {Object}
 * @param  {string}
 * @param  {Object} 回调
 * @param  {boolean} 是否捕获
 * @return {Object}
 */
export function eventListener(obj, event, func, useCapture=false) {
    if (obj.addEventListener) {
        return obj.addEventListener(event, func, useCapture);
    } else if (obj.attachEvent) {
        return obj.attachEvent('on' + event, func);
    } else {
        return false;
    }
}

/**
 * @param  {Object}
 * @param  {string}
 * @return {number}
 */
export function returnPerfTime(obj, key, navStart) {
    return obj[key] > 0 ? obj[key] - navStart : 0;
}

/**
 * @file 错误信息收集
 */

export default class Error {
    constructor() {
        this.getError();
    }
    getError() {
        let self = this;
        const orgError = window.onerror;
        // window.onerror = function (msg, url, line, col, error) {
        window.onerror = function (...args) {
            let msg = args[0];
            let url = args[1];
            let line = args[2];
            let col = args[3];
            let error = args[4];
            let newMsg = msg;
            if (error && error.stack) {
                newMsg = self._processStackMsg(error);
            }

            let tempErrorObj = {
                msg: newMsg,
                target: url,
                rowNum: line,
                colNum: col,
                time: Date.now()
            };

            console.log(tempErrorObj);
            orgError && orgError.apply(window, args);
        };
    }

    _processStackMsg(errObj) {
        let stack = errObj.stack
            .replace(/\n/gi, '')
            .split(/\bat\b/)
            .slice(0, 9)
            .join('@')
            .replace(/\?[^:]+/gi, '');

        let msg = errObj.toString();
        if (stack.indexOf(msg) < 0) {
            stack = msg + '@' + stack;
        }
        return stack;
    }

    _processError(errObj) {
        try {
            if (errObj.stack) {
                // 下面这个正则会匹配到一个括号？
                let url = errObj.stack.match('https?://[^\n]+');
                console.log(url);
                url = url ? url[0] : '';
                let rowCols = url.match(':(\\d+):(\\d+)');
                if (!rowCols) {
                    rowCols = [0, 0, 0];
                }
                let stack = this._processStackMsg(errObj);
                return {
                    msg: stack,
                    rowNum: rowCols[1],
                    colNum: rowCols[2],
                    target: url.replace(rowCols[0], '')
                };
            } else {
                // ie的error信息单独处理
                if (errObj.name && errObj.message && errObj.description) {
                    return  {
                        msg: JSON.stringify(errObj)
                    };
                }
            }
        } catch (err) {
            return errObj;
        }
    }

}

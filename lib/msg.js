/**
 * @file msg类，栈结构
 * 
 */

export default class Msg {
    constructor() {
        // etc: ['a=123&b=345&', 'c=123']
        // 最后一个字符串的最后一位不含'&'
        this.msg = [];
    }

    /**
     * 获取消息栈的长度
     * @return {number} 消息栈的长度
     */
    getLength() {
        return this.msg.length;
    }

    /**
     * 获取消息字符串
     * @return {string} 消息字符串
     */
    getMsg() {
        return this.msg.join('');
    }

    /**
     * 将元素压入消息栈中
     * @param {string} ele 字符串元素
     * @return {string} 栈顶元素
     */
    push(ele) {
        const length = this.getLength();
        if (length && ele) {
            // 给前一个加一个'&'
            this.msg[length - 1] += '&';
        }
        // 将元素压入栈中
        return this.msg.push(ele);
    }

    /**
     * 将栈顶元素从消息栈中弹出
     * @return {string} 栈顶元素
     */
    pop() {
        const length = this.getLength();
        if (length) {
            // 给前一个去掉'&'
            let tmpArr = this.msg[length - 1].split('');
            tmpArr.pop();
            this.msg[length - 1] = tmpArr.join('');
        }
        // 将元素从栈内弹出
        return this.msg.pop();
    }

    /**
     * 清空消息栈
     *
     */
    clear() {
        this.msg.length = 0;
    }
}

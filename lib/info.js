/**
 * @file 搜集浏览器信息
 *
 */

// 这部分或者可以交给后端做
// 后端可以获取相应的userAgent

// const ua = window.navigator.userAgent.toLowerCase();
// 自己解析貌似不太准确，待定

/**
 * 解析useragent
 * @return {Object}
 * 不太准确，浏览器版本太多可能需要维护一个字典，交给后端了。
 */

// function parserAgent() {
//     let s = navigator.userAgent.toLowerCase();
//     let match = /(webkit)[ \/]([\w.]+)/.exec(s)
//                 || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(s)
//                 || /(msie) ([\w.]+)/.exec(s)
//                 || !/compatible/.test(s) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(s)
//                 || [];
//     return {name: match[1] || '', version: match[2] || '0'};
// }

/**
 * 判断操作系统
 * @return {string} 操作系统
 */
function defineOs() {
    // TODO: 判断操作系统
    return '';
} 

/**
 * 判断浏览器类型
 * @return {string} 浏览器类型
 */
function defineBrowser() {
    // TODO: 判断浏览器类型
    return '';
}

/**
 * 判断浏览器版本
 * @return {string} 浏览器版本
 */
function defineVn() {
    // TODO: 判断浏览器版本
    return '';
}

/**
 * @return {Object}
 */
function defineMedia() {
    return {
        screenHeight: window.screen && window.screen.height,
        screenWidth: window.screen && window.screen.width
    };
}

export default {
    os: encodeURIComponent(defineOs()),
    browser: encodeURIComponent(defineBrowser()),
    vn: encodeURIComponent(defineVn()),
    screen: defineMedia(),
    userAgent: window.navigator.userAgent.toLowerCase()
};

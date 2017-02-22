module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "globals": {}, // 添加一些全局变量
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4,
            {
                // case 缩进
                'SwitchCase': 1
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        'comma-dangle': ['error', 'never'],
        // 禁止不必要的分号
        'no-extra-semi': 'error',
        // 在文件结尾处保留一个空行
        'eol-last': 'warn',
        // 函数规则
        'space-before-function-paren': ['error', {
            'anonymous': 'always',
            'named': 'never'
        }],
        // 左花括号前的空格
        'space-before-blocks': 'error',
        // 运算符处换行时，运算符必须在新行的行首
        'operator-linebreak': ['error', 'before'],
        // 强制使用分号
        'semi': ['error', 'always'],
        // 关键字不省略{...}
        'curly': ['error', 'all']
    }
};

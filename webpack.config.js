var path = require('path');
var htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function () {
    return {
        entry: {
            'index': ['./lib/index.js']
        },
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'apm.js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: path.join(__dirname, 'node_modules'),
                    include: path.join(__dirname, 'lib'),
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                }
            ]
        },
        plugins: [new htmlWebpackPlugin({
            filename: 'page/index.html',
            title: 'This is DemaciaJs test page!',
            template: 'template/index.ejs',
            inject: 'head'
        })],

    };
};

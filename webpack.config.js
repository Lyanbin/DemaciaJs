var path = require('path');

module.exports = function () {
    return {
        entry: {
            'index': './lib/index.js'
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
        plugins: [],

    }
}

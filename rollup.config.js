/**
 * @file rollup 设置文件
 * @author lyb
 */

import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import alias from 'rollup-plugin-alias';
import eslint from 'rollup-plugin-eslint';
import cleanup from 'rollup-plugin-cleanup';

const IS_PROD = process.env.NODE_ENV === 'production';

const config = {
    entry: 'lib/index.js',
    dest: IS_PROD ? 'dist/apm.min.js' : 'dist/apm.js',
    format: 'umd',
    moduleName: 'Apm',
    sourceMap: false,
    plugins: [
        eslint(),
        buble(),
        alias(),
        filesize(),
        cleanup()
    ]
};

if (IS_PROD) {
    config.plugins.push(
        ...[
            uglify()
        ]
    );
}

export default config;

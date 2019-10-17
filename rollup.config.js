const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');
const { eslint } = require('rollup-plugin-eslint');
const { uglify } = require('rollup-plugin-uglify');
const copy = require('rollup-plugin-copy');
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const { name, version, homepage } = require('./package.json');

const isProd = process.env.NODE_ENV === 'production';
module.exports = ['background', 'content', 'options', 'injected'].map(item => {
    return {
        input: `src/${item}/dev/index.js`,
        output: {
            file: isProd ? `dist/${name}/${item}/index.js` : `src/${item}/index.js`,
            format: 'umd',
            sourcemap: !isProd,
            name: item[0].toUpperCase() + item.slice(1),
        },
        plugins: [
            eslint({
                exclude: ['node_modules/**', 'src/**/dev/*.scss'],
            }),
            json(),
            nodeResolve(),
            commonjs(),
            babel({
                runtimeHelpers: true,
                exclude: 'node_modules/**',
                presets: [
                    [
                        '@babel/env',
                        {
                            modules: false,
                        },
                    ],
                ],
                plugins: ['@babel/plugin-external-helpers', '@babel/plugin-transform-runtime'],
            }),
            postcss({
                plugins: [
                    autoprefixer(),
                    cssnano({
                        preset: 'default',
                    }),
                ],
                sourceMap: !isProd,
                extract: isProd ? `dist/${name}/${item}/index.css` : `src/${item}/index.css`,
            }),
            isProd &&
                uglify({
                    output: {
                        preamble:
                            '/*!\n' +
                            ` * bilibili-live-downloader v${version}\n` +
                            ` * Github: ${homepage}\n` +
                            ` * (c) 2018-${new Date().getFullYear()} Harvey Zack\n` +
                            ' * Released under the MIT License.\n' +
                            ' */\n',
                    },
                }),
            isProd &&
                copy({
                    targets: [
                        {
                            src: [`src/${item}/*.html`],
                            dest: `dist/${name}/${item}/`,
                        },
                        {
                            src: [`src/icons`, `src/manifest.json`],
                            dest: `dist/${name}/`,
                        },
                    ],
                    hook: 'writeBundle',
                }),
        ],
    };
});

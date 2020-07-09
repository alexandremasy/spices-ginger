const path = require('path')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')

const version = process.env.VERSION || require('./package.json').version
const banner =
  `/*!
  * @spices/ginger v${version}
  * (c) ${new Date().getFullYear()} Alexandre Masy
  * @license MIT
  */`

const resolve = _path => path.resolve(__dirname, _path)

export default {
  input: resolve('src/index.js'),
  output: {
    banner,
    format: 'es',
    file: 'dist/spices-ginger.min.js',
    name: 'ginger'
  },
  plugins: [
    node(),
    cjs(),
  ]
};
const path = require('path');

const version = process.env.VERSION || require('./package.json').version
const banner = 
`
@spices/ginger v${version}
(c) ${new Date().getFullYear()} Alexandre Masy
@license MIT
`
const resolve = _path => path.resolve(__dirname, _path);

module.exports = [
  {
    entry: resolve('src/index.js'),
    file: 'spices-ginger.js',
    format: 'umd', 
    env: 'development'
  },
  {
    entry: resolve('src/index.js'),
    file: 'spices-ginger.min.js',
    format: 'umd',
    env: 'production'
  },
  {
    entry: resolve('src/index.module.js'),
    file: 'spices-ginger.modules.js',
    format: 'umd',
    env: 'development'
  },
  {
    entry: resolve('src/index.module.js'),
    file: 'spices-ginger.modules.min.js',
    format: 'umd',
    env: 'production'
  },
  {
    entry: resolve('src/index.app.js'),
    file: 'spices-ginger.app.js',
    format: 'umd',
    env: 'development'
  },
  {
    entry: resolve('src/index.app.js'),
    file: 'spices-ginger.app.min.js',
    format: 'umd',
    env: 'production'
  },
].map(genConfig);


function genConfig(opts){
  const config = {
    devtool: 'source-map',
    entry: opts.entry,
    mode: opts.env,
    resolve:{
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: opts.file,
      library: 'spices-ginger',
      libraryTarget: opts.format
    }
  }

  return config;
}

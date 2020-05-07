const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/index.js',
  mode: 'production',
  resolve:{
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'spices-ginger.js',
    library: 'spices-ginger',
    libraryTarget: 'umd'
  }
};
